import React from 'react';
import { Settings, Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateCode } from '../services/gemini';
import { SettingsPanel } from './SettingsPanel';

export const PromptInput: React.FC = () => {
  const {
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    setFiles,
    addFile,
    addTerminalMessage,
    settings,
    setShowPreview,
    setSelectedFile,
  } = useStore();
  const [showSettings, setShowSettings] = React.useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setFiles([]);
    setSelectedFile(null);
    addTerminalMessage(`Generating code for prompt: ${prompt}`, 'command');
    addTerminalMessage(`Using settings: ${JSON.stringify(settings, null, 2)}`, 'output');

    try {
      await generateCode(
        prompt,
        settings,
        (message) => {
          addTerminalMessage(message, 'output');
        },
        (file) => {
          addFile(file);
          setSelectedFile(file.name);
          // Show preview after generation
          if (file.name.endsWith('.html')) {
            setShowPreview(true);
          }
        }
      );

      addTerminalMessage('Code generation completed successfully!', 'success');
    } catch (error) {
      addTerminalMessage(`Error generating code: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
          >
            <Wand2 className="w-5 h-5" />
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
};