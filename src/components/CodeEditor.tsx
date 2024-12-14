import React from 'react';
import { Eye, Code2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';

export const CodeEditor: React.FC = () => {
  const { selectedFile, files } = useStore();
  const [showPreview, setShowPreview] = React.useState(false);

  const selectedFileContent = React.useMemo(() => {
    const findContent = (fileList: any[], path: string): string | undefined => {
      const parts = path.split('/');
      let current = fileList;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const found = current.find(f => f.name === part);
        
        if (!found) return undefined;
        
        if (i === parts.length - 1) {
          return found.content;
        }
        
        if (found.children) {
          current = found.children;
        } else {
          return undefined;
        }
      }
    };
    
    return selectedFile ? findContent(files, selectedFile) : '';
  }, [selectedFile, files]);

  const getLanguage = (filename: string): string => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Code2 className="w-12 h-12 mx-auto mb-2" />
          <p>Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
          title={showPreview ? 'Show Code' : 'Show Preview'}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      {showPreview ? (
        <div className="h-full p-4 bg-white">
          <iframe
            title="Preview"
            className="w-full h-full border-0"
            srcDoc={selectedFileContent}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <Editor
          height="100%"
          language={getLanguage(selectedFile)}
          theme="vs-dark"
          value={selectedFileContent}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  );
};