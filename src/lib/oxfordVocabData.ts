import oxfordVocabRaw from "./oxfordVocabList.json";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface OxfordVocabItem {
  id: string;
  word: string;
  pos: string;
  rawPos?: string;
  sense?: string;
  level: CefrLevel;
  phonetic: string;
  definition: string;
  example: string;
  collocations: string[];
  oxfordUrl: string;
  sourceList: "Oxford 3000" | "Oxford 5000";
}

export const OXFORD_VOCAB_LIST: OxfordVocabItem[] = oxfordVocabRaw as OxfordVocabItem[];

export const CEFR_LEVEL_METADATA: Record<
  CefrLevel,
  { label: string; description: string; badgeColor: string; bgLight: string; textLight: string }
> = {
  C1: {
    label: "C1 Advanced",
    description: "Oxford 5000: High-level academic & specialized lexis crucial for IELTS Band 8.0–9.0.",
    badgeColor: "border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-500/10",
    bgLight: "bg-purple-500/5",
    textLight: "text-purple-600 dark:text-purple-400",
  },
  B2: {
    label: "B2 Upper-Intermediate",
    description: "Oxford 3000 & 5000: Independent lexical fluency essential for IELTS Band 6.5–7.5.",
    badgeColor: "border-sky-500/30 text-sky-700 dark:text-sky-300 bg-sky-500/10",
    bgLight: "bg-sky-500/5",
    textLight: "text-sky-600 dark:text-sky-400",
  },
  B1: {
    label: "B1 Intermediate",
    description: "Oxford 3000: Core conversational and contextual vocabulary for clear everyday communication.",
    badgeColor: "border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10",
    bgLight: "bg-emerald-500/5",
    textLight: "text-emerald-600 dark:text-emerald-400",
  },
  A2: {
    label: "A2 Elementary",
    description: "Oxford 3000: Routine practical English for common daily situations.",
    badgeColor: "border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10",
    bgLight: "bg-amber-500/5",
    textLight: "text-amber-600 dark:text-amber-400",
  },
  A1: {
    label: "A1 Core",
    description: "Oxford 3000: Foundational beginner vocabulary forming the bedrock of basic English.",
    badgeColor: "border-neutral-500/30 text-neutral-700 dark:text-neutral-300 bg-neutral-500/10",
    bgLight: "bg-neutral-500/5",
    textLight: "text-neutral-600 dark:text-neutral-400",
  },
};
