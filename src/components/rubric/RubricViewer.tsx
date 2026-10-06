"use client";

import React, { useState } from "react";
import { BookOpen, Info } from "lucide-react";

export function RubricViewer() {
  const [selectedRubric, setSelectedRubric] = useState<"task2" | "task1" | "speaking">("task2");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> OFFICIAL CAMBRIDGE & IDP STANDARDS
          </div>
          <h2 className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tight">Public Band Descriptors</h2>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
            The authentic assessment criteria used by certified IELTS Examiners worldwide.
          </p>
        </div>

        {/* Tab Switcher: Sharp Segmented */}
        <div className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-bold">
          <button
            onClick={() => setSelectedRubric("task2")}
            className={`px-3.5 py-2 transition-all ${
              selectedRubric === "task2"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Writing Task 2
          </button>
          <button
            onClick={() => setSelectedRubric("task1")}
            className={`px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
              selectedRubric === "task1"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Writing Task 1
          </button>
          <button
            onClick={() => setSelectedRubric("speaking")}
            className={`px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
              selectedRubric === "speaking"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            Speaking Test
          </button>
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-950/20 border-t border-r border-b border-gray-200 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <div className="font-medium">
          <strong>Official Examiner Notice:</strong> Band scores in each criterion are discrete half-band steps. An overall score is computed from the 4 sub-scores rounded to the nearest half band. Bold text in official descriptors indicates negative features that limit rating ceilings.
        </div>
      </div>

      {/* Rubric Tables: Sharp thick borders */}
      <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        {selectedRubric === "task2" && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 dark:border-gray-700 text-gray-950 dark:text-white font-black uppercase tracking-wider">
                <th className="py-3 px-3 w-16">Band</th>
                <th className="py-3 px-3">Task Response (TR)</th>
                <th className="py-3 px-3">Coherence & Cohesion (CC)</th>
                <th className="py-3 px-3">Lexical Resource (LR)</th>
                <th className="py-3 px-3">Grammatical Range & Accuracy (GRA)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-medium">
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">9</td>
                <td className="py-3 px-3">Fully addresses all parts of the task; fully developed position; fully extended and supported ideas.</td>
                <td className="py-3 px-3">Uses cohesion in such a way that it attracts no attention; skillfully manages paragraphing.</td>
                <td className="py-3 px-3">Wide range of vocabulary with very natural and sophisticated control; rare minor 'slips'.</td>
                <td className="py-3 px-3">Wide range of structures with full flexibility and accuracy; rare minor 'slips'.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">8</td>
                <td className="py-3 px-3">Sufficiently addresses all parts; well-developed response with relevant, extended, and supported ideas.</td>
                <td className="py-3 px-3">Sequences information and ideas logically; manages all aspects of cohesion well; paragraphing sufficiently.</td>
                <td className="py-3 px-3">Wide range of vocabulary fluently and flexibly; skillfully uses uncommon lexical items with occasional slips.</td>
                <td className="py-3 px-3">Wide range of structures; majority of sentences are error-free; makes only very occasional errors.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">7</td>
                <td className="py-3 px-3">Addresses all parts; clear position throughout; presents, extends, supports main ideas with some tendency to over-generalise.</td>
                <td className="py-3 px-3">Logically organises information; clear progression throughout; range of cohesive devices appropriately used.</td>
                <td className="py-3 px-3">Sufficient range for flexibility and precision; uses less common lexical items with awareness of style and collocation.</td>
                <td className="py-3 px-3">Variety of complex structures; produces frequent error-free sentences; good control of grammar and punctuation.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">6</td>
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
              <tr className="border-b-2 border-gray-900 dark:border-gray-700 text-gray-950 dark:text-white font-black uppercase tracking-wider">
                <th className="py-3 px-3 w-16">Band</th>
                <th className="py-3 px-3">Task Achievement (TA)</th>
                <th className="py-3 px-3">Coherence & Cohesion (CC)</th>
                <th className="py-3 px-3">Lexical Resource (LR)</th>
                <th className="py-3 px-3">Grammatical Range & Accuracy (GRA)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-medium">
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">8</td>
                <td className="py-3 px-3">Covers all requirements sufficiently; presents, highlights, and illustrates key features clearly.</td>
                <td className="py-3 px-3">Sequences information logically; clear progression throughout; manages cohesion skillfully.</td>
                <td className="py-3 px-3">Wide range of vocabulary; skillfully uses uncommon lexical items with occasional minor slips.</td>
                <td className="py-3 px-3">Wide range of structures flexibly; majority of sentences are error-free.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">7</td>
                <td className="py-3 px-3">Covers the requirements of the task; presents a clear overview of main trends, differences, or stages.</td>
                <td className="py-3 px-3">Logically organises information and ideas; clear progression; range of cohesive devices appropriately used.</td>
                <td className="py-3 px-3">Sufficient range of vocabulary allowing flexibility and precision; awareness of collocation.</td>
                <td className="py-3 px-3">Variety of complex structures; produces frequent error-free sentences.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">6</td>
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
              <tr className="border-b-2 border-gray-900 dark:border-gray-700 text-gray-950 dark:text-white font-black uppercase tracking-wider">
                <th className="py-3 px-3 w-16">Band</th>
                <th className="py-3 px-3">Fluency and Coherence (FC)</th>
                <th className="py-3 px-3">Lexical Resource (LR)</th>
                <th className="py-3 px-3">Grammatical Range & Accuracy (GRA)</th>
                <th className="py-3 px-3">Pronunciation (PR)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-medium">
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">8</td>
                <td className="py-3 px-3">Speaks fluently with only occasional repetition/self-correction; hesitation is content-related; develops topics coherently.</td>
                <td className="py-3 px-3">Wide vocabulary resource readily and flexibly; uses less common and idiomatic vocabulary skillfully with occasional slips.</td>
                <td className="py-3 px-3">Wide range of structures flexibly; produces majority of error-free sentences with only occasional slips.</td>
                <td className="py-3 px-3">Wide range of pronunciation features; sustained flexible use with only occasional lapses; L1 accent minimal effect.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">7</td>
                <td className="py-3 px-3">Speaks at length without noticeable effort or loss of coherence; uses range of connectives and discourse markers.</td>
                <td className="py-3 px-3">Vocabulary resource flexibly to discuss variety of topics; uses some less common and idiomatic vocabulary with style awareness.</td>
                <td className="py-3 px-3">Range of complex structures with some flexibility; frequently produces error-free sentences.</td>
                <td className="py-3 px-3">Shows all positive features of Band 6 and some of Band 8; generally clear intelligibility.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-black text-red-600 text-base">6</td>
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
