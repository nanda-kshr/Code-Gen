import { create } from 'zustand';
import type { FileStructure, GenerationSettings, TerminalMessage } from '../types';

interface Store {
  prompt: string;
  setPrompt: (prompt: string) => void;
  files: FileStructure[];
  setFiles: (files: FileStructure[]) => void;
  addFile: (file: FileStructure) => void;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  settings: GenerationSettings;
  setSettings: (settings: GenerationSettings) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  terminalMessages: TerminalMessage[];
  addTerminalMessage: (message: string, type: TerminalMessage['type']) => void;
  clearTerminal: () => void;
  recentlyAddedFile: string | null;
  setRecentlyAddedFile: (file: string | null) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  files: [],
  setFiles: (files) => set({ files }),
  addFile: (file) =>
    set((state) => {
      const newFiles = [...state.files];
      newFiles.push(file);
      return { files: newFiles, recentlyAddedFile: file.name };
    }),
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  settings: {
    framework: 'react',
    styling: 'tailwind',
    typescript: true,
  },
  setSettings: (settings) => set({ settings }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  terminalMessages: [],
  addTerminalMessage: (text, type) =>
    set((state) => ({
      terminalMessages: [
        ...state.terminalMessages,
        {
          id: crypto.randomUUID(),
          text,
          type,
          timestamp: Date.now(),
        },
      ],
    })),
  clearTerminal: () => set({ terminalMessages: [] }),
  recentlyAddedFile: null,
  setRecentlyAddedFile: (file) => set({ recentlyAddedFile: file }),
  showPreview: false,
  setShowPreview: (show) => set({ showPreview: show }),
}));