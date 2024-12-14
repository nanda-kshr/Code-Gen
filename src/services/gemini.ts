import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerationSettings, FileStructure } from '../types';

const API_KEY = 'AIzaSyBzBSgk43pDbOoQwKbi0RJqEZOl6zaMf4w';
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

    2. Generate the files in logical order, such as:
      - Configuration files (e.g., tailwind.config.js, tsconfig.json)
      - Entry point files (e.g., index.tsx)
      - Components, utilities, and styles
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
    
	4.	All files should include:
	•	Proper directory structure (e.g., src/components/Button.tsx)
	•	Correct imports for all dependencies
	•	Valid and complete code
	5.	Return the files as an array of JSON objects.
	6.	Ensure that the output adheres to valid JSON standards:
	•	Strings must use double quotes ("), not backticks or single quotes.
	•	Escape special characters (e.g., line breaks \\n, double quotes \\").

  Output example
  \`\`\`json[
  {
    "type": "file",
    "path": "tailwind.config.js",
    "content": "module.exports = { theme: { extend: {}, }, plugins: [], };",
    "description": "Tailwind CSS configuration file"
  },
  {
    "type": "file",
    "path": "src/index.tsx",
    "content": "import React from \\"react\\"; import ReactDOM from \\"react-dom\\"; ReactDOM.render(<App />, document.getElementById(\\"root\\"));",
    "description": "Application entry point"
  },
  {
    "type": "complete"
  }
]\`\`\`

    ### **Improvements Made:**
1. **Emphasis on Valid JSON Standards:**
   - Strings must use double quotes.
   - Special characters (e.g., line breaks, quotes) are escaped to conform to JSON.

2. **Logical Structure:**
   - Files are generated in a clear, logical order (e.g., configuration, components, utilities).

3. **Clear Example Output:**
   - Example JSON structure demonstrates formatting and escaping for file content.

4. **Focus on Clean JSON:**
   - Ensures Google Gemini outputs directly usable JSON, avoiding parsing issues.

5. **Comprehensive Guidance:**
   - Includes details on directory structure, valid imports, and code consistency.
   `;

    onProgress('Starting code generation...');
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    // const text =  '```json { "type": "file", "path": "tailwind.config.js", "content": `{ theme: { extend: {}, }, plugins: [], }`, "description": "Tailwind configuration file" } ``` ```json { "type": "file", "path": "src/index.tsx", "content": `import React from "react"; import ReactDOM from "react-dom"; import { App } from "./App"; ReactDOM.render( <React.StrictMode> <App /> </React.StrictMode>, document.getElementById("root") );`, "description": "Entry point of the application" } ``` ```json { "type": "file", "path": "src/App.tsx", "content": `import "./styles.css"; const App = () => { return ( <div className="container mx-auto px-4"> <Calculator /> </div> ); }; export default App; `, "description": "Root component of the application" } ``` ```json { "type": "file", "path": "src/components/Calculator.tsx", "content": `import { useState } from "react"; import { Input, Button } from "./shared"; import { evaluate } from "../utils"; const Calculator = () => { const [input, setInput] = useState(""); const handleClick = (value) => { if (value === "=") { setInput(evaluate(input)); } else if (value === "C") { setInput(""); } else { setInput(input + value); } } return ( <div className="flex flex-col items-end bg-gray-100 p-5 rounded-md"> <Input value={input} /> <div className="grid grid-cols-4 gap-4 mt-4"> <Button value="7" onClick={handleClick} /> <Button value="8" onClick={handleClick} /> <Button value="9" onClick={handleClick} /> <Button value="/" onClick={handleClick} /> <Button value="4" onClick={handleClick} /> <Button value="5" onClick={handleClick} /> <Button value="6" onClick={handleClick} /> <Button value="*" onClick={handleClick} /> <Button value="1" onClick={handleClick} /> <Button value="2" onClick={handleClick} /> <Button value="3" onClick={handleClick} /> <Button value="-" onClick={handleClick} /> <Button value="0" onClick={handleClick} /> <Button value="C" onClick={handleClick} /> <Button value="=" onClick={handleClick} /> <Button value="+" onClick={handleClick} /> </div> </div> ); }; export default Calculator; `, "description": "Calculator component" } ``` ```json { "type": "file", "path": "src/components/shared/Input.tsx", "content": `const Input = ({ value }) => { return ( <input type="text" value={value} className="w-full border border-gray-300 px-4 py-2 rounded-md text-right" /> ); }; export default Input; `, "description": "Input component" } ``` ```json { "type": "file", "path": "src/components/shared/Button.tsx", "content": `const Button = ({ value, onClick }) => { return ( <button onClick={onClick} className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white hover:bg-gray-100">{value}</button> ); }; export default Button; `, "description": "Button component" } ``` ```json { "type": "file", "path": "src/utils/index.ts", "content": `export const evaluate = (expression: string) => { // eslint-disable-next-line no-eval return eval(expression); }; `, "description": "Utility function to evaluate mathematical expressions" } ``` ```json { "type": "file", "path": "src/styles.css", "content": `.container {\n max-width: 600px;\n}\n\n.border {\n border: 1px solid #ccc;\n}\n\n.rounded-md {\n border-radius: 4px;\n}\n\n.bg-gray-100 {\n background-color: #f3f4f6;\n}\n\n.text-right {\n text-align: right;\n}\n\n.p-5 {\n padding: 1.25rem;\n}\n\n.mt-4 {\n margin-top: 1rem;\n}\n\n.grid {\n display: grid;\n}\n\n.grid-cols-4 {\n grid-template-columns: repeat(4, 1fr);\n}\n\ngap-4 {\n gap: 1rem;\n}\n\nhover:bg-gray-100:hover {\n background-color: #e5e7eb !important;\n} `, "description": "Global styles for the application" } ``` ```json { "type": "complete" } ```';
    const cleanedString = text.replace(/^```json\s*/g, '').replace(/\s*```$/g, '').trim(); ;
    console.log(cleanedString);
    //const jsonArray = JSON.parse(cleanedString.trim())


    const files: GeneratedFile[] = [];
    const fileStructures = new Map<string, FileStructure>();
    
    // Split by possible JSON objects
    //const jsonObjects = text.match(/\{[^{}]*\}/g) || [];
    const jsonData = JSON.parse(cleanedString);

    for (const data of jsonData) {
      try {
        console.log(data);
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
    console.log(error);
    throw error;
  }
}