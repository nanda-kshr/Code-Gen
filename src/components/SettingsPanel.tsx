import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, setSettings } = useStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Generation Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Framework
            </label>
            <select
              value={settings.framework}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  framework: e.target.value as any,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Styling
            </label>
            <select
              value={settings.styling}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  styling: e.target.value as any,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="css">Plain CSS</option>
              <option value="scss">SCSS</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="typescript"
              checked={settings.typescript}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  typescript: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label
              htmlFor="typescript"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Use TypeScript
            </label>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};