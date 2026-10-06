"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Volume2,
  ExternalLink,
  X,
  Layers,
  Check,
  Copy,
} from "lucide-react";
import { lookupOxfordWord, OxfordDictionaryEntry } from "@/lib/oxfordDictionary";

interface OxfordModalProps {
  isOpen: boolean;
  word: string;
  onClose: () => void;
}

export function OxfordModal({ isOpen, word, onClose }: OxfordModalProps) {
  const [entry, setEntry] = useState<OxfordDictionaryEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [accent, setAccent] = useState<"uk" | "us">("uk");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (word) {
      setEntry(lookupOxfordWord(word));
    }
  }, [word]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const playPronunciation = (lang: "en-GB" | "en-US") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(entry.word);
    utterance.lang = lang;
    utterance.rate = 0.88; // Slightly measured examiner pace

    // Look for matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) =>
      lang === "en-GB"
        ? v.lang.startsWith("en-GB") || v.name.includes("British") || v.name.includes("UK")
        : v.lang.startsWith("en-US") || v.name.includes("US")
    );
    if (targetVoice) utterance.voice = targetVoice;

    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyWord = () => {
    navigator.clipboard.writeText(`${entry.word} (${entry.partOfSpeech}) — ${entry.definition}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-neutral-950 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 cursor-default max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Oxford Learner's Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-serif font-bold text-sm shadow-xs">
              O
            </div>
            <div>
              <div className="text-xs font-semibold tracking-tight text-black dark:text-white flex items-center gap-1.5">
                Oxford Learner's Dictionaries
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                  Built-in
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-normal">
                Official British Council & Cambridge English reference
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyWord}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer mr-6 transition-colors"
            title="Copy definition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Word Title & Phonetics */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="text-3xl font-semibold tracking-tight font-serif text-black dark:text-white">
              {entry.word}
            </h2>
            <span className="text-xs font-mono italic text-neutral-500">
              {entry.partOfSpeech}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                entry.cefrLevel === "C2"
                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300/80 dark:bg-purple-950/40 border border-purple-500/25 dark:border-purple-800/30"
                  : entry.cefrLevel === "C1"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25"
                  : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25"
              }`}
            >
              CEFR {entry.cefrLevel}
            </span>
          </div>

          {/* Pronunciation audio controls */}
          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
              {entry.phonetic}
            </span>

            <div className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <button
                onClick={() => {
                  setAccent("uk");
                  playPronunciation("en-GB");
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  accent === "uk"
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
                title="Play British English pronunciation (IELTS Standard)"
              >
                <Volume2 className="w-3 h-3 text-red-500 dark:text-rose-400/80" />
                <span>UK (IELTS)</span>
              </button>

              <button
                onClick={() => {
                  setAccent("us");
                  playPronunciation("en-US");
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  accent === "us"
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
                title="Play American English pronunciation"
              >
                <Volume2 className="w-3 h-3 text-blue-500" />
                <span>US</span>
              </button>
            </div>
          </div>
        </div>

        {/* Definition Box */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Definition
          </div>
          <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed font-normal">
            {entry.definition}
          </p>
        </div>

        {/* IELTS Example Sentence */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Authentic Example
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20 text-xs text-neutral-800 dark:text-neutral-200 italic leading-relaxed">
            "{entry.example}"
          </div>
        </div>

        {/* Academic Collocations */}
        {entry.collocations && entry.collocations.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              High-Scoring Collocations
            </div>
            <div className="flex flex-wrap gap-1.5">
              {entry.collocations.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
          <a
            href={entry.oxfordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <span>Open on OxfordLearnersDictionaries.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
