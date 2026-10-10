"use client";

import React from "react";

interface RadarChartProps {
  scores: {
    label: string;
    score: number; // 0 to 9
  }[];
  size?: number;
  accentColor?: string;
}

export function RadarChart({ scores, size = 200 }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) - 36;
  const maxScore = 9;
  const count = scores.length;

  const gridLevels = [3, 5, 7, 9];

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const r = (value / maxScore) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const scorePolygonPoints = scores
    .map((item, idx) => {
      const { x, y } = getCoordinates(item.score, idx);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grids */}
        {gridLevels.map((level) => {
          const points = scores
            .map((_, idx) => {
              const { x, y } = getCoordinates(level, idx);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <g key={level}>
              <polygon
                points={points}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeWidth={1}
                className="text-neutral-400 dark:text-neutral-600"
              />
              <text
                x={center}
                y={center - (level / maxScore) * radius - 2}
                textAnchor="middle"
                fontSize={7}
                className="fill-neutral-400 font-mono"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axis Spokes */}
        {scores.map((_, idx) => {
          const { x, y } = getCoordinates(maxScore, idx);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={1}
              className="text-neutral-400 dark:text-neutral-600"
            />
          );
        })}

        {/* User Data Polygon: Monochrome */}
        <polygon
          points={scorePolygonPoints}
          fill="currentColor"
          fillOpacity={0.1}
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-black dark:text-white transition-all duration-300"
        />

        {/* Data Markers */}
        {scores.map((item, idx) => {
          const { x, y } = getCoordinates(item.score, idx);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={3}
              className="fill-black dark:fill-white stroke-white dark:stroke-black stroke-1"
            />
          );
        })}

        {/* Axis Labels */}
        {scores.map((item, idx) => {
          const labelDist = radius + 18;
          const angle = (Math.PI * 2 / count) * idx - Math.PI / 2;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          return (
            <text
              key={idx}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-600 dark:fill-neutral-300 font-sans text-[10px] font-medium"
            >
              <tspan x={lx} dy="-0.2em">{item.label}</tspan>
              <tspan x={lx} dy="1.15em" className="fill-neutral-900 dark:fill-neutral-100 font-semibold text-[11px]">
                {item.score.toFixed(1)}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
