"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export function RubricViewer() {
  const [selectedRubric, setSelectedRubric] = useState<"task2" | "task1" | "speaking">("task2");

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
          <button
            onClick={() => setSelectedRubric("task2")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubric === "task2"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Writing Task 2
          </button>
          <button
            onClick={() => setSelectedRubric("task1")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubric === "task1"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Writing Task 1
          </button>
          <button
            onClick={() => setSelectedRubric("speaking")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedRubric === "speaking"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Speaking Test
          </button>
        </div>

        <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
          Official Cambridge & IDP Descriptors
        </span>
      </div>

      {/* Tables with clean outlines */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 overflow-x-auto">
        {selectedRubric === "task2" && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold">
                <th className="py-2.5 px-3 w-16">Band</th>
                <th className="py-2.5 px-3">Task Response</th>
                <th className="py-2.5 px-3">Coherence & Cohesion</th>
                <th className="py-2.5 px-3">Lexical Resource</th>
                <th className="py-2.5 px-3">Grammar & Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">9</td>
                <td className="py-3 px-3">Fully addresses all parts of the task; fully developed position; fully extended and supported ideas.</td>
                <td className="py-3 px-3">Uses cohesion in such a way that it attracts no attention; skillfully manages paragraphing.</td>
                <td className="py-3 px-3">Wide range of vocabulary with very natural and sophisticated control; rare minor 'slips'.</td>
                <td className="py-3 px-3">Wide range of structures with full flexibility and accuracy; rare minor 'slips'.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">8</td>
                <td className="py-3 px-3">Sufficiently addresses all parts; well-developed response with relevant, extended, and supported ideas.</td>
                <td className="py-3 px-3">Sequences information and ideas logically; manages all aspects of cohesion well; paragraphing sufficiently.</td>
                <td className="py-3 px-3">Wide range of vocabulary fluently and flexibly; skillfully uses uncommon lexical items with occasional slips.</td>
                <td className="py-3 px-3">Wide range of structures; majority of sentences are error-free; makes only very occasional errors.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">7</td>
                <td className="py-3 px-3">Addresses all parts; clear position throughout; presents, extends, supports main ideas with some tendency to over-generalise.</td>
                <td className="py-3 px-3">Logically organises information; clear progression throughout; range of cohesive devices appropriately used.</td>
                <td className="py-3 px-3">Sufficient range for flexibility and precision; uses less common lexical items with awareness of style and collocation.</td>
                <td className="py-3 px-3">Variety of complex structures; produces frequent error-free sentences; good control of grammar and punctuation.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">6</td>
                <td className="py-3 px-3">Addresses all parts although some more fully than others; relevant position although conclusions may be repetitive.</td>
                <td className="py-3 px-3">Coherent progression; cohesive devices effective but cohesion within/between sentences may be mechanical.</td>
                <td className="py-3 px-3">Adequate range of vocabulary for the task; attempts less common vocabulary with some inaccuracy.</td>
                <td className="py-3 px-3">Mix of simple and complex sentence forms; makes some errors in grammar and punctuation that rarely impede communication.</td>
              </tr>
            </tbody>
          </table>
        )}

        {selectedRubric === "task1" && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold">
                <th className="py-2.5 px-3 w-16">Band</th>
                <th className="py-2.5 px-3">Task Achievement</th>
                <th className="py-2.5 px-3">Coherence & Cohesion</th>
                <th className="py-2.5 px-3">Lexical Resource</th>
                <th className="py-2.5 px-3">Grammar & Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">8</td>
                <td className="py-3 px-3">Covers all requirements sufficiently; presents, highlights, and illustrates key features clearly.</td>
                <td className="py-3 px-3">Sequences information logically; clear progression throughout; manages cohesion skillfully.</td>
                <td className="py-3 px-3">Wide range of vocabulary; skillfully uses uncommon lexical items with occasional minor slips.</td>
                <td className="py-3 px-3">Wide range of structures flexibly; majority of sentences are error-free.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">7</td>
                <td className="py-3 px-3">Covers the requirements of the task; presents a clear overview of main trends, differences, or stages.</td>
                <td className="py-3 px-3">Logically organises information and ideas; clear progression; range of cohesive devices appropriately used.</td>
                <td className="py-3 px-3">Sufficient range of vocabulary allowing flexibility and precision; awareness of collocation.</td>
                <td className="py-3 px-3">Variety of complex structures; produces frequent error-free sentences.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">6</td>
                <td className="py-3 px-3">Addresses requirements of task; presents an overview with information appropriately selected (may lack key details).</td>
                <td className="py-3 px-3">Information arranged coherently; uses cohesive devices effectively, though some may be mechanical.</td>
                <td className="py-3 px-3">Adequate range of vocabulary; attempts less common vocabulary with some inaccuracies.</td>
                <td className="py-3 px-3">Mix of simple and complex sentence forms; some errors in grammar and punctuation.</td>
              </tr>
            </tbody>
          </table>
        )}

        {selectedRubric === "speaking" && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold">
                <th className="py-2.5 px-3 w-16">Band</th>
                <th className="py-2.5 px-3">Fluency and Coherence</th>
                <th className="py-2.5 px-3">Lexical Resource</th>
                <th className="py-2.5 px-3">Grammar & Accuracy</th>
                <th className="py-2.5 px-3">Pronunciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">8</td>
                <td className="py-3 px-3">Speaks fluently with only occasional repetition/self-correction; hesitation is content-related; develops topics coherently.</td>
                <td className="py-3 px-3">Wide vocabulary resource readily and flexibly; uses less common and idiomatic vocabulary skillfully with occasional slips.</td>
                <td className="py-3 px-3">Wide range of structures flexibly; produces majority of error-free sentences with only occasional slips.</td>
                <td className="py-3 px-3">Wide range of pronunciation features; sustained flexible use with only occasional lapses; L1 accent minimal effect.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">7</td>
                <td className="py-3 px-3">Speaks at length without noticeable effort or loss of coherence; uses range of connectives and discourse markers.</td>
                <td className="py-3 px-3">Vocabulary resource flexibly to discuss variety of topics; uses some less common and idiomatic vocabulary with style awareness.</td>
                <td className="py-3 px-3">Range of complex structures with some flexibility; frequently produces error-free sentences.</td>
                <td className="py-3 px-3">Shows all positive features of Band 6 and some of Band 8; generally clear intelligibility.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">6</td>
                <td className="py-3 px-3">Willing to speak at length, though may lose coherence at times due to repetition, self-correction, or hesitation.</td>
                <td className="py-3 px-3">Wide enough vocabulary to discuss topics at length; meaning clear in spite of inappropriacies; paraphrases successfully.</td>
                <td className="py-3 px-3">Mix of simple and complex structures, but with limited flexibility; may make frequent mistakes with complex structures.</td>
                <td className="py-3 px-3">Range of pronunciation features with mixed control; generally understood, though mispronunciations occur.</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
