"use client";

import React, { useRef, useState } from "react";
import { Download, X, Check, Award, Sparkles } from "lucide-react";
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

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1080;
      const height = 1350; // 4:5 Instagram & Facebook optimal portrait
      canvas.width = width;
      canvas.height = height;

      // Dark background with sharp high contrast
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Top Red Brand Accent bar
      ctx.fillStyle = "#e01a22";
      ctx.fillRect(0, 0, width, 24);

      // Card Header
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("IELTS DIAGNOSTIC SCORECARD", 80, 110);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Cambridge & IDP Criteria Evaluation • ${type} Test`, 80, 155);

      // Sharp Red Badge for Type
      ctx.fillStyle = "#e01a22";
      ctx.fillRect(width - 240, 75, 160, 48);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(type.toUpperCase(), width - 160, 107);
      ctx.textAlign = "left";

      // Overall Score Box
      ctx.fillStyle = "#111827";
      ctx.fillRect(80, 200, width - 160, 240);
      ctx.strokeStyle = "#e01a22";
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 200, width - 160, 240);

      // Band score number
      ctx.fillStyle = "#e01a22";
      ctx.font = "bold 130px sans-serif";
      ctx.fillText(overallBand.toFixed(1), 130, 370);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("PREDICTED OVERALL BAND", 420, 290);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px sans-serif";
      const statusText = overallBand >= 7.5 ? "Good User (C1 Academic Mastery)" : overallBand >= 6.5 ? "Competent User (Meets University Criteria)" : "Developing User (Needs Targeted Refinement)";
      ctx.fillText(statusText, 420, 340);

      // 4 Criteria Grid Boxes
      const boxW = 215;
      const boxH = 150;
      const startY = 480;

      scores.forEach((s, idx) => {
        const x = 80 + idx * (boxW + 20);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x, startY, boxW, boxH);
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, boxW, boxH);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(s.label.toUpperCase(), x + 20, startY + 45);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 56px sans-serif";
        ctx.fillText(s.score.toFixed(1), x + 20, startY + 115);
      });

      // Primary Bottleneck Box
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(80, 670, width - 160, 220);
      ctx.strokeStyle = "#e01a22";
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 670, width - 160, 220);

      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("🚨 #1 EXAMINER BOTTLENECK HOLDING YOU BACK:", 120, 730);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "24px sans-serif";
      ctx.fillText(primaryBottleneck.slice(0, 85), 120, 785);
      if (primaryBottleneck.length > 85) {
        ctx.fillText(primaryBottleneck.slice(85, 170), 120, 825);
      }

      // Examiner Highlight Box
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(80, 920, width - 160, 240);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 920, width - 160, 240);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("💡 EXAMINER ADVICE & UPGRADE:", 120, 980);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "italic 24px sans-serif";
      ctx.fillText(`"${examinerHighlight.slice(0, 80)}"`, 120, 1035);
      if (examinerHighlight.length > 80) {
        ctx.fillText(`"${examinerHighlight.slice(80, 160)}"`, 120, 1075);
      }

      // Footer Branding
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("Tested with IELTS Diagnostic AI  •  #IELTSChallenge  •  VibeCoding 2026", 80, 1260);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-white dark:bg-gray-950 text-gray-950 dark:text-white border-3 border-gray-900 dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
        {/* Top Bar */}
        <div className="h-2 bg-red-600 w-full" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div ref={cardRef} className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pr-8 border-b-2 border-gray-900 dark:border-gray-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" /> OFFICIAL DIAGNOSTIC
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{title}</h3>
              <p className="text-xs text-gray-500 font-medium">Cambridge & IDP Criteria Evaluation</p>
            </div>
            <div>
              <span className="inline-block px-3 py-1 font-black text-xs uppercase bg-gray-900 dark:bg-white text-white dark:text-gray-950">
                {type}
              </span>
            </div>
          </div>

          {/* Hero Overall Band Banner */}
          <div className="flex items-center justify-between p-5 border-2 border-red-600 bg-red-50 dark:bg-red-950/20">
            <div>
              <div className="text-xs font-black uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                Predicted Overall Band
              </div>
              <div className="text-5xl font-black tracking-tight mt-1 flex items-baseline gap-2">
                <span className="text-red-600">{overallBand.toFixed(1)}</span>
                <span className="text-sm font-bold text-gray-500">/ 9.0</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <RadarChart scores={scores} size={150} />
            </div>
          </div>

          {/* 4 Criteria Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {scores.map((s, idx) => (
              <div key={idx} className="p-3 border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                <div className="text-[10px] font-black uppercase text-gray-500 truncate">{s.label}</div>
                <div className="text-2xl font-black mt-0.5">{s.score.toFixed(1)}</div>
              </div>
            ))}
          </div>

          {/* Bottleneck Warning */}
          <div className="p-4 border-2 border-red-600 bg-red-50 dark:bg-red-950/30 text-xs">
            <span className="font-black text-red-600 uppercase block mb-1">🚨 #1 Bottleneck Holding You Back:</span>
            <p className="text-gray-800 dark:text-gray-200 font-medium">{primaryBottleneck}</p>
          </div>

          {/* Examiner Quote */}
          <div className="p-4 border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs">
            <span className="font-black text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mb-1 uppercase">
              <Sparkles className="w-3.5 h-3.5" /> High-Band Examiner Advice:
            </span>
            <p className="text-gray-800 dark:text-gray-200 italic font-medium">"{examinerHighlight}"</p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 font-black text-xs uppercase bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" /> Downloaded!
                </>
              ) : downloading ? (
                "Generating High-Res PNG..."
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Scorecard for Facebook
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 font-black text-xs uppercase border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
