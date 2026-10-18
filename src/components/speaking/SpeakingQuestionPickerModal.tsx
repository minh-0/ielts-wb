"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { AuthenticSpeakingPrompt } from "@/lib/speakingAuthenticData";
import { Search, Shuffle, Check, X, ChevronDown, Clock, BookOpen } from "lucide-react";

interface SpeakingQuestionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: AuthenticSpeakingPrompt[];
  selectedPromptId: string;
  onSelectPrompt: (prompt: AuthenticSpeakingPrompt) => void;
}

export function SpeakingQuestionPickerModal({
  isOpen,
  onClose,
  prompts,
  selectedPromptId,
  onSelectPrompt,
}: SpeakingQuestionPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<number | "All">("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [isPartOpen, setIsPartOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const partDropdownRef = useRef<HTMLDivElement>(null);
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (partDropdownRef.current && !partDropdownRef.current.contains(e.target as Node)) {
        setIsPartOpen(false);
      }
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(e.target as Node)) {
        setIsTopicOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Esc to close dropdowns or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isPartOpen) {
          setIsPartOpen(false);
          return;
        }
        if (isTopicOpen) {
          setIsTopicOpen(false);
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPartOpen, isTopicOpen, onClose]);

  // Extract unique topics
  const topics = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => {
      if (p.topic) set.add(p.topic);
    });
    return ["All", ...Array.from(set)];
  }, [prompts]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (selectedPart !== "All" && p.part !== selectedPart) return false;
      if (selectedTopic !== "All" && p.topic !== selectedTopic) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchQuestion = p.question.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchSource = p.sourceBadge.toLowerCase().includes(q);
      const matchColloc = p.targetCollocations.some((c) => c.phrase.toLowerCase().includes(q));

      return matchQuestion || matchTopic || matchSource || matchColloc;
    });
  }, [prompts, selectedPart, selectedTopic, searchQuery]);

  const handleShuffle = () => {
    if (filteredPrompts.length === 0) return;
    const randomIdx = Math.floor(Math.random() * filteredPrompts.length);
    onSelectPrompt(filteredPrompts[randomIdx]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search row */}
        <div className="p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-900 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, question, or collocations..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none transition-colors text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleShuffle}
            title="Random prompt"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 shrink-0 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Random</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-3 sm:px-4 py-2 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center gap-3 relative z-20">
          {/* Part Filter */}
          <div className="relative shrink-0" ref={partDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsPartOpen(!isPartOpen);
                setIsTopicOpen(false);
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 cursor-pointer py-1 transition-colors"
            >
              <span>{selectedPart === "All" ? "All Parts" : `Part ${selectedPart}`}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isPartOpen ? "rotate-180" : ""}`} />
            </button>

            {isPartOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-neutral-900 p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                {(["All", 1, 2, 3] as const).map((part) => (
                  <button
                    key={String(part)}
                    type="button"
                    onClick={() => {
                      setSelectedPart(part);
                      setIsPartOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedPart === part
                        ? "bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                    }`}
                  >
                    <span>{part === "All" ? "All Parts" : `Part ${part}`}</span>
                    {selectedPart === part && <Check className="w-3 h-3 text-neutral-900 dark:text-neutral-100" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Topic Filter */}
          <div className="relative shrink-0" ref={topicDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsTopicOpen(!isTopicOpen);
                setIsPartOpen(false);
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 cursor-pointer py-1 transition-colors"
            >
              <span className="truncate max-w-[150px]">{selectedTopic === "All" ? "All Topics" : selectedTopic}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${isTopicOpen ? "rotate-180" : ""}`} />
            </button>

            {isTopicOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-56 max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(t);
                      setIsTopicOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedTopic === t
                        ? "bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                    }`}
                  >
                    <span className="truncate">{t}</span>
                    {selectedTopic === t && <Check className="w-3 h-3 text-neutral-900 dark:text-neutral-100 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="ml-auto text-[11px] text-neutral-600 dark:text-neutral-400 font-medium shrink-0">
            {filteredPrompts.length} {filteredPrompts.length === 1 ? "prompt" : "prompts"}
          </span>
        </div>

        {/* List of prompts (Clean Hairline Divided, Zero Rounded Card Boxes) */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-200/25 dark:divide-white/5">
          {filteredPrompts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-600 dark:text-neutral-400">
              No matching speaking prompts found. Try another search keyword or clear filters.
            </div>
          ) : (
            filteredPrompts.map((p) => {
              const isSelected = p.id === selectedPromptId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPrompt(p);
                    onClose();
                  }}
                  className={`p-3.5 transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-neutral-100/70 dark:bg-neutral-900/60 border-l-2 border-neutral-900 dark:border-neutral-100 pl-3"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Part {p.part}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {p.topic}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                        {p.sourceBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{p.targetDurationSec}s</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                    {p.question}
                  </p>

                  {p.cueCardBullets && p.cueCardBullets.length > 0 && (
                    <div className="border-l-2 border-neutral-200/60 dark:border-neutral-800/60 pl-3 my-1.5 space-y-0.5">
                      {p.cueCardBullets.map((b, i) => (
                        <div key={i} className="text-[11px] text-neutral-600 dark:text-neutral-400">
                          – {b}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collocation preview */}
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap text-[11px] text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Chunks:</span>
                    <span>
                      {p.targetCollocations.map((c) => c.phrase).join(" • ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
