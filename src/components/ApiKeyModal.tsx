"use client";

import React, { useState, useEffect } from "react";
import { Key, ExternalLink, Check, ShieldCheck, X } from "lucide-react";

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
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-500">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gemini API Key</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure for real-time live evaluation</p>
          </div>
        </div>

        <div className="p-3 mb-4 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-300">
          <p className="mb-2">
            <strong>Note:</strong> Your API key is stored securely in your browser's <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700">localStorage</code> and is only used to directly query Gemini Flash.
          </p>
          <p>
            If left blank, the app will run in <strong>High-Fidelity Demo Examiner</strong> mode, so you can test all features without a key.
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center justify-between mb-5 text-xs">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline font-medium"
          >
            Get a free API key at Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
          {keyInput && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear key
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs"
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
