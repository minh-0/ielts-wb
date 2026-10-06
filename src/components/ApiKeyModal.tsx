"use client";

import React, { useState, useEffect } from "react";
import { Key, ExternalLink, Check, X } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("gemini_api_key") || "";
    setKeyInput(stored);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanKey = keyInput.trim();
    localStorage.setItem("gemini_api_key", cleanKey);
    onKeySaved(cleanKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setKeyInput("");
    onKeySaved("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-black border border-black/15 dark:border-white/20 rounded-2xl shadow-xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] text-black dark:text-white">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">Gemini API Key</h3>
            <p className="text-xs text-neutral-500 font-normal">Real-time live model grading</p>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Stored locally in your browser. Leave blank to use the built-in diagnostic engine without a key.
        </p>

        <div>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-black/10 dark:border-white/15 bg-transparent text-black dark:text-white focus:outline-none focus:border-black/40 dark:focus:border-white/40 font-mono"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-neutral-500 hover:text-black dark:hover:text-white hover:underline text-[11px]"
          >
            Get free key at Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
          {keyInput && (
            <button
              onClick={handleClear}
              className="text-neutral-400 hover:text-black dark:hover:text-white text-[11px] cursor-pointer"
            >
              Clear key
            </button>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 cursor-pointer shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" /> Saved
              </>
            ) : (
              "Save key"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
