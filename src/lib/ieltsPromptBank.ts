export interface WritingPrompt {
  id: string;
  type: 'task1_academic' | 'task1_general' | 'task2';
  category: string;
  title: string;
  prompt: string;
  suggestedTimeMinutes: number;
  minWordCount: number;
}

export interface SpeakingPrompt {
  id: string;
  part: 'part1' | 'part2_cuecard' | 'part3';
  topic: string;
  question: string;
  bulletPoints?: string[]; // For Part 2 cue cards
  suggestedDurationSeconds: number;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 't2-ai-jobs',
    type: 'task2',
    category: 'Technology & Employment',
    title: 'Artificial Intelligence and Future Jobs',
    prompt: 'Some people believe that artificial intelligence will replace most human jobs and create widespread unemployment, while others argue it will create new, higher-value opportunities. Discuss both views and give your own opinion.',
    suggestedTimeMinutes: 40,
    minWordCount: 250,
  },
  {
    id: 't2-environment-responsibility',
    type: 'task2',
    category: 'Environment',
    title: 'Individual vs Government Environmental Action',
    prompt: 'Some people argue that individuals can do little to protect the environment and that only large corporations and governments can solve global environmental crises. To what extent do you agree or disagree?',
    suggestedTimeMinutes: 40,
    minWordCount: 250,
  },
  {
    id: 't2-higher-education',
    type: 'task2',
    category: 'Education',
    title: 'University Tuition & Free Higher Education',
    prompt: 'Many governments provide free university education to all citizens, while others require students to pay high tuition fees. Discuss the advantages and disadvantages of free higher education.',
    suggestedTimeMinutes: 40,
    minWordCount: 250,
  },
  {
    id: 't1-acad-energy-consumption',
    type: 'task1_academic',
    category: 'Academic Chart',
    title: 'Renewable vs Fossil Fuel Energy Consumption (2000-2025)',
    prompt: 'The chart illustrates the changes in energy consumption by source (fossil fuels, nuclear, solar, and wind) in a European nation between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    suggestedTimeMinutes: 20,
    minWordCount: 150,
  },
  {
    id: 't1-gt-letter-complaint',
    type: 'task1_general',
    category: 'General Letter',
    title: 'Formal Letter to Public Transit Authority',
    prompt: 'You recently experienced a significant delay and poor service on a regional train journey. Write a formal letter to the rail manager. In your letter: explain the details of the journey, describe the problems you faced, and state what actions you expect the company to take.',
    suggestedTimeMinutes: 20,
    minWordCount: 150,
  },
];

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: 's2-influential-mentor',
    part: 'part2_cuecard',
    topic: 'People & Mentorship',
    question: 'Describe an influential teacher or mentor who had a lasting impact on your life.',
    bulletPoints: [
      'Who this person was and how you met them',
      'What subject or skill they taught you',
      'What made their approach or character distinctive',
      'Explain why they had such a significant impact on your development'
    ],
    suggestedDurationSeconds: 120,
  },
  {
    id: 's2-challenge-overcome',
    part: 'part2_cuecard',
    topic: 'Life Experiences',
    question: 'Describe a challenging project or task that you successfully completed.',
    bulletPoints: [
      'What the project or task was and when it happened',
      'What obstacles or difficulties you encountered',
      'How you managed to resolve the problems',
      'Explain how you felt after completing it'
    ],
    suggestedDurationSeconds: 120,
  },
  {
    id: 's1-hometown',
    part: 'part1',
    topic: 'Hometown & Living',
    question: 'Where is your hometown, and what do you like most about living there?',
    suggestedDurationSeconds: 30,
  },
  {
    id: 's1-study-habits',
    part: 'part1',
    topic: 'Work & Studies',
    question: 'Do you prefer studying or working in the morning or late at night? Why?',
    suggestedDurationSeconds: 30,
  },
  {
    id: 's3-ai-future-learning',
    part: 'part3',
    topic: 'Technology & Education',
    question: 'How do you think artificial intelligence will change the traditional classroom dynamic in the next decade?',
    suggestedDurationSeconds: 60,
  },
];
