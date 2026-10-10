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
    <div className="space-y-4">
      {/* Task Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-6 text-xs">
          <button
            onClick={() => setSelectedRubricKey("task2")}
            className={`py-1 transition-colors cursor-pointer ${
              selectedRubricKey === "task2"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Writing Task 2
          </button>
          <button
            onClick={() => setSelectedRubricKey("task1")}
            className={`py-1 transition-colors cursor-pointer ${
              selectedRubricKey === "task1"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Writing Task 1
          </button>
          <button
            onClick={() => setSelectedRubricKey("speaking")}
            className={`py-1 transition-colors cursor-pointer ${
              selectedRubricKey === "speaking"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Speaking
          </button>
        </div>
      </div>

      {/* Main Rubric Table Container */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold bg-neutral-50/50 dark:bg-neutral-900/30">
              <th className="py-3 px-3 w-16 font-mono">Band</th>
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
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-mono font-semibold text-xs ${
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
      </div>
    </div>
  );
}
