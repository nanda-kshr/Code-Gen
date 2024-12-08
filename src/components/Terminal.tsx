import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Terminal: React.FC = () => {
  const { terminalMessages, clearTerminal } = useStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalMessages]);

  const getMessageClass = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      case 'command':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <button
          onClick={clearTerminal}
          className="text-gray-400 hover:text-gray-200"
          title="Clear terminal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap"
      >
        {terminalMessages.map((message) => (
          <div
            key={message.id}
            className={`${getMessageClass(message.type)} mb-1`}
          >
            {message.type === 'command' ? '$ ' : ''}
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};