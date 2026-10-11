"use client";

import React, { useRef, useState } from "react";
import { Download, X, Check, Share2 } from "lucide-react";
import { RadarChart } from "./RadarChart";
import { BandScoreEmoji, getBandEmojiInfo } from "./BandScoreEmoji";

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "Writing" | "Speaking";
  overallBand: number;
  scores: { label: string; score: number }[];
  primaryBottleneck: string;
  examinerHighlight: string;
}

export function ScorecardModal({
  isOpen,
  onClose,
  title,
  type,
  overallBand,
  scores,
  primaryBottleneck,
  examinerHighlight,
}: ScorecardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      // Pure pitch black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Thin border around the card canvas
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Header Tag
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`IELTS / ${type.toUpperCase()} DIAGNOSTIC`, 80, 110);

      // Candidate Score Hero
      ctx.fillStyle = "#888888";
      ctx.font = "500 20px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("ESTIMATED OVERALL BAND", 80, 200);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 130px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`Band ${overallBand.toFixed(1)}`, 80, 330);

      // Draw Band Emoji sticker next to the score
      try {
        const emojiInfo = getBandEmojiInfo(overallBand);
        const emojiImg = new window.Image();
        emojiImg.src = emojiInfo.src;
        await new Promise((resolve) => {
          emojiImg.onload = () => {
            const textWidth = ctx.measureText(`Band ${overallBand.toFixed(1)}`).width;
            ctx.drawImage(emojiImg, 80 + textWidth + 30, 215, 125, 125);
            resolve(true);
          };
          emojiImg.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 300);
        });
      } catch {}

      // Horizontal Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 380);
      ctx.lineTo(width - 80, 380);
      ctx.stroke();

      // 4 Criteria Grid
      const boxW = 210;
      const boxH = 130;
      const startY = 430;

      scores.forEach((s, idx) => {
        const x = 80 + idx * (boxW + 20);
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(x, startY, boxW, boxH);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, startY, boxW, boxH);

        ctx.fillStyle = "#888888";
        ctx.font = "14px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(s.label.toUpperCase(), x + 20, startY + 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(s.score.toFixed(1), x + 20, startY + 100);
      });

      // Primary Bottleneck Section
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(80, 610, width - 160, 200);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 610, width - 160, 200);

      ctx.fillStyle = "#888888";
      ctx.font = "16px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("PRIMARY EXAMINER BOTTLENECK", 110, 660);

      ctx.fillStyle = "#ffffff";
      ctx.font = "24px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(primaryBottleneck.slice(0, 75), 110, 715);
      if (primaryBottleneck.length > 75) {
        ctx.fillText(primaryBottleneck.slice(75, 150), 110, 755);
      }

      // Examiner Advice Section
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(80, 850, width - 160, 260);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 850, width - 160, 260);

      ctx.fillStyle = "#888888";
      ctx.font = "16px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("HIGH-BAND RECOMMENDATION", 110, 900);

      ctx.fillStyle = "#dddddd";
      ctx.font = "italic 22px var(--font-serif), 'Newsreader', Georgia, serif";
      ctx.fillText(`"${examinerHighlight.slice(0, 70)}"`, 110, 960);
      if (examinerHighlight.length > 70) {
        ctx.fillText(`"${examinerHighlight.slice(70, 140)}"`, 110, 1000);
      }

      // Footer
      ctx.fillStyle = "#555555";
      ctx.font = "18px var(--font-sans), 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("light", 80, 1260);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `IELTS_${type}_Band_${overallBand.toFixed(1)}_Scorecard.png`;
      a.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error("Failed to generate canvas image", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg my-8 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <span className="text-xs text-neutral-500">
            {type} Test Evaluation
          </span>
          <h3 className="text-xl font-serif font-semibold tracking-tight">{title}</h3>
        </div>

        {/* Hero Score Box */}
        <div className="py-2 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div>
            <div className="text-xs text-neutral-500">Predicted Overall</div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-4xl font-serif font-medium tracking-tight">
                Band {overallBand.toFixed(1)}
              </span>
              <BandScoreEmoji score={overallBand} size={38} />
            </div>
          </div>
          <RadarChart scores={scores} size={130} accentColor="#ffffff" />
        </div>

        {/* 4 Scores: Clean hairline strip without individual boxes */}
        <div className="grid grid-cols-4 gap-2 py-3 border-b border-neutral-100 dark:border-neutral-800/80 text-center">
          {scores.map((s, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="text-xs text-neutral-500">{s.label}</div>
              <div className="text-base font-semibold">{s.score.toFixed(1)}</div>
            </div>
          ))}
        </div>

        {/* Primary Bottleneck & Examiner Note: Clean text blocks without boxes */}
        <div className="space-y-3 pt-1 text-xs">
          <div className="space-y-0.5">
            <span className="text-neutral-500 font-medium block">Primary Bottleneck:</span>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{primaryBottleneck}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-neutral-500 font-medium block">Examiner Note:</span>
            <p className="text-neutral-700 dark:text-neutral-300 italic leading-relaxed">"{examinerHighlight}"</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer shadow-xs transition-opacity"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Downloaded
              </>
            ) : downloading ? (
              "Generating..."
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Export Scorecard PNG
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
