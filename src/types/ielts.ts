export type TaskType = 'task1_academic' | 'task1_general' | 'task2';

export interface CriterionScore {
  score: number; // 0.0 to 9.0 in 0.5 increments
  bandLabel: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  keyRecommendations: string[];
}

export interface SentenceFeedback {
  id?: string;
  original: string;
  rewritten: string;
  issueType: 'grammar' | 'vocabulary' | 'cohesion' | 'task_response' | 'praise';
  explanation: string;
  bandUpgradeTip?: string;
}

export interface VocabularySuggestion {
  id?: string;
  originalPhrase: string;
  suggestedUpgrade: string;
  type: 'collocation' | 'academic_c1_c2' | 'idiom' | 'phrasal_verb';
  explanation: string;
  exampleInSentence: string;
}

export interface WritingAnalysisResult {
  overallBand: number;
  wordCount: number;
  wordCountStatus: 'sufficient' | 'underlength' | 'penalty_applied';
  criteria: {
    taskAchievement: CriterionScore;
    coherenceCohesion: CriterionScore;
    lexicalResource: CriterionScore;
    grammaticalRange: CriterionScore;
  };
  sentenceFeedbacks: SentenceFeedback[];
  vocabularySuggestions: VocabularySuggestion[];
  cohesionAnalysis: {
    overusedLinkers: string[];
    referencingQuality: string;
    paragraphProgression: string;
  };
  examinerSummary: string;
  modelAnswer: string;
  primaryBottleneck: string;
}

export type SpeakingPart = 'part1' | 'part2_cuecard' | 'part3';
export type SpeakingMode = 'practice' | 'official_exam';

export interface SpeakingAnalysisResult {
  overallBand: number;
  transcript: string;
  speechDurationSeconds: number;
  wordsPerMinute: number;
  pacingAssessment: 'too_slow' | 'ideal' | 'too_fast';
  fillerWords: {
    totalCount: number;
    breakdown: { word: string; count: number }[];
    frequencyAnalysis: string;
  };
  criteria: {
    fluencyCoherence: CriterionScore;
    lexicalResource: CriterionScore;
    grammaticalRange: CriterionScore;
    pronunciation: CriterionScore;
  };
  idiomAndPhrasalVerbUpgrades: VocabularySuggestion[];
  spokenGrammarErrors: {
    spokenSnippet: string;
    correctedSnippet: string;
    rule: string;
  }[];
  pronunciationNotes: {
    phoneticIssue: string;
    wordsAffected: string[];
    intonationFeedback: string;
  };
  examinerSummary: string;
  sampleBand9Response: string;
  primaryBottleneck: string;
}
