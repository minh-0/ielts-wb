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

export interface QuizQuestion {
  targetWord: OxfordVocabItem;
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export function generateQuizQuestion(
  pool: OxfordVocabItem[] = OXFORD_VOCAB_LIST,
  levelFilter?: CefrLevel | "ALL"
): QuizQuestion | null {
  const eligible = levelFilter && levelFilter !== "ALL"
    ? pool.filter((w) => w.level === levelFilter)
    : pool;

  if (eligible.length < 4) return null;

  // Pick random target
  const targetIdx = Math.floor(Math.random() * eligible.length);
  const target = eligible[targetIdx];

  // Pick 3 random distractors from eligible pool with different words
  const distractors: OxfordVocabItem[] = [];
  const usedIndices = new Set<number>([targetIdx]);

  while (distractors.length < 3 && usedIndices.size < eligible.length) {
    const randIdx = Math.floor(Math.random() * eligible.length);
    if (!usedIndices.has(randIdx)) {
      usedIndices.add(randIdx);
      const cand = eligible[randIdx];
      if (cand.definition !== target.definition && cand.word !== target.word) {
        distractors.push(cand);
      }
    }
  }

  // Create 4 choices: target + 3 distractors
  const options = [
    { text: target.definition, isCorrect: true },
    ...distractors.map((d) => ({ text: d.definition, isCorrect: false })),
  ];

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    targetWord: target,
    prompt: `What is the accurate definition for "${target.word}" (${target.pos}, ${target.level})?`,
    options,
    explanation: `"${target.word}" is a ${target.level} ${target.pos}. Example: "${target.example}"`,
  };
}
