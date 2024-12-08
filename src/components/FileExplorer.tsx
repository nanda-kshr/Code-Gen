import React from 'react';
import { Folder, FileCode } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { FileStructure } from '../types';

const FileItem: React.FC<{
  file: FileStructure;
  depth?: number;
  isNew?: boolean;
  path?: string;
}> = ({ file, depth = 0, isNew, path = '' }) => {
  const { selectedFile, setSelectedFile } = useStore();
  const paddingLeft = `${depth * 1}rem`;
  const fullPath = path ? `${path}/${file.name}` : file.name;

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 ${
          selectedFile === fullPath ? 'bg-blue-50' : ''
        } ${isNew ? 'animate-pulse' : ''}`}
        style={{ paddingLeft }}
        onClick={() => file.type === 'file' && setSelectedFile(fullPath)}
      >
        {file.type === 'directory' ? (
          <Folder className="w-4 h-4 mr-2 text-gray-500" />
        ) : (
          <FileCode className="w-4 h-4 mr-2 text-gray-500" />
        )}
        <span className="text-sm flex-1">{file.name}</span>
        {file.description && (
          <span className="text-xs text-gray-400 truncate max-w-[150px]">
            {file.description}
          </span>
        )}
      </div>
      {file.type === 'directory' &&
        file.children?.map((child) => (
          <FileItem
            key={`${fullPath}/${child.name}`}
            file={child}
            depth={depth + 1}
            isNew={isNew}
            path={fullPath}
          />
        ))}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const { files, recentlyAddedFile } = useStore();

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-2 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Files</h2>
      </div>
      <div className="overflow-auto">
        {files.map((file) => (
          <FileItem
            key={file.name}
            file={file}
            isNew={recentlyAddedFile === file.name}
          />
        ))}
      </div>
    </div>
  );
};