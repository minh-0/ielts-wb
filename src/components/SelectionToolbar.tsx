"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  Volume2,
  Eraser,
  Copy,
  Check,
  X,
  Palette,
} from "lucide-react";
import { HIGHLIGHT_COLORS, HighlightColorId, lookupOxfordWord } from "@/lib/oxfordDictionary";
import { OxfordModal } from "./OxfordModal";

function unwrapElement(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function removeMarksInRange(range: Range) {
  try {
    const container = range.commonAncestorContainer;
    const root =
      container.nodeType === Node.ELEMENT_NODE
        ? (container as HTMLElement)
        : container.parentElement;
    if (!root) return;

    const marks = root.querySelectorAll(".ielts-user-highlight");
    marks.forEach((m) => {
      if (range.intersectsNode(m)) {
        unwrapElement(m as HTMLElement);
      }
    });
  } catch (e) {
    // ignore
  }
}

export function SelectionToolbar() {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeHighlightColor, setActiveHighlightColor] = useState<HighlightColorId | null>(null);
  const [oxfordWord, setOxfordWord] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleSelectionChange = (e: MouseEvent) => {
      // Don't reposition if user clicked inside the toolbar itself
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }

      // Check for regular DOM selection
      const selection = window.getSelection();
      let text = selection ? selection.toString().trim() : "";
      let hasValidSelection = false;
      let targetTop = 0;
      let targetLeft = 0;
      let existingColor: HighlightColorId | null = null;

      if (selection && !selection.isCollapsed && text.length >= 1 && text.length <= 120) {
        try {
          const range = selection.getRangeAt(0);

          // STRICT CHECK: Only trigger selection & highlighting inside paragraph containers
          const container = range.commonAncestorContainer;
          const startEl =
            container.nodeType === Node.ELEMENT_NODE
              ? (container as HTMLElement)
              : container.parentElement;

          const paragraphContainer = startEl?.closest(
            "[data-paragraph='true'], .ielts-paragraph, .ielts-essay-paragraph"
          );

          if (!paragraphContainer) {
            // Selected outside of the paragraph: dismiss and ignore
            setPosition(null);
            setSelectedText("");
            setActiveHighlightColor(null);
            return;
          }

          savedRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();

          // Check if selection is already inside an existing highlight mark
          const existingMark = startEl?.closest(".ielts-user-highlight") as HTMLElement | null;
          if (existingMark && existingMark.dataset.colorId) {
            existingColor = existingMark.dataset.colorId as HighlightColorId;
          }

          if (rect.width > 0 && rect.height > 0) {
            // FIXED VIEWPORT POSITIONING (No window.scrollY because toolbar is fixed)
            targetTop =
              rect.top > 60
                ? Math.max(12, rect.top - 52)
                : Math.min(window.innerHeight - 60, rect.bottom + 10);
            targetLeft = Math.max(
              16,
              Math.min(window.innerWidth - 340, rect.left + rect.width / 2 - 140)
            );
            hasValidSelection = true;
          }
        } catch (err) {
          // fallback to mouse position
        }
      }

      if (hasValidSelection && text) {
        setSelectedText(text);
        setPosition({ top: targetTop, left: targetLeft });
        setActiveHighlightColor(existingColor);
      } else {
        setPosition(null);
        setSelectedText("");
        setActiveHighlightColor(null);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }
      setTimeout(() => {
        const selection = window.getSelection();
        const isCollapsed = !selection || selection.isCollapsed;

        if (isCollapsed) {
          setPosition(null);
          setSelectedText("");
          setActiveHighlightColor(null);
        }
      }, 120);
    };

    const handleScroll = () => {
      // When scrolling, dismiss toolbar to avoid floating disjointed from text
      setPosition(null);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
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

      // 1. Check if the selection is already inside an existing highlight mark
      const container = range.commonAncestorContainer;
      const startEl =
        container.nodeType === Node.ELEMENT_NODE
          ? (container as HTMLElement)
          : container.parentElement;

      if (!startEl?.closest("[data-paragraph='true'], .ielts-paragraph, .ielts-essay-paragraph")) {
        return;
      }

      const existingMark = startEl?.closest(".ielts-user-highlight") as HTMLElement | null;

      // CASE A: User clicked Eraser ("clear")
      if (colorId === "clear") {
        if (existingMark) {
          unwrapElement(existingMark);
        }
        removeMarksInRange(range);
        setActiveHighlightColor(null);
        return;
      }

      const color = HIGHLIGHT_COLORS.find((c) => c.id === colorId);
      if (!color) return;

      // CASE B: The word is ALREADY highlighted
      // Rule: "You can only color highlight a word once"
      if (existingMark) {
        // If clicking the SAME color: toggle it off!
        if (existingMark.dataset.colorId === colorId) {
          unwrapElement(existingMark);
          setActiveHighlightColor(null);
          return;
        }

        // If clicking a DIFFERENT color: replace with new color (NEVER nest or duplicate!)
        existingMark.dataset.colorId = colorId;
        existingMark.className = `ielts-user-highlight ielts-hl-${color.id} rounded-sm px-1 py-0.5 cursor-pointer transition-colors`;
        existingMark.style.backgroundColor = color.bg;
        existingMark.style.color = "inherit";
        existingMark.style.borderBottom = `2px solid ${color.border}`;
        existingMark.title = `Highlighted: ${color.label} (Click color again to unhighlight)`;
        setActiveHighlightColor(colorId);
        return;
      }

      // CASE C: Fresh highlight on unhighlighted text
      // First clean up any inner marks inside the range so no nested highlights occur
      removeMarksInRange(range);

      const mark = document.createElement("mark");
      mark.dataset.colorId = colorId;
      mark.className = `ielts-user-highlight ielts-hl-${color.id} rounded-sm px-1 py-0.5 cursor-pointer transition-colors`;
      mark.style.backgroundColor = color.bg;
      mark.style.color = "inherit";
      mark.style.borderBottom = `2px solid ${color.border}`;
      mark.title = `Highlighted: ${color.label} (Click color again to unhighlight)`;

      try {
        range.surroundContents(mark);
      } catch (err) {
        // Fallback for non-text boundary crossing
        const contents = range.extractContents();
        mark.appendChild(contents);
        range.insertNode(mark);
      }

      setActiveHighlightColor(colorId);
    } catch (e) {
      console.warn("Could not apply highlight to selection", e);
    } finally {
      // Clear selection and dismiss toolbar
      window.getSelection()?.removeAllRanges();
      setPosition(null);
      setSelectedText("");
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
          className="fixed z-50 flex items-center gap-1.5 p-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-black/15 dark:border-white/15 shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-auto"
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

          {/* Palette Color Swatches - Only 1 color allowed per word */}
          <div className="flex items-center gap-1.5 px-1.5 border-x border-black/10 dark:border-white/10">
            {HIGHLIGHT_COLORS.map((c) => {
              const isCurrent = activeHighlightColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleApplyHighlight(c.id)}
                  className={`w-4 h-4 rounded-full border border-black/20 dark:border-white/30 cursor-pointer transition-transform ${
                    isCurrent
                      ? "ring-2 ring-black dark:ring-white scale-125"
                      : "hover:scale-125"
                  }`}
                  style={{ backgroundColor: c.dot }}
                  title={
                    isCurrent
                      ? `Click to remove ${c.label} highlight`
                      : `Highlight as ${c.label} (replaces existing color)`
                  }
                />
              );
            })}
            <button
              onClick={() => handleApplyHighlight("clear")}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-red-500 dark:hover:text-rose-400 cursor-pointer"
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
