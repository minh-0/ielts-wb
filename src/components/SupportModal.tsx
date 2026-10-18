"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("0333049007");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl p-6 sm:p-8 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl cursor-default overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Layout: Left text, Right QR Code */}
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Left Column: Friendly note and bank details */}
          <div className="flex-1 space-y-4 text-left">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 tracking-tight">
                Buy Me a Coffee
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                I used my own Gemini API key so yall can practice and get your writing rated live without having to paste your own key. If the workbench has been helpful for your IELTS prep, I&apos;d really appreciate it if you could help me get a coffee or help pay the subscription, no pressure ofc
              </p>
            </div>

            {/* Account Details Box */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">Account Name:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-wide">
                  LE TUAN MINH
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">Bank:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  MB Bank (Military Bank)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-neutral-200/50 dark:border-neutral-800/50">
                <span className="font-mono font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  0333049007
                </span>
                <button
                  onClick={handleCopyAccount}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: QR Code Image with Rounded Edges */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md">
              <img
                src="/support-qr.jpg"
                alt="VietQR MB Bank - LE TUAN MINH"
                className="w-48 sm:w-56 h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
