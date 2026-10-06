"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  Volume2,
  Sparkles,
  Eraser,
  Copy,
  Check,
  X,
  Palette,
} from "lucide-react";
import { HIGHLIGHT_COLORS, HighlightColorId, lookupOxfordWord } from "@/lib/oxfordDictionary";
import { OxfordModal } from "./OxfordModal";

export function SelectionToolbar() {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [oxfordWord, setOxfordWord] = useState<string | null>(null);
  const [quickSynonyms, setQuickSynonyms] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        // Don't close immediately if the toolbar itself was clicked
        return;
      }

      const text = selection.toString().trim();
      // Only trigger on reasonable word/phrase selections (1 to 100 characters)
      if (text.length >= 1 && text.length <= 100) {
        try {
          const range = selection.getRangeAt(0);
          savedRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            const top =
              rect.top > 60
                ? rect.top + window.scrollY - 52
                : rect.bottom + window.scrollY + 10;
            const left = Math.max(
              16,
              Math.min(window.innerWidth - 330, rect.left + rect.width / 2 - 140)
            );

            setSelectedText(text);
            setPosition({ top, left });

            // Check if there are known Band 8+ alternatives for this word
            const entry = lookupOxfordWord(text);
            if (entry && entry.band8Alternatives && entry.band8Alternatives.length > 0) {
              setQuickSynonyms(entry.band8Alternatives);
            } else {
              setQuickSynonyms(null);
            }
          }
        } catch (e) {
          // ignore selection errors
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }
      // If clicking outside, hide the toolbar
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setPosition(null);
          setSelectedText("");
          setShowColorPicker(false);
          setQuickSynonyms(null);
        }
      }, 100);
    };

    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleApplyHighlight = (colorId: HighlightColorId | "clear") => {
    try {
      const selection = window.getSelection();
      const range =
        selection && !selection.isCollapsed
          ? selection.getRangeAt(0)
          : savedRangeRef.current;

      if (!range) return;

      if (colorId === "clear") {
        // If clear selected, remove existing highlight marks around or inside range
        const commonParent = range.commonAncestorContainer;
        const mark =
          commonParent.nodeType === Node.ELEMENT_NODE
            ? (commonParent as HTMLElement).closest(".ielts-user-highlight")
            : commonParent.parentElement?.closest(".ielts-user-highlight");

        if (mark && mark.parentElement) {
          const parent = mark.parentElement;
          while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
          }
          parent.removeChild(mark);
        }
      } else {
        const color = HIGHLIGHT_COLORS.find((c) => c.id === colorId);
        if (!color) return;

        // Create highlight mark tag
        const mark = document.createElement("mark");
        mark.className = `ielts-user-highlight ielts-hl-${color.id} rounded-sm px-1 py-0.5 cursor-pointer transition-colors`;
        mark.style.backgroundColor = color.bg;
        mark.style.color = "inherit";
        mark.style.borderBottom = `2px solid ${color.border}`;
        mark.title = `Highlighted: ${color.label}`;

        // Surround range content if valid
        try {
          range.surroundContents(mark);
        } catch (err) {
          // Fallback: extract and append
          const contents = range.extractContents();
          mark.appendChild(contents);
          range.insertNode(mark);
        }
      }
    } catch (e) {
      console.warn("Could not apply highlight to selection", e);
    } finally {
      // Clear selection & toolbar
      window.getSelection()?.removeAllRanges();
      setPosition(null);
      setSelectedText("");
      setShowColorPicker(false);
    }
  };

  const handlePronounce = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = selectedText.replace(/[^a-zA-Z\s]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "en-GB"; // Official British accent for IELTS
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenOxford = () => {
    const cleanWord = selectedText.replace(/[^a-zA-Z\s]/g, "").trim();
    setOxfordWord(cleanWord);
    setPosition(null);
  };

  if (!position && !oxfordWord) return null;

  return (
    <>
      {/* Floating Cursor Selection Pill */}
      {position && (
        <div
          ref={toolbarRef}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          className="fixed z-40 flex items-center gap-1.5 p-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-black/15 dark:border-white/15 shadow-xl text-xs animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Oxford Dictionary Lookup Button */}
          <button
            onClick={handleOpenOxford}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-colors shadow-xs"
            title={`Look up "${selectedText}" in Oxford Learner's Dictionaries`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Oxford</span>
          </button>

          {/* British Pronunciation Button */}
          <button
            onClick={handlePronounce}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
            title="Listen to authentic British IELTS pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          </button>

          {/* Palette Color Swatches */}
          <div className="flex items-center gap-1 px-1 border-x border-black/10 dark:border-white/10">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleApplyHighlight(c.id)}
                className="w-4 h-4 rounded-full border border-black/20 dark:border-white/30 cursor-pointer hover:scale-125 transition-transform"
                style={{ backgroundColor: c.dot }}
                title={`Highlight as ${c.label}`}
              />
            ))}
            <button
              onClick={() => handleApplyHighlight("clear")}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-red-500 cursor-pointer"
              title="Clear highlight"
            >
              <Eraser className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            title="Copy text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Quick Synonyms Preview Tooltip (if available) */}
          {quickSynonyms && (
            <div className="relative group">
              <button
                onClick={handleOpenOxford}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 cursor-pointer font-medium text-[11px]"
                title="View Band 8+ academic alternatives"
              >
                <Sparkles className="w-3 h-3 text-violet-500" />
                <span>Band 8+</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Built-in Oxford Learner's Dictionary Modal */}
      {oxfordWord && (
        <OxfordModal
          isOpen={Boolean(oxfordWord)}
          word={oxfordWord}
          onClose={() => setOxfordWord(null)}
        />
      )}
    </>
  );
}
