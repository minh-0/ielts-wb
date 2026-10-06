"use client";

import React, { useState } from "react";
import {
  WRITING_TASK_2_RUBRIC,
  WRITING_TASK_1_RUBRIC,
  SPEAKING_RUBRIC,
  RubricDefinition,
} from "@/lib/officialRubricData";

export function RubricViewer() {
  const [selectedRubricKey, setSelectedRubricKey] = useState<"task2" | "task1" | "speaking">("task2");

  const currentRubric: RubricDefinition =
    selectedRubricKey === "task2"
      ? WRITING_TASK_2_RUBRIC
      : selectedRubricKey === "task1"
      ? WRITING_TASK_1_RUBRIC
      : SPEAKING_RUBRIC;

  return (
    <div className="space-y-6">
      {/* Top Header & Task Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
          <button
            onClick={() => setSelectedRubricKey("task2")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubricKey === "task2"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Writing Task 2
          </button>
          <button
            onClick={() => setSelectedRubricKey("task1")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubricKey === "task1"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Writing Task 1
          </button>
          <button
            onClick={() => setSelectedRubricKey("speaking")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubricKey === "speaking"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Speaking Test
          </button>
        </div>

        <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
          Official Cambridge, British Council & IDP Descriptors
        </span>
      </div>

      {/* Main Rubric Table Container */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5 overflow-x-auto shadow-xs">
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
            {currentRubric.title}
          </span>
          <span className="font-mono text-[11px] text-neutral-400">
            Bands 9 – 0 (Full Public Version)
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold bg-neutral-50/50 dark:bg-neutral-900/30">
              <th className="py-3 px-3 w-20 font-mono">Band</th>
              <th className="py-3 px-3 w-1/4">{currentRubric.columns[0]}</th>
              <th className="py-3 px-3 w-1/4">{currentRubric.columns[1]}</th>
              <th className="py-3 px-3 w-1/4">{currentRubric.columns[2]}</th>
              <th className="py-3 px-3 w-1/4">{currentRubric.columns[3]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
            {currentRubric.rows.map((row) => {
              const isBand9 = row.band === "9";
              return (
                <tr
                  key={row.band}
                  className={`align-top transition-colors ${
                    isBand9
                      ? "bg-neutral-50/40 dark:bg-neutral-900/20"
                      : "hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10"
                  }`}
                >
                  {/* Band Number */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-xs ${
                        isBand9
                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs"
                          : Number(row.band) >= 7
                          ? "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {row.band}
                    </span>
                  </td>

                  {/* Column 1 */}
                  <td className="py-3 px-3">
                    <ul className="space-y-1.5 list-disc list-outside pl-3.5 leading-relaxed text-[12px]">
                      {row.col1.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </td>

                  {/* Column 2 */}
                  <td className="py-3 px-3">
                    <ul className="space-y-1.5 list-disc list-outside pl-3.5 leading-relaxed text-[12px]">
                      {row.col2.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </td>

                  {/* Column 3 */}
                  <td className="py-3 px-3">
                    <ul className="space-y-1.5 list-disc list-outside pl-3.5 leading-relaxed text-[12px]">
                      {row.col3.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </td>

                  {/* Column 4 */}
                  <td className="py-3 px-3">
                    <ul className="space-y-1.5 list-disc list-outside pl-3.5 leading-relaxed text-[12px]">
                      {row.col4.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Source citation from official Cambridge / IDP / British Council documentation */}
        <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400">
          <div>Official Public Version: {currentRubric.source}</div>
          <div className="font-mono">IELTS is jointly owned by British Council, IDP: IELTS Australia and Cambridge English.</div>
        </div>
      </div>
    </div>
  );
}
