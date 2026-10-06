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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-950 border-3 border-gray-900 dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]">
        {/* Top thick red stripe */}
        <div className="h-1.5 bg-red-600 -mx-6 -mt-6 mb-5" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 border-2 border-red-600 bg-red-600 text-white">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-950 dark:text-white uppercase tracking-tight">Gemini API Key</h3>
            <p className="text-xs text-gray-500 font-medium">Real-Time Live Evaluation</p>
          </div>
        </div>

        <div className="p-3 mb-4 text-xs border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <p className="mb-2">
            <strong>Security:</strong> Key is stored in your local browser and sent directly to Google Gemini Flash API.
          </p>
          <p>
            If left blank, the app will run with the <strong>Built-in High-Fidelity Examiner Engine</strong>, allowing free testing without a key.
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-black uppercase text-gray-900 dark:text-gray-200">
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 text-sm border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:outline-none focus:border-red-600 font-mono"
          />
        </div>

        <div className="flex items-center justify-between mb-5 text-xs font-bold">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-600 hover:underline"
          >
            Get free key from Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
          {keyInput && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-red-600 underline cursor-pointer"
            >
              Clear key
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-black uppercase border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black uppercase bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Saved!
              </>
            ) : (
              "Save Key"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
