/**
 * Comprehensive data library for IELTS Speaking Practice:
 * - Part 2 Scaffolding Frameworks & Target Lexical Packs
 * - Band 9 Shadowing Models with intonation markup and sentence breakdowns
 * - Fluency & Reflex Gym (A.R.E.A. Drills, Buying-Time Fillers, Collocation Upgrades)
 */

export interface LexicalItem {
  phrase: string;
  type: 'collocation' | 'idiom' | 'phrasal_verb' | 'discourse_marker';
  meaning: string;
  example: string;
}

export interface TopicLexicalPack {
  topicKey: string;
  topicName: string;
  items: LexicalItem[];
  frameworkHints: {
    fourWh: {
      whoWhat: string;
      whenWhere: string;
      why: string;
      howFelt: string;
    };
    ppf: {
      past: string;
      present: string;
      future: string;
    };
    storyArc: {
      setup: string;
      conflict: string;
      resolution: string;
    };
  };
}

export const TOPIC_LEXICAL_PACKS: Record<string, TopicLexicalPack> = {
  people: {
    topicKey: 'people',
    topicName: 'People, Teachers & Mentors',
    items: [
      {
        phrase: 'inspirational mentor',
        type: 'collocation',
        meaning: 'A guide who sparks deep motivation and positive personal growth.',
        example: 'He was truly an inspirational mentor who fundamentally reshaped my academic trajectory.',
      },
      {
        phrase: 'unorthodox teaching style',
        type: 'collocation',
        meaning: 'A non-traditional, innovative method of instruction.',
        example: 'What set her apart was her unorthodox teaching style, prioritizing open debate over rote memorization.',
      },
      {
        phrase: 'look past surface-level assumptions',
        type: 'idiom',
        meaning: 'To analyze critically rather than accepting appearances.',
        example: 'She always challenged us to look past surface-level assumptions when evaluating historical events.',
      },
      {
        phrase: 'instill a profound sense of curiosity',
        type: 'collocation',
        meaning: 'To deeply encourage an eager desire to learn.',
        example: 'His greatest gift was his ability to instill a profound sense of curiosity in every student.',
      },
      {
        phrase: 'lead by example',
        type: 'idiom',
        meaning: 'To inspire others through one’s own conduct rather than words alone.',
        example: 'Rather than lecturing us on discipline, she simply led by example through unmatched dedication.',
      },
    ],
    frameworkHints: {
      fourWh: {
        whoWhat: 'Introduce who the person is, your relationship, and their defining qualities.',
        whenWhere: 'Recall when you first met and the context (e.g. high school, university, workplace).',
        why: 'Explain specifically what made their mentorship invaluable compared to others.',
        howFelt: 'Reflect on how their guidance continues to influence your decisions and character today.',
      },
      ppf: {
        past: 'Back when I first encountered them, I was struggling with focus or direction...',
        present: 'In today’s world, whenever I face critical crossroads, their advice remains my moral compass...',
        future: 'Moving forward into my future career, I strive to embody those exact same leadership principles...',
      },
      storyArc: {
        setup: 'A moment in my youth when I felt uncertain about my abilities...',
        conflict: 'A demanding academic hurdle or crisis of confidence that tested me...',
        resolution: 'The pivotal advice they offered that shifted my perspective permanently...',
      },
    },
  },
  experience: {
    topicKey: 'experience',
    topicName: 'Challenging Experiences & Projects',
    items: [
      {
        phrase: 'an uphill battle',
        type: 'idiom',
        meaning: 'A very difficult struggle or arduous task.',
        example: 'Coordinating the cross-functional team initially felt like an uphill battle due to conflicting priorities.',
      },
      {
        phrase: 'rise to the occasion',
        type: 'idiom',
        meaning: 'To perform exceptionally well under sudden pressure or difficulty.',
        example: 'Despite the impending deadline, everyone managed to rise to the occasion and deliver a flawless result.',
      },
      {
        phrase: 'daunting hurdle',
        type: 'collocation',
        meaning: 'An intimidating obstacle that requires immense resolve.',
        example: 'The budget reduction presented a daunting hurdle, compelling us to devise innovative alternatives.',
      },
      {
        phrase: 'in hindsight',
        type: 'discourse_marker',
        meaning: 'Looking back with the benefit of experience.',
        example: 'In hindsight, that setback was a blessing in disguise, teaching me resilient problem-solving.',
      },
      {
        phrase: 'come to fruition',
        type: 'idiom',
        meaning: 'To reach a successful completion or desired outcome.',
        example: 'Seeing the completed project finally come to fruition was extraordinarily gratifying.',
      },
    ],
    frameworkHints: {
      fourWh: {
        whoWhat: 'Define the project or undertaking, its core objective, and your role.',
        whenWhere: 'State the timeframe, the environment, and who was collaborating with you.',
        why: 'Describe the unforeseen complication that made success so uncertain.',
        howFelt: 'Share the immense sense of accomplishment and the tactical lessons learned.',
      },
      ppf: {
        past: 'When the project commenced two years ago, expectations were sky-high yet resources were thin...',
        present: 'Presently, the outcome of that initiative serves as a cornerstone of my portfolio...',
        future: 'Whenever I tackle complex undertakings down the road, I will apply that hard-earned resilience...',
      },
      storyArc: {
        setup: 'We embarked on an ambitious initiative with high stakes...',
        conflict: 'Halfway through, an unexpected glitch nearly jeopardized months of preparation...',
        resolution: 'By recalibrating our strategy and burning the midnight oil, we crossed the finish line...',
      },
    },
  },
  travel: {
    topicKey: 'travel',
    topicName: 'Places, Travel & Architecture',
    items: [
      {
        phrase: 'bustling with activity',
        type: 'collocation',
        meaning: 'Full of lively energy, movement, and people.',
        example: 'The historic marketplace was perpetually bustling with activity from dawn until midnight.',
      },
      {
        phrase: 'off the beaten track',
        type: 'idiom',
        meaning: 'Away from crowded tourist spots; secluded and authentic.',
        example: 'We opted for an eco-lodge situated well off the beaten track to immerse ourselves in nature.',
      },
      {
        phrase: 'breathtaking panoramic vistas',
        type: 'collocation',
        meaning: 'Spectacular, wide-ranging scenic views.',
        example: 'Upon reaching the mountain summit, we were greeted by breathtaking panoramic vistas.',
      },
      {
        phrase: 'steeped in rich history',
        type: 'collocation',
        meaning: 'Having a profound, tangible heritage and antiquity.',
        example: 'Every cobblestone alleyway in the ancient quarter was steeped in rich history and folklore.',
      },
      {
        phrase: 'a welcome breath of fresh air',
        type: 'idiom',
        meaning: 'A refreshing change from routine city life.',
        example: 'Escaping the concrete jungle for the tranquil coastline was a welcome breath of fresh air.',
      },
    ],
    frameworkHints: {
      fourWh: {
        whoWhat: 'Name the destination, geographical setting, and who accompanied you.',
        whenWhere: 'When you travelled there, the season, and the journey itself.',
        why: 'What distinct architectural, natural, or cultural features made it unforgettable.',
        howFelt: 'The sense of wonder, rejuvenation, and why you yearn to revisit.',
      },
      ppf: {
        past: 'I had harboured a desire to explore that coastal town for several years before finally visiting...',
        present: 'To this day, the sensory memories—the sound of waves and aroma of local spices—remain vivid...',
        future: 'I have already earmarked that region for an extended return trip in the foreseeable future...',
      },
      storyArc: {
        setup: 'Setting off on a spontaneous journey to escape daily urban pressures...',
        conflict: 'Encountering navigational challenges or inclement weather along the road...',
        resolution: 'Discovering a hidden sanctuary that exceeded all prior expectations...',
      },
    },
  },
  technology: {
    topicKey: 'technology',
    topicName: 'Technology, Media & Modern Life',
    items: [
      {
        phrase: 'double-edged sword',
        type: 'idiom',
        meaning: 'Something with both significant advantages and severe drawbacks.',
        example: 'Generative AI is unquestionably a double-edged sword: it boosts productivity but risks dependency.',
      },
      {
        phrase: 'streamline daily operations',
        type: 'collocation',
        meaning: 'To make processes significantly smoother and faster.',
        example: 'Integrating smart home automation has helped streamline daily operations across my household.',
      },
      {
        phrase: 'strike a healthy equilibrium',
        type: 'collocation',
        meaning: 'To maintain balance between digital consumption and real life.',
        example: 'It is increasingly vital to strike a healthy equilibrium between online screen time and physical activity.',
      },
      {
        phrase: 'indispensable asset',
        type: 'collocation',
        meaning: 'An essential tool or resource one cannot easily do without.',
        example: 'My noise-cancelling headphones have become an indispensable asset during daily transit and study.',
      },
      {
        phrase: 'pave the way for',
        type: 'idiom',
        meaning: 'To create conditions that make future innovations possible.',
        example: 'Early cloud infrastructure paved the way for seamless remote collaboration across the globe.',
      },
    ],
    frameworkHints: {
      fourWh: {
        whoWhat: 'Introduce the gadget, app, or technological breakthrough.',
        whenWhere: 'When you began utilizing it and how it became part of your routine.',
        why: 'Explain the core functionality and why it outperforms traditional alternatives.',
        howFelt: 'Evaluate its long-term societal impact and your personal reliance on it.',
      },
      ppf: {
        past: 'Prior to adopting this piece of tech, completing administrative duties was thoroughly tedious...',
        present: 'Nowadays, it operates almost seamlessly in the background of my daily existence...',
        future: 'As computational models advance, I foresee this tool evolving into an even smarter assistant...',
      },
      storyArc: {
        setup: 'A recurring inefficiency in my workflow that used to waste hours each week...',
        conflict: 'Initial hesitation and learning curves when mastering new software or devices...',
        resolution: 'Achieving a breakthrough that boosted personal output and minimized stress...',
      },
    },
  },
  lifestyle: {
    topicKey: 'lifestyle',
    topicName: 'Hobbies, Health & Daily Habits',
    items: [
      {
        phrase: 'wind down and decompress',
        type: 'phrasal_verb',
        meaning: 'To relax, let go of stress, and recover after work.',
        example: 'Listening to instrumental jazz in the evening is my favorite way to wind down and decompress.',
      },
      {
        phrase: 'recharge my mental batteries',
        type: 'idiom',
        meaning: 'To regain psychological stamina, creativity, and energy.',
        example: 'A brisk twenty-minute run in the morning never fails to recharge my mental batteries.',
      },
      {
        phrase: 'once in a blue moon',
        type: 'idiom',
        meaning: 'Very rarely; on rare special occasions.',
        example: 'I normally adhere to a nutritious home-cooked diet, indulging in fast food only once in a blue moon.',
      },
      {
        phrase: 'be particularly keen on',
        type: 'phrasal_verb',
        meaning: 'To have a strong personal preference or passionate interest in.',
        example: 'I have always been particularly keen on landscape photography because it trains visual mindfulness.',
      },
      {
        phrase: 'form an integral component of',
        type: 'collocation',
        meaning: 'To become a vital, non-negotiable part of one’s routine.',
        example: 'Daily journaling now forms an integral component of my evening wind-down routine.',
      },
    ],
    frameworkHints: {
      fourWh: {
        whoWhat: 'Describe the hobby, activity, or health habit in vivid detail.',
        whenWhere: 'When you take part in it and where you typically carry it out.',
        why: 'Explain why it brings you solace, energy, or intellectual stimulation.',
        howFelt: 'Share the transformative physical or mental benefits it provides.',
      },
      ppf: {
        past: 'I stumbled across this pursuit quite by chance several years ago during a stressful exam period...',
        present: 'It has since blossomed into a cornerstone habit that anchors my emotional wellbeing...',
        future: 'I fully intend to deepen my commitment to it by joining dedicated local workshops...',
      },
      storyArc: {
        setup: 'Feeling overwhelmed by relentless screen time and hectic academic deadlines...',
        conflict: 'Struggling initially to carve out uninterrupted time and form consistent discipline...',
        resolution: 'Experiencing profound mental clarity that revitalized every aspect of my life...',
      },
    },
  },
};

/**
 * Returns the best matching lexical pack based on topic text.
 */
export function getLexicalPackForTopic(topic: string): TopicLexicalPack {
  const t = (topic || '').toLowerCase();
  if (t.includes('person') || t.includes('teacher') || t.includes('mentor') || t.includes('leader') || t.includes('friend')) {
    return TOPIC_LEXICAL_PACKS.people;
  }
  if (t.includes('challenge') || t.includes('project') || t.includes('experience') || t.includes('event') || t.includes('achievement')) {
    return TOPIC_LEXICAL_PACKS.experience;
  }
  if (t.includes('place') || t.includes('travel') || t.includes('city') || t.includes('country') || t.includes('building') || t.includes('nature')) {
    return TOPIC_LEXICAL_PACKS.travel;
  }
  if (t.includes('tech') || t.includes('ai') || t.includes('computer') || t.includes('media') || t.includes('internet') || t.includes('device')) {
    return TOPIC_LEXICAL_PACKS.technology;
  }
  return TOPIC_LEXICAL_PACKS.lifestyle;
}

// ==========================================================
// BAND 9 SHADOWING SCRIPT REPOSITORY
// ==========================================================
export interface ShadowingSentence {
  id: number;
  text: string;
  annotatedText: string; // HTML-ready string highlighting stressed words and intonation arrows (↗, ↘)
  intonationPattern: 'rising_lead' | 'falling_statement' | 'contrast_rise_fall' | 'list_rise_rise_fall';
  intonationExplanation: string;
  stressedWords: string[];
  keyCollocations: string[];
}

export interface ShadowingModel {
  id: string;
  topic: string;
  part: 'part1' | 'part2' | 'part3';
  question: string;
  contextSummary: string;
  fullModelAnswer: string;
  sentences: ShadowingSentence[];
  examinerNotes: string[];
}

export const SHADOWING_MODELS: ShadowingModel[] = [
  {
    id: 'shad-mentor',
    topic: 'An Influential Mentor (Part 2 Cue Card)',
    part: 'part2',
    question: 'Describe an influential teacher or mentor who had a lasting impact on your life.',
    contextSummary: 'Demonstrates authentic spoken storytelling with dynamic participial phrases and pitch modulation.',
    fullModelAnswer:
      "Well, to be totally candid, I'd love to talk about my high school literature teacher, Mr. David. He was truly an inspirational mentor who completely reshaped my perspective on critical thinking. What set him apart was his unorthodox teaching style; instead of lecturing for hours, he actively encouraged debate and challenged us to look past surface-level assumptions. Even today, whenever I face complex decisions, I recall his advice to examine challenges from multiple angles. Without question, his mentorship remains one of the most formative influences on my intellectual development.",
    sentences: [
      {
        id: 1,
        text: "Well, to be totally candid, I'd love to talk about my high school literature teacher, Mr. David.",
        annotatedText: "Well, to be <strong>totally candid</strong> ↗, I'd love to talk about my high school <strong>literature teacher</strong>, Mr. <strong>David</strong>. ↘",
        intonationPattern: 'rising_lead',
        intonationExplanation: 'Slight rising pitch (↗) on conversational opener "candid" signals more is coming; decisive falling pitch (↘) on "David".',
        stressedWords: ['totally', 'candid', 'literature', 'teacher', 'David'],
        keyCollocations: ['to be totally candid', 'literature teacher'],
      },
      {
        id: 2,
        text: "He was truly an inspirational mentor who completely reshaped my perspective on critical thinking.",
        annotatedText: "He was <strong>truly</strong> an <strong>inspirational mentor</strong> ↗ who completely <strong>reshaped</strong> my perspective on <strong>critical thinking</strong>. ↘",
        intonationPattern: 'contrast_rise_fall',
        intonationExplanation: 'Emphasizes "inspirational mentor" with rising inflection, followed by authoritative downward glide on "critical thinking".',
        stressedWords: ['truly', 'inspirational mentor', 'reshaped', 'critical thinking'],
        keyCollocations: ['inspirational mentor', 'reshaped my perspective', 'critical thinking'],
      },
      {
        id: 3,
        text: "What set him apart was his unorthodox teaching style; instead of lecturing for hours, he actively encouraged debate and challenged us to look past surface-level assumptions.",
        annotatedText: "What <strong>set him apart</strong> was his <strong>unorthodox teaching style</strong>; ↗ instead of lecturing for hours, he actively <strong>encouraged debate</strong> ↗ and challenged us to look past <strong>surface-level assumptions</strong>. ↘",
        intonationPattern: 'list_rise_rise_fall',
        intonationExplanation: 'Maintains rising intonation on non-final clauses ("teaching style ↗", "encouraged debate ↗") before firmly dropping at the terminal point ("assumptions ↘").',
        stressedWords: ['set him apart', 'unorthodox', 'teaching style', 'encouraged debate', 'surface-level assumptions'],
        keyCollocations: ['set him apart', 'unorthodox teaching style', 'surface-level assumptions'],
      },
      {
        id: 4,
        text: "Even today, whenever I face complex decisions, I recall his advice to examine challenges from multiple angles.",
        annotatedText: "Even <strong>today</strong> ↗, whenever I face <strong>complex decisions</strong> ↗, I recall his advice to examine challenges from <strong>multiple angles</strong>. ↘",
        intonationPattern: 'rising_lead',
        intonationExplanation: 'Two stepwise rises create rhythmic anticipation before resolving calmly on "multiple angles".',
        stressedWords: ['today', 'complex decisions', 'recall', 'multiple angles'],
        keyCollocations: ['complex decisions', 'examine from multiple angles'],
      },
      {
        id: 5,
        text: "Without question, his mentorship remains one of the most formative influences on my intellectual development.",
        annotatedText: "Without <strong>question</strong> ↗, his <strong>mentorship</strong> remains one of the most <strong>formative influences</strong> on my <strong>intellectual development</strong>. ↘",
        intonationPattern: 'falling_statement',
        intonationExplanation: 'Clear, strong downward inflection signals an authentic and confident conclusion to the examiner.',
        stressedWords: ['question', 'mentorship', 'formative influences', 'intellectual development'],
        keyCollocations: ['without question', 'formative influences', 'intellectual development'],
      },
    ],
    examinerNotes: [
      'Fluency (FC): Flawless transitional markers ("Well, to be totally candid", "What set him apart", "Even today").',
      'Lexical (LR): Natural high-band collocations ("unorthodox teaching style", "formative influences").',
      'Pronunciation (PR): Rhythmic contrast between light grammatical words and punchy stressed syllables.',
    ],
  },
  {
    id: 'shad-technology',
    topic: 'Artificial Intelligence & Screen Time (Part 3 Discussion)',
    part: 'part3',
    question: 'How do you think rapid technological advancement is affecting interpersonal relationships?',
    contextSummary: 'Showcases how to answer abstract philosophical inquiries with balanced critical evaluation.',
    fullModelAnswer:
      "From my perspective, technological advancement represents something of a double-edged sword. On one hand, automated platforms and instant messaging have virtually eradicated geographical barriers, facilitating instantaneous global collaboration. On the other hand, hyper-connectivity often comes at the expense of genuine emotional depth, with people prioritizing digital validation over face-to-face interaction. Therefore, striking a healthy equilibrium between virtual convenience and physical presence is imperative.",
    sentences: [
      {
        id: 1,
        text: "From my perspective, technological advancement represents something of a double-edged sword.",
        annotatedText: "From my <strong>perspective</strong> ↗, technological <strong>advancement</strong> represents something of a <strong>double-edged sword</strong>. ↘",
        intonationPattern: 'rising_lead',
        intonationExplanation: 'Stretches the vowel on "perspective ↗" before dropping decisively on the idiomatic punchline "double-edged sword ↘".',
        stressedWords: ['perspective', 'advancement', 'double-edged sword'],
        keyCollocations: ['from my perspective', 'double-edged sword'],
      },
      {
        id: 2,
        text: "On one hand, automated platforms and instant messaging have virtually eradicated geographical barriers, facilitating instantaneous global collaboration.",
        annotatedText: "On <strong>one hand</strong> ↗, automated platforms and instant messaging have <strong>virtually eradicated</strong> geographical barriers ↗, <strong>facilitating</strong> instantaneous global <strong>collaboration</strong>. ↘",
        intonationPattern: 'contrast_rise_fall',
        intonationExplanation: 'Signposts the first viewpoint with rising pitch, gliding down firmly at the end of the participial clause ("collaboration ↘").',
        stressedWords: ['one hand', 'automated platforms', 'virtually eradicated', 'geographical barriers', 'facilitating', 'collaboration'],
        keyCollocations: ['virtually eradicated', 'geographical barriers', 'global collaboration'],
      },
      {
        id: 3,
        text: "On the other hand, hyper-connectivity often comes at the expense of genuine emotional depth, with people prioritizing digital validation over face-to-face interaction.",
        annotatedText: "On the <strong>other hand</strong> ↗, <strong>hyper-connectivity</strong> often comes at the <strong>expense</strong> of genuine emotional depth ↗, with people <strong>prioritizing</strong> digital validation over <strong>face-to-face interaction</strong>. ↘",
        intonationPattern: 'list_rise_rise_fall',
        intonationExplanation: 'Contrasts sharply with the previous sentence. Upbeat tone on "other hand" then thoughtful downward contour on "face-to-face interaction".',
        stressedWords: ['other hand', 'hyper-connectivity', 'expense', 'emotional depth', 'prioritizing', 'digital validation', 'face-to-face'],
        keyCollocations: ['at the expense of', 'emotional depth', 'digital validation', 'face-to-face interaction'],
      },
      {
        id: 4,
        text: "Therefore, striking a healthy equilibrium between virtual convenience and physical presence is imperative.",
        annotatedText: "<strong>Therefore</strong> ↗, <strong>striking a healthy equilibrium</strong> between virtual convenience and physical presence is <strong>imperative</strong>. ↘",
        intonationPattern: 'falling_statement',
        intonationExplanation: 'Decisive conclusive tone. "Imperative" carries deep downward stress to reinforce final conviction.',
        stressedWords: ['Therefore', 'striking a healthy equilibrium', 'virtual convenience', 'physical presence', 'imperative'],
        keyCollocations: ['striking a healthy equilibrium', 'physical presence', 'is imperative'],
      },
    ],
    examinerNotes: [
      'Grammar (GRA): Masterful use of participial clauses ("facilitating instantaneous global collaboration") and correlative discourse ("On one hand... On the other hand").',
      'Lexical (LR): Sophisticated academic register ("hyper-connectivity", "virtually eradicated", "striking a healthy equilibrium").',
    ],
  },
  {
    id: 'shad-routine',
    topic: 'Daily Routine & Focus (Part 1 Short Q&A)',
    part: 'part1',
    question: 'Do you prefer studying or working in the morning or late at night? Why?',
    contextSummary: 'Shows how to turn a simple Part 1 personal inquiry into a concise, fluent 20-second Band 8.5+ answer.',
    fullModelAnswer:
      "To be completely honest, I find morning sessions incomparably more fruitful. At that time of day, mental clutter is at an absolute minimum, which allows me to get into a deep groove before everyday distractions kick in. In contrast, working late at night usually feels like an uphill battle against mental fatigue. So for me, an hour at dawn easily trumps three hours of midnight cramming.",
    sentences: [
      {
        id: 1,
        text: "To be completely honest, I find morning sessions incomparably more fruitful.",
        annotatedText: "To be <strong>completely honest</strong> ↗, I find morning sessions <strong>incomparably more fruitful</strong>. ↘",
        intonationPattern: 'rising_lead',
        intonationExplanation: 'Casual conversational opener ("honest ↗") followed by a smooth downward cadence on "fruitful ↘".',
        stressedWords: ['completely honest', 'morning sessions', 'incomparably', 'fruitful'],
        keyCollocations: ['to be completely honest', 'incomparably more fruitful'],
      },
      {
        id: 2,
        text: "At that time of day, mental clutter is at an absolute minimum, which allows me to get into a deep groove before everyday distractions kick in.",
        annotatedText: "At that time of day, <strong>mental clutter</strong> is at an <strong>absolute minimum</strong> ↗, which allows me to get into a <strong>deep groove</strong> ↗ before everyday distractions <strong>kick in</strong>. ↘",
        intonationPattern: 'list_rise_rise_fall',
        intonationExplanation: 'Rhythmic clauses linked naturally with weak forms (/æt ðæt taɪm əv deɪ/).',
        stressedWords: ['mental clutter', 'absolute minimum', 'deep groove', 'distractions', 'kick in'],
        keyCollocations: ['mental clutter', 'absolute minimum', 'deep groove', 'kick in'],
      },
      {
        id: 3,
        text: "In contrast, working late at night usually feels like an uphill battle against mental fatigue.",
        annotatedText: "In <strong>contrast</strong> ↗, working late at night usually feels like an <strong>uphill battle</strong> against <strong>mental fatigue</strong>. ↘",
        intonationPattern: 'contrast_rise_fall',
        intonationExplanation: 'Noticeable pitch lift on "contrast" to signal comparison, with falling resonance on "fatigue".',
        stressedWords: ['contrast', 'late at night', 'uphill battle', 'mental fatigue'],
        keyCollocations: ['in contrast', 'an uphill battle', 'mental fatigue'],
      },
      {
        id: 4,
        text: "So for me, an hour at dawn easily trumps three hours of midnight cramming.",
        annotatedText: "So for <strong>me</strong> ↗, an hour at <strong>dawn</strong> ↗ easily <strong>trumps</strong> three hours of <strong>midnight cramming</strong>. ↘",
        intonationPattern: 'falling_statement',
        intonationExplanation: 'Punchy spoken idiom "trumps" emphasized with vibrant intonation, finishing with a crisp fall on "cramming".',
        stressedWords: ['me', 'dawn', 'trumps', 'midnight cramming'],
        keyCollocations: ['hour at dawn', 'easily trumps', 'midnight cramming'],
      },
    ],
    examinerNotes: [
      'Fluency (FC): Direct response within the first 3 seconds, avoiding rambling.',
      'Idiomatic command: Native spoken phrases ("get into a deep groove", "kick in", "trumps").',
    ],
  },
];

// ==========================================================
// FLUENCY & REFLEX GYM DATA (A.R.E.A., FILLERS, FLASHCARDS)
// ==========================================================

export interface AreaDrillQuestion {
  id: string;
  category: string;
  question: string;
  guidedAnswer: {
    answer: {
      stem: string;
      sample: string;
      tip: string;
    };
    reason: {
      stem: string;
      sample: string;
      tip: string;
    };
    example: {
      stem: string;
      sample: string;
      tip: string;
    };
    alternative: {
      stem: string;
      sample: string;
      tip: string;
    };
  };
}

export const AREA_DRILLS: AreaDrillQuestion[] = [
  {
    id: 'area-1',
    category: 'Urban Living & Environment',
    question: 'Do you think modern cities should invest more funds into public parks or public transit?',
    guidedAnswer: {
      answer: {
        stem: 'Without a shadow of a doubt, I would contend that...',
        sample: 'Without a shadow of a doubt, I would contend that developing reliable public transit should take precedence.',
        tip: 'State your position in the very first sentence. Never hedge or say "it depends" without committing first.',
      },
      reason: {
        stem: 'The underlying rationale behind this is primarily because...',
        sample: 'The underlying rationale behind this is primarily because efficient transit directly mitigates chronic traffic congestion and slashes carbon emissions on a city-wide scale.',
        tip: 'Provide the core cause-and-effect mechanism rather than a superficial repetition of your answer.',
      },
      example: {
        stem: 'A prominent case in point can be witnessed in...',
        sample: 'A prominent case in point can be witnessed in metropolises like Tokyo and Singapore, where comprehensive metro systems make car ownership virtually unnecessary.',
        tip: 'Ground your thought with a real city, personal observation, or tangible statistic.',
      },
      alternative: {
        stem: 'Having said that, one cannot disregard the fact that...',
        sample: 'Having said that, one cannot disregard the fact that urban green spaces are vital for citizen mental health, so municipal planners must aim for a harmonious balance.',
        tip: 'Demonstrates Band 8+ critical thinking: acknowledge the competing priority before concluding.',
      },
    },
  },
  {
    id: 'area-2',
    category: 'Work & Lifestyle',
    question: 'Do you believe remote working will completely replace traditional office environments in the future?',
    guidedAnswer: {
      answer: {
        stem: 'I am highly inclined to believe that...',
        sample: 'I am highly inclined to believe that remote work will not completely supplant the office, but rather coexist in a hybrid model.',
        tip: 'Clear, mature answer that avoids unrealistic extremes.',
      },
      reason: {
        stem: 'This stems principally from the fact that...',
        sample: 'This stems principally from the fact that while digital tools afford immense convenience, spontaneous creative synergy and team camaraderie still thrive best in physical spaces.',
        tip: 'Explain the human psychological reason behind the trend.',
      },
      example: {
        stem: 'To illustrate this dynamic...',
        sample: 'To illustrate this dynamic, numerous tech multinationals that initially went fully remote have since transitioned to mandatory two or three days on-site.',
        tip: 'Cite real corporate or personal experiences to lend credibility.',
      },
      alternative: {
        stem: 'That being said, for certain niche professions...',
        sample: 'That being said, for digital nomads and freelance software engineers, physical office presence is already obsolete.',
        tip: 'Highlight exceptions to demonstrate subtle linguistic nuance.',
      },
    },
  },
  {
    id: 'area-3',
    category: 'Education & Technology',
    question: 'Should schools place greater emphasis on teaching coding over traditional humanities?',
    guidedAnswer: {
      answer: {
        stem: 'From where I stand, prioritizing one to the detriment of the other is...',
        sample: 'From where I stand, prioritizing coding to the detriment of humanities would be a short-sighted mistake.',
        tip: 'Use sophisticated idiomatic phrasing like "to the detriment of" right at the outset.',
      },
      reason: {
        stem: 'The main justification for this perspective is that...',
        sample: 'The main justification for this perspective is that while digital literacy guarantees employable skills, humanities cultivate ethical judgment, empathy, and critical rhetoric.',
        tip: 'Contrast technological hard skills with humanistic soft skills.',
      },
      example: {
        stem: 'Take ethical AI engineering, for instance...',
        sample: 'Take ethical AI engineering, for instance; building responsible automated algorithms requires philosophers and sociologists just as much as coders.',
        tip: 'A timely, modern example immediately catches the examiner’s ear.',
      },
      alternative: {
        stem: 'Nevertheless, introducing foundational computational thinking...',
        sample: 'Nevertheless, introducing foundational computational thinking at an early age is undeniably essential for modern career readiness.',
        tip: 'Balance your stance to prevent sounding dogmatic or narrow-minded.',
      },
    },
  },
];

export interface BuyingTimeFiller {
  id: string;
  category: 'Honest Pause' | 'Complex Analysis' | 'Novel Perspective' | 'Clarification / Pivot' | 'Conditional View';
  phrase: string;
  phoneticAudioText: string;
  whyExaminersLoveIt: string;
  usageContext: string;
  sampleFollowUp: string;
}

export const BUYING_TIME_FILLERS: BuyingTimeFiller[] = [
  {
    id: 'filler-1',
    category: 'Honest Pause',
    phrase: 'To be completely candid with you, that is not something I have contemplated in great depth before, but...',
    phoneticAudioText: 'To be completely candid with you, that is not something I have contemplated in great depth before, but...',
    whyExaminersLoveIt: 'Replaces silent pauses or "umm" with fluent, native-sounding candor. Band 8 examiners reward honest conversational discourse.',
    usageContext: 'When asked an unexpected or eccentric Part 1/Part 3 question (e.g. "Do you like mirrors?", "How will shoes look in 50 years?").',
    sampleFollowUp: '...off the top of my head, I would say it reflects changing aesthetics.',
  },
  {
    id: 'filler-2',
    category: 'Complex Analysis',
    phrase: 'That is actually a rather multifaceted inquiry, but looking at it from an economic vantage point...',
    phoneticAudioText: 'That is actually a rather multifaceted inquiry, but looking at it from an economic vantage point...',
    whyExaminersLoveIt: 'Instantly frames your response in a high-band academic register, buying you 4 full seconds to organize points.',
    usageContext: 'When presented with heavy Part 3 societal or environmental questions.',
    sampleFollowUp: '...the financial ramifications are far more pressing than social ones.',
  },
  {
    id: 'filler-3',
    category: 'Novel Perspective',
    phrase: 'That is a thought-provoking question. If I had to venture a considered guess, I would say...',
    phoneticAudioText: 'That is a thought-provoking question. If I had to venture a considered guess, I would say...',
    whyExaminersLoveIt: 'Demonstrates advanced hypothetical grammar ("If I had to venture...") without pausing your delivery flow.',
    usageContext: 'When asked to predict future trends or hypothetical scenarios.',
    sampleFollowUp: '...we will witness a profound paradigm shift towards renewable energy.',
  },
  {
    id: 'filler-4',
    category: 'Conditional View',
    phrase: 'Well, I suppose it really hinges on which demographic or angle you examine first...',
    phoneticAudioText: 'Well, I suppose it really hinges on which demographic or angle you examine first...',
    whyExaminersLoveIt: 'Signals that you understand complexity and will discuss contrasting perspectives (Band 8+ Coherence).',
    usageContext: 'When asked whether a habit or policy is "good or bad for everyone".',
    sampleFollowUp: '...for younger generations it is second nature, whereas older citizens might hesitate.',
  },
  {
    id: 'filler-5',
    category: 'Clarification / Pivot',
    phrase: 'While there is certainly no single consensus on this issue, based on my personal observations...',
    phoneticAudioText: 'While there is certainly no single consensus on this issue, based on my personal observations...',
    whyExaminersLoveIt: 'Acknowledges diverse societal opinions before seamlessly bridging into your personal narrative.',
    usageContext: 'When asked about cultural habits, parenting styles, or generational debates.',
    sampleFollowUp: '...the consensus seems to be shifting toward greater work-life autonomy.',
  },
];

export interface CollocationFlashcard {
  id: string;
  basicPhrase: string;
  upgradedCollocation: string;
  registerLevel: 'Band 7.5+' | 'Band 8.0+' | 'Band 8.5+';
  definition: string;
  exampleIeltsSentence: string;
  category: 'Fluency' | 'Opinions' | 'Emphasis' | 'Lifestyle' | 'Challenges';
}

export const COLLOCATION_FLASHCARDS: CollocationFlashcard[] = [
  {
    id: 'col-1',
    basicPhrase: 'very important',
    upgradedCollocation: 'of paramount importance / a game-changer',
    registerLevel: 'Band 8.0+',
    definition: 'Exceedingly crucial; transformative in effect.',
    exampleIeltsSentence: 'Cultivating digital literacy is of paramount importance for young graduates entering the workforce.',
    category: 'Emphasis',
  },
  {
    id: 'col-2',
    basicPhrase: 'I really like / I enjoy',
    upgradedCollocation: 'am particularly keen on / have a profound affinity for',
    registerLevel: 'Band 8.0+',
    definition: 'To possess a dedicated, enduring fondness for something.',
    exampleIeltsSentence: 'I have always had a profound affinity for classical literature because of its enduring moral insights.',
    category: 'Opinions',
  },
  {
    id: 'col-3',
    basicPhrase: 'relax after work',
    upgradedCollocation: 'wind down and decompress',
    registerLevel: 'Band 7.5+',
    definition: 'To release stress and mentally reset after exhausting labor.',
    exampleIeltsSentence: 'Taking a solitary evening walk helps me wind down and decompress after a grueling day at the office.',
    category: 'Lifestyle',
  },
  {
    id: 'col-4',
    basicPhrase: 'very difficult',
    upgradedCollocation: 'an uphill battle / a formidable hurdle',
    registerLevel: 'Band 8.5+',
    definition: 'A strenuous task demanding immense determination.',
    exampleIeltsSentence: 'Securing venture capital during an economic downturn was an uphill battle from start to finish.',
    category: 'Challenges',
  },
  {
    id: 'col-5',
    basicPhrase: 'rarely / not often',
    upgradedCollocation: 'once in a blue moon',
    registerLevel: 'Band 7.5+',
    definition: 'On exceedingly rare, infrequent occasions.',
    exampleIeltsSentence: 'Due to my rigorous study schedule, I only get to dine out once in a blue moon.',
    category: 'Fluency',
  },
  {
    id: 'col-6',
    basicPhrase: 'very crowded place',
    upgradedCollocation: 'bustling with activity / packed to the rafters',
    registerLevel: 'Band 8.0+',
    definition: 'Extremely full of vibrant human energy and movement.',
    exampleIeltsSentence: 'During festival seasons, the central market square is perpetually bustling with activity.',
    category: 'Lifestyle',
  },
  {
    id: 'col-7',
    basicPhrase: 'I think that...',
    upgradedCollocation: 'I am strongly inclined to believe that...',
    registerLevel: 'Band 8.0+',
    definition: 'To hold a thoughtful, well-considered conviction.',
    exampleIeltsSentence: 'I am strongly inclined to believe that investing in renewable energy yields superior economic returns.',
    category: 'Opinions',
  },
  {
    id: 'col-8',
    basicPhrase: 'a lot of problems',
    upgradedCollocation: 'a myriad of unforeseen impediments',
    registerLevel: 'Band 8.5+',
    definition: 'Numerous complicated obstacles and bottlenecks.',
    exampleIeltsSentence: 'The construction project encountered a myriad of unforeseen impediments regarding supply lines.',
    category: 'Challenges',
  },
  {
    id: 'col-9',
    basicPhrase: 'make a decision',
    upgradedCollocation: 'take the plunge / weigh up the pros and cons',
    registerLevel: 'Band 7.5+',
    definition: 'To decisively commit after deliberate, careful comparison.',
    exampleIeltsSentence: 'After weighing up the pros and cons for months, I finally decided to take the plunge and study abroad.',
    category: 'Fluency',
  },
  {
    id: 'col-10',
    basicPhrase: 'have both good and bad sides',
    upgradedCollocation: 'represents a double-edged sword',
    registerLevel: 'Band 8.0+',
    definition: 'Carries equally substantial benefits and perils.',
    exampleIeltsSentence: 'Social networking represents a double-edged sword: fostering connection while sparking comparison fatigue.',
    category: 'Opinions',
  },
  {
    id: 'col-11',
    basicPhrase: 'learn a lot of things',
    upgradedCollocation: 'broaden my horizons / steep learning curve',
    registerLevel: 'Band 8.0+',
    definition: 'To expand one’s worldview and rapidly acquire expertise.',
    exampleIeltsSentence: 'Travelling solo forced me to broaden my horizons and navigate unpredictable situations.',
    category: 'Fluency',
  },
  {
    id: 'col-12',
    basicPhrase: 'very cheap',
    upgradedCollocation: 'eminently affordable / pocket-friendly',
    registerLevel: 'Band 7.5+',
    definition: 'Priced reasonably without sacrificing quality.',
    exampleIeltsSentence: 'Street food vendors in my hometown provide eminently affordable meals for working students.',
    category: 'Lifestyle',
  },
];
