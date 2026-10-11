"use client";

import React from "react";

export interface BandEmojiInfo {
  src: string;
  alt: string;
  tier: 1 | 2 | 3 | 4;
  bandRange: string;
}

/**
 * Maps IELTS Band Score (0.0 - 9.0) to corresponding emoji stickers:
 * - Image 1 (Tier 1): Band < 6.0 (Low score - Crying emoji)
 * - Image 2 (Tier 2): Band 6.0 - 6.5 (Medium-low / Competent - Thumbs up emoji)
 * - Image 3 (Tier 3): Band 7.0 - 7.5 (Medium-high / Good - Cheering fists emoji)
 * - Image 4 (Tier 4): Band 8.0 - 9.0 (High / Expert mastery - Star eyes emoji)
 */
export function getBandEmojiInfo(score: number): BandEmojiInfo {
  if (score < 6.0) {
    return {
      src: "/band-emojis/band-tier-1.png",
      alt: "Band < 6.0 (Needs improvement)",
      tier: 1,
      bandRange: "Band 1.0 - 5.5",
    };
  }
  if (score < 7.0) {
    return {
      src: "/band-emojis/band-tier-2.png",
      alt: "Band 6.0 - 6.5 (Competent)",
      tier: 2,
      bandRange: "Band 6.0 - 6.5",
    };
  }
  if (score < 8.0) {
    return {
      src: "/band-emojis/band-tier-3.png",
      alt: "Band 7.0 - 7.5 (Good / Strong)",
      tier: 3,
      bandRange: "Band 7.0 - 7.5",
    };
  }
  return {
    src: "/band-emojis/band-tier-4.png",
    alt: "Band 8.0 - 9.0 (Expert mastery)",
    tier: 4,
    bandRange: "Band 8.0 - 9.0",
  };
}

interface BandScoreEmojiProps {
  score: number;
  size?: number;
  className?: string;
  showTooltip?: boolean;
}

export function BandScoreEmoji({
  score,
  size = 48,
  className = "",
  showTooltip = true,
}: BandScoreEmojiProps) {
  const emoji = getBandEmojiInfo(score);

  return (
    <img
      src={emoji.src}
      alt={emoji.alt}
      title={showTooltip ? `${emoji.bandRange} · ${emoji.alt}` : undefined}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`inline-block object-contain shrink-0 select-none animate-in zoom-in-75 duration-300 ${className}`}
      loading="eager"
    />
  );
}
