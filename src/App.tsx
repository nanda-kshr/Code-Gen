import React from 'react';
import Split from 'react-split';
import { Navbar } from './components/Navbar';
import { PromptInput } from './components/PromptInput';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { Terminal } from './components/Terminal';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <PromptInput />
        <div className="flex-1 flex overflow-hidden">
          <Split
            sizes={[20, 60,20]}
            minSize={[150, 200,150]}
            gutterSize={5}
            gutterStyle={() => ({
              backgroundColor: '#e5e7eb',
              width: '5px',
              cursor: 'col-resize'
            })}
            className="flex flex-1"
          >
            <FileExplorer />
            <div className="flex flex-col">
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
              
            </div>
            <Terminal />
          </Split>
        </div>
      </div>
    </div>
  );
}

export default App;