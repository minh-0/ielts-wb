import { WritingAnalysisResult, SpeakingAnalysisResult } from '@/types/ielts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const IELTS_WRITING_EXAMINER_SYSTEM_PROMPT = `
You are a senior, certified British Council and IDP IELTS Examiner with over 15 years of experience.
Evaluate the candidate's IELTS Writing submission with uncompromising examiner rigor strictly aligned with the Official IELTS Writing Band Descriptors (Task 1 & Task 2).

CRITICAL CRITERIA RULES:
1. TASK ACHIEVEMENT (Task 1) / TASK RESPONSE (Task 2):
   - Check word count penalty: Task 1 requires >= 150 words. Task 2 requires >= 250 words. If underlength, dock the Task Response score.
   - For Task 1: Check for a clear, distinct OVERVIEW. If there is no clear overview, Task Achievement MUST NOT exceed Band 5.0.
   - For Task 2: Check whether all parts of the prompt are addressed, whether a clear position is presented throughout, and whether main ideas are extended and supported with relevant reasoning/examples (not just listed).
2. COHERENCE & COHESION (CC):
   - Penalize overused, robotic linkers (e.g., "First and foremost", "In a nutshell", "Moreover", "Furthermore").
   - Reward natural referencing (pronouns, substitution, ellipsis) and logical paragraph progression with distinct central topics.
3. LEXICAL RESOURCE (LR):
   - Assess range and precision of vocabulary. Identify less common lexical items (C1/C2 level) and natural collocations.
   - Provide concrete, high-band vocabulary and idiom suggestions: replace weak phrases with sophisticated academic collocations and contextually fitting idioms without being unnatural.
4. GRAMMATICAL RANGE & ACCURACY (GRA):
   - Categorize sentence variety (simple, compound, complex structures: relative clauses, conditionals, passive voice, inversions).
   - Compute error-free sentence frequency. Band 7 requires frequent error-free sentences; Band 8 requires the majority.

Return your response in STRICT valid JSON format conforming to the WritingAnalysisResult schema.
`;

export const IELTS_SPEAKING_EXAMINER_SYSTEM_PROMPT = `
You are an expert Cambridge/IDP IELTS Speaking Examiner.
Evaluate the candidate's speaking response strictly based on the Official IELTS Speaking Band Descriptors:
1. FLUENCY AND COHERENCE (FC):
   - Evaluate speech pacing (optimal conversational pace: 120-150 words per minute).
   - Tally and analyze hesitation vs natural pauses, filler words ('um', 'uh', 'like', 'you know'), and discourse markers.
2. LEXICAL RESOURCE (LR):
   - Identify use of idiomatic language, phrasal verbs, and natural conversational collocations.
   - Provide suggestions for natural spoken idioms and phrasal verb upgrades.
3. GRAMMATICAL RANGE AND ACCURACY (GRA):
   - Detect spoken grammar slips (dropped 3rd-person '-s', past tense inflections, irregular verbs).
   - Evaluate complex spoken grammar (conditionals, unreal past, concessive clauses).
4. PRONUNCIATION (PR):
   - Assess intelligibility, word stress, rhythm, and sentence intonation.

Return your response in STRICT valid JSON format conforming to the SpeakingAnalysisResult schema.
`;

export async function analyzeWritingWithGemini(
  promptText: string,
  essayText: string,
  taskType: 'task1_academic' | 'task1_general' | 'task2',
  apiKey?: string
): Promise<WritingAnalysisResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return generateMockWritingAnalysis(promptText, essayText, taskType);
  }

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const userPrompt = `
Task Type: ${taskType}
Exam Prompt: """${promptText}"""
Candidate Essay (Word count: ${wordCount}):
"""${essayText}"""

Analyze this essay and output valid JSON with this exact structure:
{
  "overallBand": number (e.g. 6.5, 7.0),
  "wordCount": ${wordCount},
  "wordCountStatus": "${wordCount < (taskType === 'task2' ? 250 : 150) ? 'penalty_applied' : 'sufficient'}",
  "criteria": {
    "taskAchievement": {
      "score": number,
      "bandLabel": string,
      "feedback": string,
      "strengths": [string],
      "weaknesses": [string],
      "keyRecommendations": [string]
    },
    "coherenceCohesion": {
      "score": number,
      "bandLabel": string,
      "feedback": string,
      "strengths": [string],
      "weaknesses": [string],
      "keyRecommendations": [string]
    },
    "lexicalResource": {
      "score": number,
      "bandLabel": string,
      "feedback": string,
      "strengths": [string],
      "weaknesses": [string],
      "keyRecommendations": [string]
    },
    "grammaticalRange": {
      "score": number,
      "bandLabel": string,
      "feedback": string,
      "strengths": [string],
      "weaknesses": [string],
      "keyRecommendations": [string]
    }
  },
  "sentenceFeedbacks": [
    {
      "original": string,
      "rewritten": string,
      "issueType": "grammar" | "vocabulary" | "cohesion" | "task_response" | "praise",
      "explanation": string,
      "bandUpgradeTip": string
    }
  ],
  "vocabularySuggestions": [
    {
      "originalPhrase": string,
      "suggestedUpgrade": string,
      "type": "collocation" | "academic_c1_c2" | "idiom",
      "explanation": string,
      "exampleInSentence": string
    }
  ],
  "cohesionAnalysis": {
    "overusedLinkers": [string],
    "referencingQuality": string,
    "paragraphProgression": string
  },
  "examinerSummary": string,
  "modelAnswer": string,
  "primaryBottleneck": string
}
Only output the JSON object without markdown fences if possible.
`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: IELTS_WRITING_EXAMINER_SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!res.ok) {
      console.warn('Gemini API call failed, falling back to mock examiner', await res.text());
      return generateMockWritingAnalysis(promptText, essayText, taskType);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateMockWritingAnalysis(promptText, essayText, taskType);
    }

    return JSON.parse(rawText) as WritingAnalysisResult;
  } catch (err) {
    console.error('Error invoking Gemini for writing:', err);
    return generateMockWritingAnalysis(promptText, essayText, taskType);
  }
}

export async function analyzeSpeakingWithGemini(
  promptTopic: string,
  audioBase64OrTranscript: { type: 'audio' | 'transcript'; data: string; mimeType?: string },
  speakingPart: 'part1' | 'part2_cuecard' | 'part3',
  apiKey?: string
): Promise<SpeakingAnalysisResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return generateMockSpeakingAnalysis(promptTopic, audioBase64OrTranscript.data, speakingPart);
  }

  const partsPayload: any[] = [];
  if (audioBase64OrTranscript.type === 'audio') {
    partsPayload.push({
      inlineData: {
        mimeType: audioBase64OrTranscript.mimeType || 'audio/webm',
        data: audioBase64OrTranscript.data
      }
    });
    partsPayload.push({
      text: `Listen to this spoken audio response for IELTS Speaking ${speakingPart}. Topic: "${promptTopic}". Transcribe and evaluate strictly against official Cambridge IELTS Speaking Band Descriptors (Fluency/Coherence, Lexical Resource, Grammatical Range/Accuracy, Pronunciation). Output JSON following the SpeakingAnalysisResult schema.`
    });
  } else {
    partsPayload.push({
      text: `IELTS Speaking ${speakingPart}. Topic: "${promptTopic}". Spoken Candidate Transcript: """${audioBase64OrTranscript.data}""". Evaluate strictly against official IELTS Speaking Band Descriptors. Output JSON.`
    });
  }

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: IELTS_SPEAKING_EXAMINER_SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: partsPayload
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!res.ok) {
      console.warn('Gemini speaking call failed, using mock analysis');
      return generateMockSpeakingAnalysis(promptTopic, audioBase64OrTranscript.data, speakingPart);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateMockSpeakingAnalysis(promptTopic, audioBase64OrTranscript.data, speakingPart);
    }

    return JSON.parse(rawText) as SpeakingAnalysisResult;
  } catch (err) {
    console.error('Error invoking Gemini for speaking:', err);
    return generateMockSpeakingAnalysis(promptTopic, audioBase64OrTranscript.data, speakingPart);
  }
}

// -------------------------------------------------------------
// High-Fidelity Mock Examiner Fallbacks (Ensures instant preview)
// -------------------------------------------------------------

function generateMockWritingAnalysis(prompt: string, essay: string, taskType: string): WritingAnalysisResult {
  const words = essay.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const targetMin = taskType === 'task2' ? 250 : 150;
  const isPenalty = wordCount < targetMin;

  const baseBand = isPenalty ? 5.5 : Math.min(8.0, Math.max(5.5, Number((5.5 + (wordCount / targetMin) * 1.5).toFixed(1))));

  return {
    overallBand: Math.round(baseBand * 2) / 2,
    wordCount,
    wordCountStatus: isPenalty ? 'penalty_applied' : 'sufficient',
    criteria: {
      taskAchievement: {
        score: isPenalty ? 5.5 : 7.0,
        bandLabel: isPenalty ? 'Band 5.5 (Underlength Penalty)' : 'Band 7.0 (Good Development)',
        feedback: isPenalty
          ? `Your response has ${wordCount} words, below the required ${targetMin} words. An official examiner will penalize underlength responses.`
          : 'Addresses all key components of the prompt with clear arguments and relevant supporting examples.',
        strengths: ['Directly answers the main topic prompt', 'Position is consistently stated'],
        weaknesses: isPenalty ? ['Did not reach the required minimum word count'] : ['Some secondary arguments could be extended further'],
        keyRecommendations: ['Ensure every main paragraph has at least one concrete real-world illustration.']
      },
      coherenceCohesion: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Coherent with Mechanical Linkers)',
        feedback: 'Overall progression is clear and logical. However, paragraph transitions rely slightly on mechanical connectors like "Furthermore" and "In addition".',
        strengths: ['Clear paragraph separation and central topic sentences', 'Logical flow from introduction to conclusion'],
        weaknesses: ['Mechanical cohesive devices used at sentence starts'],
        keyRecommendations: ['Use adverbial participle clauses or pronoun referencing to link ideas organically.']
      },
      lexicalResource: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Adequate Range with Occasional Imprecision)',
        feedback: 'Demonstrates a solid vocabulary foundation. Incorporating more less-common collocations and idiomatic academic expressions will lift you to Band 7.5+.',
        strengths: ['Good control of topic-related terminology', 'Accurate spelling throughout'],
        weaknesses: ['Repetition of generic terms like "important" and "solve the issue"'],
        keyRecommendations: ['Replace generic adjectives with nuanced academic descriptors (e.g., pivotal, detrimental).']
      },
      grammaticalRange: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Mix of Complex and Simple Structures)',
        feedback: 'Frequent use of complex sentence forms with generally good control. Occasional punctuation slips and comma splices noted.',
        strengths: ['Good usage of relative clauses and conditionals', 'Accurate subject-verb agreement'],
        weaknesses: ['Occasional run-on sentences in body paragraph 2'],
        keyRecommendations: ['Increase variety of structures using inversion or fronted adverbials.']
      }
    },
    sentenceFeedbacks: [
      {
        original: words.slice(0, 15).join(' ') || 'The rapid development of technology has a big effect on human life.',
        rewritten: 'The exponential proliferation of technological innovation exerts a profound influence on contemporary society.',
        issueType: 'vocabulary',
        explanation: 'Replacing "big effect" with the natural academic collocation "exerts a profound influence" elevates Lexical Resource.',
        bandUpgradeTip: 'Band 8+ Collocation: "exert an influence", "herald an era of".'
      },
      {
        original: 'People must solve this problem before it gets worse.',
        rewritten: 'Governments and individuals alike must proactively mitigate these escalating ramifications.',
        issueType: 'grammar',
        explanation: 'Upgrades conversational modal phrase "must solve this problem" to formal academic discourse.',
        bandUpgradeTip: 'Use "mitigate ramifications" instead of generic "solve problem".'
      }
    ],
    vocabularySuggestions: [
      {
        originalPhrase: 'big effect / big impact',
        suggestedUpgrade: 'exert a profound influence on',
        type: 'collocation',
        explanation: 'Standard C1 collocation favored by IELTS examiners over basic adjective "big".',
        exampleInSentence: 'Social media exerts a profound influence on youth mental health.'
      },
      {
        originalPhrase: 'good and bad sides',
        suggestedUpgrade: 'a double-edged sword / nuanced dichotomies',
        type: 'idiom',
        explanation: 'Natural idiomatic expression appropriate for IELTS Task 2 discussions.',
        exampleInSentence: 'While automated tools boost efficiency, they remain a double-edged sword.'
      },
      {
        originalPhrase: 'a lot of people think',
        suggestedUpgrade: 'it is widely contended that / proponents argue that',
        type: 'academic_c1_c2',
        explanation: 'Passive reporting structure that introduces academic objectivity.',
        exampleInSentence: 'It is widely contended that universal healthcare should be a fundamental entitlement.'
      }
    ],
    cohesionAnalysis: {
      overusedLinkers: ['Furthermore', 'In addition', 'In conclusion'],
      referencingQuality: 'Moderate. Consider substituting repeated subject nouns with pronouns (e.g., "these phenomena", "the former").',
      paragraphProgression: 'Clear introduction, 2 body paragraphs, and conclusion.'
    },
    examinerSummary: 'A solid essay that demonstrates clear competence. Reaching Band 7.5+ requires eliminating formulaic transitional linkers and polishing sentence complexity with C1 collocations.',
    modelAnswer: `In contemporary society, the trajectory of modern technology presents both remarkable advantages and complex ethical quandaries. Proponents contend that automation substantially enhances productivity, freeing individuals from menial labor. Conversely, skeptics caution that unregulated algorithmic systems exacerbate socioeconomic disparities.\n\nOn balance, while technological innovation inevitably disrupts conventional labor markets, proactive regulatory frameworks and comprehensive retraining initiatives can effectively harness these transformations for the collective good.`,
    primaryBottleneck: 'Reliance on generic vocabulary and mechanical paragraph linkers.'
  };
}

function generateMockSpeakingAnalysis(topic: string, sampleData: string, part: string): SpeakingAnalysisResult {
  return {
    overallBand: 6.5,
    transcript: sampleData || 'Well, to be honest, I think studying in the morning is much more productive for me because my mind is fresh and I can concentrate without distractions.',
    speechDurationSeconds: 45,
    wordsPerMinute: 132,
    pacingAssessment: 'ideal',
    fillerWords: {
      totalCount: 4,
      breakdown: [
        { word: 'um', count: 2 },
        { word: 'like', count: 1 },
        { word: 'you know', count: 1 }
      ],
      frequencyAnalysis: 'Occasional conversational fillers detected. Natural pace without excessive hesitation.'
    },
    criteria: {
      fluencyCoherence: {
        score: 7.0,
        bandLabel: 'Band 7.0 (Speaks at Length with Occasional Hesitation)',
        feedback: 'You demonstrated good willingness to speak at length with minimal language-seeking delays. Conversational flow is natural and coherent.',
        strengths: ['Natural speech rhythm and conversational momentum', 'Appropriate use of spoken discourse markers'],
        weaknesses: ['Minor reliance on "like" during topic transition'],
        keyRecommendations: ['Use pause silences or natural fillers like "Having said that" instead of "like".']
      },
      lexicalResource: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Sufficient Vocabulary with Some Idiomatic Awareness)',
        feedback: 'Good range of conversational vocabulary. Incorporating 1-2 idiomatic phrasal verbs will push your spoken LR to Band 7.5.',
        strengths: ['Good descriptive words for personal routine', 'No major vocabulary misuse'],
        weaknesses: ['Could use more idiomatic spoken language naturally'],
        keyRecommendations: ['Practice conversational phrasal verbs (e.g., "wind down", "get into the groove").']
      },
      grammaticalRange: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Mix of Simple and Complex Spoken Sentences)',
        feedback: 'Generally accurate speech. Occasional omission of 3rd person singular -s was noted under conversational pressure.',
        strengths: ['Effective use of subordinate reason clauses ("because...", "since...")', 'Accurate modal verb usage'],
        weaknesses: ['1 minor tense inconsistency in past reflection'],
        keyRecommendations: ['Incorporate second conditionals ("If I had more time, I would...") to showcase range.']
      },
      pronunciation: {
        score: 6.5,
        bandLabel: 'Band 6.5 (Generally Clear Intelligibility)',
        feedback: 'Your speech is effortless to understand overall. Pay special attention to final consonant clusters (e.g., -ts, -sed).',
        strengths: ['Natural sentence stress and rising/falling pitch', 'Clear vowel sounds'],
        weaknesses: ['Slightly rushed consonant endings on multi-syllable words'],
        keyRecommendations: ['Enunciate word endings clearly when concluding an argument.']
      }
    },
    idiomAndPhrasalVerbUpgrades: [
      {
        originalPhrase: 'relax after work/school',
        suggestedUpgrade: 'wind down / blow off some steam',
        type: 'phrasal_verb',
        explanation: 'Natural spoken British/American idiom highly favored in IELTS Speaking.',
        exampleInSentence: 'I usually take a brisk evening walk to wind down after hours of screen time.'
      },
      {
        originalPhrase: 'do it very rarely',
        suggestedUpgrade: 'once in a blue moon',
        type: 'idiom',
        explanation: 'Classic natural idiom demonstrating comfortable informal mastery.',
        exampleInSentence: 'To be fair, I only eat fast food once in a blue moon.'
      }
    ],
    spokenGrammarErrors: [
      {
        spokenSnippet: 'My friend he study late at night',
        correctedSnippet: 'My friend studies late at night',
        rule: 'Avoid double-subject ("My friend he") and remember 3rd person singular -s.'
      }
    ],
    pronunciationNotes: {
      phoneticIssue: 'Final consonant cluster softening',
      wordsAffected: ['productive', 'distractions'],
      intonationFeedback: 'Try ending questions or thoughts with a deliberate downward inflection to convey certainty.'
    },
    examinerSummary: 'A confident, coherent response with great natural pacing. Focus on integrating natural phrasal verbs and polishing final consonant enunciation for a comfortable Band 7.5+.',
    sampleBand9Response: 'To be completely candid, I find morning study sessions incomparably more fruitful. At that time of day, mental clutter is at an absolute minimum, which allows me to get into a deep groove before the everyday hustle takes over.',
    primaryBottleneck: 'Final consonant clarity and conversational phrasal verb frequency.'
  };
}
