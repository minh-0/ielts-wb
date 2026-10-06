"use client";

import React, { useRef, useState } from "react";
import { Download, Share2, X, Check, Award, Sparkles } from "lucide-react";
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
      // Use client-side canvas rendering for the share card
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1080;
      const height = 1350; // 4:5 Instagram & Facebook optimal portrait
      canvas.width = width;
      canvas.height = height;

      // Dark background with gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#090d16");
      bgGrad.addColorStop(1, "#151c2e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Red Brand Accent bar
      ctx.fillStyle = "#e01a22";
      ctx.fillRect(0, 0, width, 16);

      // Card Header
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("IELTS DIAGNOSTIC SCORECARD", 80, 110);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Automated Cambridge & IDP Rubric Evaluation • ${type} Test`, 80, 155);

      // Decorative Red Pill for Type
      ctx.fillStyle = "#e01a22";
      ctx.beginPath();
      ctx.roundRect(width - 240, 75, 160, 48, 24);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(type.toUpperCase(), width - 160, 107);
      ctx.textAlign = "left";

      // Overall Score Hero Box
      const heroGrad = ctx.createLinearGradient(80, 200, width - 80, 440);
      heroGrad.addColorStop(0, "rgba(224, 26, 34, 0.15)");
      heroGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.fillStyle = heroGrad;
      ctx.beginPath();
      ctx.roundRect(80, 200, width - 160, 240, 32);
      ctx.fill();
      ctx.strokeStyle = "rgba(224, 26, 34, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Band score number
      ctx.fillStyle = "#e01a22";
      ctx.font = "bold 130px sans-serif";
      ctx.fillText(overallBand.toFixed(1), 130, 370);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("PREDICTED OVERALL BAND", 420, 290);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "26px sans-serif";
      const statusText = overallBand >= 7.5 ? "Good User (C1 Academic Mastery)" : overallBand >= 6.5 ? "Competent User (Meets University Criteria)" : "Developing User (Needs Targeted Refinement)";
      ctx.fillText(statusText, 420, 340);

      // 4 Criteria Grid Boxes
      const boxW = 215;
      const boxH = 150;
      const startY = 480;

      scores.forEach((s, idx) => {
        const x = 80 + idx * (boxW + 20);
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.roundRect(x, startY, boxW, boxH, 20);
        ctx.fill();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(s.label.toUpperCase(), x + 20, startY + 45);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 56px sans-serif";
        ctx.fillText(s.score.toFixed(1), x + 20, startY + 115);
      });

      // Primary Bottleneck Box
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(80, 670, width - 160, 220, 24);
      ctx.fill();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("🚨 #1 EXAMINER BOTTLENECK HOLDING YOU BACK:", 120, 730);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "24px sans-serif";
      ctx.fillText(primaryBottleneck.slice(0, 85), 120, 785);
      if (primaryBottleneck.length > 85) {
        ctx.fillText(primaryBottleneck.slice(85, 170), 120, 825);
      }

      // Examiner Highlight Quote Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
      ctx.beginPath();
      ctx.roundRect(80, 920, width - 160, 240, 24);
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("💡 EXAMINER RECOMMENDATION & UPGRADE:", 120, 980);

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

      // Trigger download
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-gray-900 text-white border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="h-2 bg-red-600 w-full" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div ref={cardRef} className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pr-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 mb-2">
                <Award className="w-3.5 h-3.5" /> OFFICIAL DIAGNOSTIC
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h3>
              <p className="text-xs text-gray-400">Evaluated against Cambridge & IDP Criteria</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
                {type}
              </span>
            </div>
          </div>

          {/* Hero Overall Band Banner */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-600/20 via-red-950/20 to-gray-800/40 border border-red-600/40">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Predicted Overall Band
              </div>
              <div className="text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                <span className="text-red-500">{overallBand.toFixed(1)}</span>
                <span className="text-sm font-normal text-gray-400">/ 9.0</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <RadarChart scores={scores} size={150} />
            </div>
          </div>

          {/* 4 Criteria Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {scores.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-800/80 border border-gray-700/60 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase truncate">{s.label}</div>
                <div className="text-2xl font-black text-white mt-0.5">{s.score.toFixed(1)}</div>
              </div>
            ))}
          </div>

          {/* Bottleneck Warning */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-xs">
            <span className="font-bold text-red-400 block mb-1">🚨 #1 Bottleneck Holding You Back:</span>
            <p className="text-gray-300">{primaryBottleneck}</p>
          </div>

          {/* Examiner Quote */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-xs">
            <span className="font-bold text-sky-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Band Advice:
            </span>
            <p className="text-gray-300 italic">"{examinerHighlight}"</p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer"
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
              className="px-5 py-3 rounded-xl font-medium text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>

          <p className="text-[11px] text-center text-gray-500">
            Post this on Facebook with #IELTSChallenge to compare with your friends!
          </p>
        </div>
      </div>
    </div>
  );
}
