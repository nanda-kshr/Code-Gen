export interface FileStructure {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileStructure[];
}

export interface GenerationSettings {
  framework: 'react' | 'vue' | 'svelte';
  styling: 'tailwind' | 'css' | 'scss';
  typescript: boolean;
}

export interface TerminalMessage {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'success';
  timestamp: number;
}