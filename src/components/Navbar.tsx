import React from 'react';
import { Code2, Github } from 'lucide-react';

export const Navbar: React.FC = () => {
  const openInSandbox = () => {
    // Implementation for opening in sandbox
    console.log('Opening in sandbox...');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeGenAI</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={openInSandbox}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Open in Sandbox
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
};