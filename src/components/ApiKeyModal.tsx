"use client";

import React, { useState, useEffect } from "react";
import { Key, ExternalLink, Check, X, Sparkles, ShieldCheck, Zap } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg p-6 sm:p-7 bg-white dark:bg-black border border-black/15 dark:border-white/20 rounded-2xl shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.05] text-black dark:text-white">
            <Key className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-black dark:text-white">
              AI Evaluation Mode
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              How IELTSlayer666 scores your writing and speaking
            </p>
          </div>
        </div>

        {/* Option 1: Free Practice Mode (Active by Default) */}
        <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                1. Free Practice Engine (Active by Default)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              {keyInput ? "Available" : "Active Now"}
            </span>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <strong>No setup or API key needed!</strong> You can practice anytime. IELTSlayer666 comes with
            realistic Cambridge IELTS scoring, line-by-line grammar mistake underlines (red), C1/C2
            vocabulary upgrades (violet), and speech pacing metrics completely free out of the box.
          </p>
        </div>

        {/* Option 2: Live Google Gemini AI (Optional) */}
        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-black dark:text-white">
                2. Live Google Gemini AI (Optional)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
              {keyInput ? "Active" : "Optional"}
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Want dynamic, live AI evaluations for your own custom essay prompts? You can connect Google's
            official <strong>Gemini 3.8 Flash</strong> model (Google's most intelligent Flash reasoning model). Google provides free Gemini keys with no credit
            card required.
          </p>

          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 block">
              Paste your Google Gemini API key:
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-black/15 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black/50 dark:focus:border-white/50 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-0.5">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:underline font-medium"
            >
              Get a free key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>

            {keyInput && (
              <button
                onClick={handleClear}
                className="text-red-500 hover:text-red-600 hover:underline cursor-pointer"
              >
                Clear key & use free mode
              </button>
            )}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
          <span>
            <strong>100% Private:</strong> Your key is stored strictly on your own device in your
            browser. It is never uploaded or saved to our servers.
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-medium rounded-xl border border-black/10 dark:border-white/15 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" /> Saved & Activated
              </>
            ) : (
              "Save & Activate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
