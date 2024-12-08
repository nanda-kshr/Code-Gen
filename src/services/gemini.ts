import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerationSettings, FileStructure } from '../types';

const API_KEY = 'AIzaSyBy_HRuyOMk_HRXcOdZDO74qf2TKaekAXc';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GeneratedFile {
  path: string;
  content: string;
}

function createFileStructure(path: string, content: string, description: string): FileStructure {
  const pathParts = path.split('/');
  const name = pathParts[pathParts.length - 1];
  
  if (pathParts.length === 1) {
    return {
      name,
      type: 'file',
      content,
      description
    };
  }

  // Create directory structure
  const dirPath = pathParts.slice(0, -1);
  let currentStructure: FileStructure = {
    name: dirPath[0],
    type: 'directory',
    children: []
  };

  let currentLevel = currentStructure;
  for (let i = 1; i < dirPath.length; i++) {
    const newDir: FileStructure = {
      name: dirPath[i],
      type: 'directory',
      children: []
    };
    currentLevel.children!.push(newDir);
    currentLevel = newDir;
  }

  currentLevel.children!.push({
    name,
    type: 'file',
    content,
    description
  });

  return currentStructure;
}

export async function generateCode(
  prompt: string,
  settings: GenerationSettings,
  onProgress: (message: string) => void,
  onFileGenerated: (file: FileStructure) => void
): Promise<GeneratedFile[]> {
  try {
    onProgress('Initializing Gemini AI...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `You are an expert full-stack developer. Generate the complete code for: ${prompt}
    
    Use the following settings:
    - Framework: ${settings.framework}
    - Styling: ${settings.styling}
    - TypeScript: ${settings.typescript}

    Generate files one by one, in a logical order (e.g., configuration files first, then source files).
    For each file, return a JSON object in this format:
    {
      "type": "file",
      "path": "relative/path/to/file",
      "content": "file content",
      "description": "brief description of the file's purpose"
    }

    End the generation with:
    {
      "type": "complete"
    }

    Important:
    - Include proper directory structure (e.g., src/components/Button.tsx)
    - Provide clear descriptions for each file
    - Ensure all imports are correct
    - Generate valid, complete code`;

    onProgress('Starting code generation...');
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    const files: GeneratedFile[] = [];
    const fileStructures = new Map<string, FileStructure>();
    
    // Split by possible JSON objects
    const jsonObjects = text.match(/\{[^{}]*\}/g) || [];
    
    for (const jsonStr of jsonObjects) {
      try {
        const data = JSON.parse(jsonStr);
        if (data.type === 'file') {
          onProgress(`Generating ${data.path}...`);
          files.push({
            path: data.path,
            content: data.content
          });
          
          // Create file structure
          const structure = createFileStructure(data.path, data.content, data.description);
          
          // Get the root directory or file name
          const rootName = data.path.split('/')[0];
          if (!fileStructures.has(rootName)) {
            fileStructures.set(rootName, structure);
            onFileGenerated(structure);
          } else if (structure.type === 'directory') {
            // Merge with existing directory
            const existing = fileStructures.get(rootName)!;
            existing.children = [...(existing.children || []), ...(structure.children || [])];
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
        } else if (data.type === 'complete') {
          onProgress('Code generation completed successfully!');
        }
      } catch (e) {
        console.warn('Failed to parse JSON:', e);
      }
    }
    
    return files;
  } catch (error) {
    onProgress(`Error: ${error.message}`);
    throw error;
  }
}