"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FileContextValue {
  currentFile: {
    path: string | null;
    content: string | null;
    language?: string;
  } | null;
  setCurrentFile: (file: { path: string | null; content: string | null; language?: string } | null) => void;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [currentFile, setCurrentFile] = useState<{
    path: string | null;
    content: string | null;
    language?: string;
  } | null>(null);

  return (
    <FileContext.Provider value={{ currentFile, setCurrentFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext(): FileContextValue {
  const ctx = useContext(FileContext);
  if (!ctx) {
    throw new Error("useFileContext must be used within FileProvider");
  }
  return ctx;
}

