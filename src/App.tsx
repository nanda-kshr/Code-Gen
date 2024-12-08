import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Split from 'react-split';
import { Navbar } from './components/Navbar';
import { PromptInput } from './components/PromptInput';
import { FileExplorer } from './components/FileExplorer';
import { Toaster } from 'react-hot-toast';
import { CodeEditor } from './components/CodeEditor';
import { AuthPage } from './components/Auth';
import { Terminal } from './components/Terminal';

function App() {
  return (

    <Router>
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
          <div className="h-screen flex flex-col">
      
      <PromptInput />
        <Split
          className="flex-1"
          sizes={[20, 80]}
          minSize={200}
          gutterSize={4}
          gutterStyle={() => ({
            backgroundColor: '#f3f4f6',
          })}
        >
          <FileExplorer />
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <CodeEditor />
            </div>
            <div className="h-1/3">
              <Terminal />
            </div>
          </div>
        </Split>
      </div>
      </ProtectedRoute>
        } />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  </Router>


    
  );
}

export default App;