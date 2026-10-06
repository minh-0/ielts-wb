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

export function RadarChart({ scores, size = 260, accentColor = "#e01a22" }: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) - 40;
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
        {/* Background Grids */}
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
                strokeOpacity={0.25}
                strokeWidth={1.5}
                className="text-gray-900 dark:text-gray-600"
              />
              <text
                x={center}
                y={center - (level / maxScore) * radius - 2}
                textAnchor="middle"
                fontSize={8}
                className="fill-gray-700 dark:fill-gray-400 font-mono font-bold"
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
              strokeOpacity={0.25}
              strokeWidth={1.5}
              className="text-gray-900 dark:text-gray-600"
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={scorePolygonPoints}
          fill={accentColor}
          fillOpacity={0.25}
          stroke={accentColor}
          strokeWidth={3}
          strokeLinejoin="miter"
          className="transition-all duration-300"
        />

        {/* Square Data Point Markers */}
        {scores.map((item, idx) => {
          const { x, y } = getCoordinates(item.score, idx);
          return (
            <g key={idx}>
              <rect
                x={x - 4}
                y={y - 4}
                width={8}
                height={8}
                fill="#ffffff"
                stroke={accentColor}
                strokeWidth={2.5}
              />
            </g>
          );
        })}

        {/* Outer Axis Labels */}
        {scores.map((item, idx) => {
          const labelDist = radius + 22;
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
              className="fill-gray-950 dark:fill-gray-100 font-black text-[10px] uppercase tracking-wider"
            >
              <tspan x={lx} dy="-0.3em">{item.label}</tspan>
              <tspan x={lx} dy="1.2em" fill={accentColor} fontWeight="900" fontSize="12px">
                {item.score.toFixed(1)}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
