"use client";

import React, { useRef, useState } from "react";
import { Download, X, Check, Share2 } from "lucide-react";
import { RadarChart } from "./RadarChart";

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
      ctx.font = "bold 18px monospace";
      ctx.fillText(`IELTS / ${type.toUpperCase()} DIAGNOSTIC`, 80, 110);

      // Candidate Score Hero
      ctx.fillStyle = "#888888";
      ctx.font = "20px sans-serif";
      ctx.fillText("ESTIMATED OVERALL BAND", 80, 200);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 130px sans-serif";
      ctx.fillText(`Band ${overallBand.toFixed(1)}`, 80, 330);

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
        ctx.font = "14px monospace";
        ctx.fillText(s.label.toUpperCase(), x + 20, startY + 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px sans-serif";
        ctx.fillText(s.score.toFixed(1), x + 20, startY + 100);
      });

      // Primary Bottleneck Section
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(80, 610, width - 160, 200);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 610, width - 160, 200);

      ctx.fillStyle = "#888888";
      ctx.font = "16px monospace";
      ctx.fillText("PRIMARY EXAMINER BOTTLENECK", 110, 660);

      ctx.fillStyle = "#ffffff";
      ctx.font = "24px sans-serif";
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
      ctx.font = "16px monospace";
      ctx.fillText("HIGH-BAND RECOMMENDATION", 110, 900);

      ctx.fillStyle = "#dddddd";
      ctx.font = "italic 22px sans-serif";
      ctx.fillText(`"${examinerHighlight.slice(0, 70)}"`, 110, 960);
      if (examinerHighlight.length > 70) {
        ctx.fillText(`"${examinerHighlight.slice(70, 140)}"`, 110, 1000);
      }

      // Footer
      ctx.fillStyle = "#555555";
      ctx.font = "18px monospace";
      ctx.fillText("IELTSlayer666 • Official Criteria Evaluation", 80, 1260);

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
        className="relative w-full max-w-lg my-8 bg-white dark:bg-black text-black dark:text-white border border-black/15 dark:border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-6 pb-4 border-b border-black/10 dark:border-white/10">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            {type} Test Evaluation
          </span>
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        </div>

        {/* Hero Score Box */}
        <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase">Predicted Overall</div>
            <div className="text-4xl font-semibold tracking-tight mt-0.5">
              Band {overallBand.toFixed(1)}
            </div>
          </div>
          <RadarChart scores={scores} size={130} accentColor="#ffffff" />
        </div>

        {/* 4 Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scores.map((s, idx) => (
            <div key={idx} className="p-2.5 rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black text-center">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">{s.label}</div>
              <div className="text-lg font-semibold mt-0.5">{s.score.toFixed(1)}</div>
            </div>
          ))}
        </div>

        {/* Primary Bottleneck */}
        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-500 block">Primary Bottleneck:</span>
          <p className="text-neutral-700 dark:text-neutral-300">{primaryBottleneck}</p>
        </div>

        {/* Advice */}
        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-500 block">Examiner Note:</span>
          <p className="text-neutral-700 dark:text-neutral-300 italic">"{examinerHighlight}"</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 cursor-pointer shadow-xs"
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
            className="px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/15 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
