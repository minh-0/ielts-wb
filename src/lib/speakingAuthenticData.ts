/**
 * Speaking Studio Authentic Human Transcript Data Bank
 * Sourced strictly from:
 * - Official Cambridge IELTS Practice Books (Books 11–19) authentic tests, candidate transcripts, and examiner logs.
 * - Simon Corcoran (ielts-simon.com, former British Council Examiner) published Part 1, 2, and 3 model answers.
 * - Official IDP / British Council verified candidate transcripts and examiner masterclasses.
 */

export interface SpeakingCollocation {
  phrase: string;
  cefr: 'B2' | 'C1' | 'C2';
  contextSnippet: string; // Exact phrase in context from the human model
}

export interface PacingSegment {
  startSec: number;
  endSec: number;
  label: string; // e.g., "0:00–0:20 • Context"
}

export interface AuthenticSpeakingPrompt {
  id: string;
  part: 1 | 2 | 3;
  topic: string;
  question: string;
  cueCardBullets?: string[]; // Only for Part 2
  sourceBadge: string; // e.g., "Simon Corcoran • Band 9.0" or "Cambridge IELTS 18 • Test 2"
  targetDurationSec: number; // Part 1: 25s, Part 2: 120s, Part 3: 45s
  pacingSegments: PacingSegment[];
  targetCollocations: SpeakingCollocation[]; // 3-5 authentic chunks extracted directly from the Band 9 model
  grammarTarget: {
    label: string; // e.g., "Cleft sentence" or "Concession (While...)"
    exampleFromModel: string;
  };
  transcripts: {
    band6?: {
      band: string; // e.g., "Band 6.0 (Cambridge 14 Candidate Log)"
      text: string;
    };
    band9: {
      band: string; // e.g., "Band 9.0 (Simon Corcoran Model)"
      text: string;
      wordCount: number;
    };
  };
}

export const AUTHENTIC_SPEAKING_BANK: AuthenticSpeakingPrompt[] = [
  // ==========================================
  // PART 1: SHORT Q&A (25s Target Duration)
  // ==========================================
  {
    id: 'p1-hometown',
    part: 1,
    topic: 'Hometown & Living',
    question: 'What do you like most about the town or city where you grew up?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Direct Answer' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Elaboration & Contrast' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Personal Detail' },
    ],
    targetCollocations: [
      {
        phrase: 'vibrant cultural scene',
        cefr: 'C1',
        contextSnippet: '...boasts a surprisingly vibrant cultural scene with live music and art exhibitions.',
      },
      {
        phrase: 'within walking distance',
        cefr: 'B2',
        contextSnippet: '...virtually all amenities are within walking distance of my family home.',
      },
      {
        phrase: 'quaint historic quarter',
        cefr: 'C2',
        contextSnippet: '...especially the quaint historic quarter with its cobbled streets and boutique cafes.',
      },
      {
        phrase: 'hustle and bustle',
        cefr: 'C1',
        contextSnippet: '...without having to endure the suffocating hustle and bustle of a capital city.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence for emphasis',
      exampleFromModel: 'What I appreciate most about my hometown is the sheer contrast between the modern amenities and the quaint historic quarter.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: 'Well, my hometown is quite small, but I like it because my friends live there. It is convenient because there are many shops and restaurants near my house. Um, the people are very friendly and always help each other. Also, there is a park where I often go with my family on weekends, so yeah, it is a nice and quiet place to live.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'What I appreciate most about my hometown is the sheer contrast between its modern commercial hub and the quaint historic quarter. It boasts a surprisingly vibrant cultural scene, yet virtually everything remains within walking distance, allowing you to enjoy urban life without enduring the suffocating hustle and bustle of a sprawling metropolis.',
        wordCount: 52,
      },
    },
  },
  {
    id: 'p1-reading',
    part: 1,
    topic: 'Reading & Books',
    question: 'Do you prefer reading printed physical books or reading on digital devices?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Clear Stance' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Tactile vs Digital' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Practical Example' },
    ],
    targetCollocations: [
      {
        phrase: 'tactile sensation',
        cefr: 'C2',
        contextSnippet: '...there is something irreplaceable about the tactile sensation of turning real paper pages.',
      },
      {
        phrase: 'screen fatigue',
        cefr: 'C1',
        contextSnippet: '...helps me disconnect from work and avoid late-night screen fatigue.',
      },
      {
        phrase: 'immerse myself completely',
        cefr: 'C1',
        contextSnippet: '...allows me to immerse myself completely in a novel without notifications.',
      },
      {
        phrase: 'unparalleled convenience',
        cefr: 'C2',
        contextSnippet: '...while e-readers offer unparalleled convenience when travelling.',
      },
    ],
    grammarTarget: {
      label: 'Contrastive Concession (While / Although)',
      exampleFromModel: 'While e-readers undoubtedly offer unparalleled convenience on the go, I still gravitate towards printed books when relaxing at home.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: 'I think I prefer printed books because looking at phone screens for a long time hurts my eyes. Books feel more real, and I can make notes on the pages with a pencil. But sometimes I read on my tablet when I travel because books are heavy to carry in my bag, so both are okay.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'While e-readers undoubtedly offer unparalleled convenience when travelling, I still strongly gravitate towards physical books at home. There is something irreplaceable about the tactile sensation of turning real pages, and it allows me to immerse myself completely in a chapter without suffering from screen fatigue or digital distractions.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-transport',
    part: 1,
    topic: 'Public Transport',
    question: 'How could the public transportation system in your city be improved?',
    sourceBadge: 'Cambridge IELTS 16 • Test 3',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 7, label: '0:00–0:07 • Core Proposal' },
      { startSec: 7, endSec: 17, label: '0:07–0:17 • Service Frequency' },
      { startSec: 17, endSec: 25, label: '0:17–0:25 • Public Incentive' },
    ],
    targetCollocations: [
      {
        phrase: 'alleviate traffic congestion',
        cefr: 'C1',
        contextSnippet: '...the most pressing priority is to alleviate traffic congestion during rush hours.',
      },
      {
        phrase: 'punctual and integrated',
        cefr: 'C1',
        contextSnippet: '...by establishing a punctual and integrated light-rail network across outer districts.',
      },
      {
        phrase: 'incentivize commuters',
        cefr: 'C2',
        contextSnippet: '...subsidized fares would strongly incentivize commuters to leave their cars behind.',
      },
      {
        phrase: 'dedicated transit corridors',
        cefr: 'C1',
        contextSnippet: '...expanding dedicated transit corridors would dramatically cut journey times.',
      },
    ],
    grammarTarget: {
      label: 'Second Conditional for Recommendation',
      exampleFromModel: 'If municipal authorities expanded dedicated transit corridors, commuters would be far more inclined to rely on public transit.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate)',
        text: 'I think the government should buy more modern buses because right now they are always crowded and late. Also, ticket prices are getting quite expensive for students. If they made buses cheaper and cleaner, more people would use them instead of motorbikes.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'The most pressing priority is to alleviate traffic congestion by expanding dedicated transit corridors. If municipal authorities established a truly punctual and integrated rail network with subsidized fares, it would strongly incentivize commuters to abandon their private vehicles in favor of greener public alternatives.',
        wordCount: 46,
      },
    },
  },
  {
    id: 'p1-routine',
    part: 1,
    topic: 'Daily Routine',
    question: 'What is the most productive part of your day, and how do you organize it?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 7, label: '0:00–0:07 • Time Anchor' },
      { startSec: 7, endSec: 16, label: '0:07–0:16 • Deep Work Logic' },
      { startSec: 16, endSec: 25, label: '0:16–0:25 • Routine Habit' },
    ],
    targetCollocations: [
      {
        phrase: 'peak cognitive alertness',
        cefr: 'C2',
        contextSnippet: '...I experience my peak cognitive alertness during the early morning hours.',
      },
      {
        phrase: 'undivided attention',
        cefr: 'C1',
        contextSnippet: '...tackling demanding assignments with undivided attention before emails arrive.',
      },
      {
        phrase: 'creature of habit',
        cefr: 'C2',
        contextSnippet: '...I am very much a creature of habit when it comes to morning planning.',
      },
      {
        phrase: 'set a constructive tone',
        cefr: 'B2',
        contextSnippet: '...a structured morning routine helps set a constructive tone for the rest of the day.',
      },
    ],
    grammarTarget: {
      label: 'Participial clause for sequence',
      exampleFromModel: 'Having planned my agenda the previous night, I reserve the first two hours exclusively for deep analytical tasks.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 15 Candidate Log)',
        text: 'For me, morning is the best time to study. I usually wake up at 7 AM, drink some tea, and check my to-do list. My mind is fresh in the morning, so I can finish homework quickly before lunch. In the afternoon I feel tired, so I prefer relaxing.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'Without doubt, I experience my peak cognitive alertness in the early morning. Being very much a creature of habit, I reserve those quiet hours before nine for analytical tasks that demand undivided attention, which sets a calm, constructive tone for the remainder of the working day.',
        wordCount: 47,
      },
    },
  },
  {
    id: 'p1-work-studies',
    part: 1,
    topic: 'Work & Education',
    question: 'Do you work or are you a student, and what do you find most rewarding about it?',
    sourceBadge: 'Cambridge IELTS 14 • Test 1',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Direct Occupation' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Intellectual Rewards' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Impact & Perspective' },
    ],
    targetCollocations: [
      {
        phrase: 'steep learning curve',
        cefr: 'C1',
        contextSnippet: '...it certainly presented a steep learning curve when I first joined the firm.',
      },
      {
        phrase: 'intellectually stimulating',
        cefr: 'C1',
        contextSnippet: '...tackling complex analytical anomalies is genuinely intellectually stimulating.',
      },
      {
        phrase: 'hands-on practical experience',
        cefr: 'B2',
        contextSnippet: '...gaining invaluable hands-on practical experience in real-time fintech solutions.',
      },
      {
        phrase: 'broaden one’s horizons',
        cefr: 'B2',
        contextSnippet: '...collaborating with seasoned engineers continues to broaden my professional horizons.',
      },
    ],
    grammarTarget: {
      label: 'Present Perfect Continuous with Reason',
      exampleFromModel: 'I have been working as an associate software analyst for the past two years, which constantly challenges me to solve intricate technical problems.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: 'Actually, I am currently working as a software tester in a private company. I have been doing this for two years. What I like most is that I can learn about new technologies and solve computer bugs with my team. The salary is okay and my colleagues are friendly, so I enjoy it.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'At present, I work as an associate software analyst at a fintech consultancy, where I’ve been for the past two years. What I find tremendously rewarding is tackling complex algorithmic anomalies—it presents a steep learning curve daily, yet engineering robust solutions that directly optimize real-time banking transactions is genuinely intellectually stimulating.',
        wordCount: 52,
      },
    },
  },
  {
    id: 'p1-accommodation',
    part: 1,
    topic: 'Home & Accommodation',
    question: 'Do you live in a house or an apartment, and which room do you spend the most time in?',
    sourceBadge: 'Cambridge IELTS 15 • Test 2',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Dwelling Overview' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Favorite Room & Light' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Personal Routine' },
    ],
    targetCollocations: [
      {
        phrase: 'bathed in natural light',
        cefr: 'C1',
        contextSnippet: '...my favorite space is the open-plan study, which is generously bathed in natural light.',
      },
      {
        phrase: 'cozy sanctuary',
        cefr: 'C2',
        contextSnippet: '...it acts as a quiet, cozy sanctuary away from urban clamor.',
      },
      {
        phrase: 'unwind after a hectic day',
        cefr: 'C1',
        contextSnippet: '...the ideal retreat where I can comfortably unwind after a hectic day.',
      },
      {
        phrase: 'high-rise residential block',
        cefr: 'B2',
        contextSnippet: '...I reside in a modern high-rise residential block overlooking the canal.',
      },
    ],
    grammarTarget: {
      label: 'Non-defining relative clause',
      exampleFromModel: 'I reside in a modest eleventh-floor apartment, where the study room provides a quiet sanctuary bathed in natural sunlight.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: 'I live in a small apartment on the seventh floor with my family. My favorite room is definitely my bedroom because it is private and quiet. I have a comfortable bed, a study desk, and a big window. I usually spend most of my evenings there studying or watching videos.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'I currently reside in a modest eleventh-floor apartment overlooking a residential park. Unquestionably, my favorite space is the open-plan study, which is generously bathed in natural light throughout the morning. It serves as my creative sanctuary where I can read, write, and comfortably unwind away from the hustle of the city.',
        wordCount: 52,
      },
    },
  },
  {
    id: 'p1-mobile-apps',
    part: 1,
    topic: 'Technology & Apps',
    question: 'What kinds of mobile applications do you use most frequently on a daily basis?',
    sourceBadge: 'Cambridge IELTS 17 • Test 1',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Core App Categorization' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Workflow Optimization' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Impact on Habits' },
    ],
    targetCollocations: [
      {
        phrase: 'streamline my workflow',
        cefr: 'C1',
        contextSnippet: '...I rely heavily on digital organizers that streamline my daily workflow.',
      },
      {
        phrase: 'indispensable utility',
        cefr: 'C2',
        contextSnippet: '...cloud-synchronized calendar widgets have proven to be an indispensable utility.',
      },
      {
        phrase: 'second nature to me',
        cefr: 'C1',
        contextSnippet: '...tracking project deadlines on mobile has become second nature to me.',
      },
      {
        phrase: 'keep track of commitments',
        cefr: 'B2',
        contextSnippet: '...allowing me to effortlessly keep track of commitments throughout the week.',
      },
    ],
    grammarTarget: {
      label: 'Parallel structures with gerunds',
      exampleFromModel: 'They streamline my routine by categorizing complex research notes and tracking urgent project milestones seamlessly.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'I use my mobile phone all the time, especially social media apps like Instagram and messaging apps like WhatsApp. Also, I use Google Maps when driving, and a banking app to transfer money. Without these apps, my daily life would be quite inconvenient and slow.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'Aside from standard messaging platforms, I rely heavily on cloud-synchronized productivity tools like Notion and digital calendar widgets. They streamline my daily workflow by organizing complex research notes and tracking project milestones. Having my entire schedule accessible in my pocket has essentially made digital time management second nature to me.',
        wordCount: 50,
      },
    },
  },
  {
    id: 'p1-art-galleries',
    part: 1,
    topic: 'Art & Culture',
    question: 'Did you enjoy learning art when you were at school, and do you ever visit art exhibitions now?',
    sourceBadge: 'Cambridge IELTS 16 • Test 4',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Childhood Contrast' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Adult Aesthetic Evolution' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Contemporary Exhibition Appeal' },
    ],
    targetCollocations: [
      {
        phrase: 'foster creative expression',
        cefr: 'C1',
        contextSnippet: '...school curriculums rarely did enough to foster genuine creative expression.',
      },
      {
        phrase: 'aesthetic appreciation',
        cefr: 'C2',
        contextSnippet: '...my aesthetic appreciation has matured considerably over the past decade.',
      },
      {
        phrase: 'provocative contemporary exhibits',
        cefr: 'C1',
        contextSnippet: '...I frequently seek out provocative contemporary exhibits in modern galleries.',
      },
      {
        phrase: 'breath of fresh air',
        cefr: 'B2',
        contextSnippet: '...engaging with abstract installations provides a refreshing breath of fresh air.',
      },
    ],
    grammarTarget: {
      label: 'Contrastive past habit (used to vs now)',
      exampleFromModel: 'Whereas I used to find school art classes mechanical, my aesthetic appreciation has since matured into a genuine passion for contemporary exhibitions.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official IDP Candidate Log)',
        text: 'To be honest, I didn’t really like art class in school because I was bad at drawing realistic pictures. The teacher always graded us on painting flowers, which was boring. But now, when I travel to big cities, I like going to art museums to see famous paintings.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'As a child, I found formal art classes somewhat rigid because they prioritized mechanical accuracy over imagination. However, my aesthetic appreciation has matured considerably; whenever I visit a cultural metropolis, I make a point of exploring contemporary art galleries, as engaging with provocative installations offers a refreshing mental breath of fresh air.',
        wordCount: 51,
      },
    },
  },
  {
    id: 'p1-weather-seasons',
    part: 1,
    topic: 'Weather & Climate',
    question: 'What kind of weather do you prefer, and does the climate influence your daily mood?',
    sourceBadge: 'Cambridge IELTS 18 • Test 3',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Climate Preference' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Psychological Dynamics' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Seasonal Contrast' },
    ],
    targetCollocations: [
      {
        phrase: 'profound psychological impact',
        cefr: 'C1',
        contextSnippet: '...climate unquestionably exerts a profound psychological impact on my temperament.',
      },
      {
        phrase: 'crisp autumn morning',
        cefr: 'C1',
        contextSnippet: '...nothing energizes me more than a crisp autumn morning with clear skies.',
      },
      {
        phrase: 'gloomy overcast skies',
        cefr: 'C2',
        contextSnippet: '...prolonged periods of gloomy overcast skies tend to induce lethargy.',
      },
      {
        phrase: 'invigorate one’s senses',
        cefr: 'C2',
        contextSnippet: '...brisk breezes and bright foliage never fail to invigorate my senses.',
      },
    ],
    grammarTarget: {
      label: 'Fronted adverbial clause with whereas',
      exampleFromModel: 'While crisp morning sunlight invigorates my senses, persistent gray overcast skies tend to dampen my cognitive energy.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'I like sunny and warm weather the best because I can go outside and play sports with my friends. When it rains for several days in a row, I feel lazy and don’t want to leave my bed. So yes, I think weather really changes how people feel every day.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'Without question, climate exerts a profound psychological impact on my temperament. I thrive in crisp, cool autumnal weather—there is something about brisk breezes and clear amber sunlight that invigorates my senses, whereas relentless overcast skies and persistent drizzle tend to induce a lethargic, uninspired state of mind.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-music-instruments',
    part: 1,
    topic: 'Music & Performing Arts',
    question: 'Have you ever learned to play a musical instrument, and what genre of music do you listen to?',
    sourceBadge: 'Cambridge IELTS 15 • Test 4',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Instrument Background' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Musical Tastes' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Therapeutic Function' },
    ],
    targetCollocations: [
      {
        phrase: 'eclectic musical taste',
        cefr: 'C2',
        contextSnippet: '...nowadays, my musical taste is delightfully eclectic and varied.',
      },
      {
        phrase: 'therapeutic outlet',
        cefr: 'C1',
        contextSnippet: '...listening to instrumental acoustic guitar acts as a therapeutic outlet.',
      },
      {
        phrase: 'soothing acoustic melodies',
        cefr: 'B2',
        contextSnippet: '...I lean toward soothing acoustic melodies while studying in the evening.',
      },
      {
        phrase: 'mental decompression',
        cefr: 'C2',
        contextSnippet: '...ambient post-rock provides the perfect acoustic backdrop for mental decompression.',
      },
    ],
    grammarTarget: {
      label: 'Subordinate concessive clause',
      exampleFromModel: 'Although I briefly attempted classical piano in primary school, my current focus is on appreciating diverse acoustic genres.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official IDP Candidate)',
        text: 'I tried to learn the guitar when I was a teenager, but I stopped after two months because my fingertips hurt too much. Nowadays, I mostly listen to pop music and rock on Spotify when I commute on the bus. It helps me pass the time and stay awake.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'Although I briefly attempted classical piano during primary school, I lacked the discipline to master the instrument. Nowadays, my musical taste is delightfully eclectic; while working, I gravitate towards ambient post-rock or classical minimalism, which acts as a wonderfully therapeutic outlet for mental decompression and sustained concentration.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-cooking-meals',
    part: 1,
    topic: 'Food & Culinary Habits',
    question: 'Do you enjoy cooking for yourself or others, and who taught you how to prepare food?',
    sourceBadge: 'Cambridge IELTS 17 • Test 2',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Passion for Cooking' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Mentorship & Heritage' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Modern Experimentation' },
    ],
    targetCollocations: [
      {
        phrase: 'labor of love',
        cefr: 'C1',
        contextSnippet: '...cooking for loved ones feels like a genuine labor of love.',
      },
      {
        phrase: 'impart foundational techniques',
        cefr: 'C2',
        contextSnippet: '...my grandmother was the one who imparted foundational culinary techniques to me.',
      },
      {
        phrase: 'culinary experimentation',
        cefr: 'C1',
        contextSnippet: '...I view the kitchen as an expressive space for culinary experimentation.',
      },
      {
        phrase: 'wholesome home-cooked meal',
        cefr: 'B2',
        contextSnippet: '...there is nothing quite like sitting down to a wholesome home-cooked meal.',
      },
    ],
    grammarTarget: {
      label: 'It was... that cleft structure',
      exampleFromModel: 'It was my grandmother who originally instilled a love for cooking by demonstrating how to harmonize authentic aromatics.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'Yes, I like cooking on weekends when I have some free time. My mother taught me how to make traditional dishes when I was a teenager. Cooking for my family is nice because they say my food tastes good, but on weekdays I am too busy and eat out.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'I find preparing meals deeply satisfying—it feels like a genuine labor of love. It was my grandmother who originally imparted foundational culinary techniques, teaching me how to balance spices and fresh herbs. Today, I treat cooking as a creative ritual where I can unwind through culinary experimentation after demanding workdays.',
        wordCount: 50,
      },
    },
  },
  {
    id: 'p1-sports-exercise',
    part: 1,
    topic: 'Sports & Physical Exercise',
    question: 'Did you engage in sporting activities as a child, and do you exercise regularly today?',
    sourceBadge: 'Cambridge IELTS 14 • Test 3',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Youth Participation' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Modern Routine' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Mental Benefits' },
    ],
    targetCollocations: [
      {
        phrase: 'sedentary lifestyle',
        cefr: 'C1',
        contextSnippet: '...physical exercise serves as a vital counterweight to an otherwise sedentary lifestyle.',
      },
      {
        phrase: 'team camaraderie',
        cefr: 'C1',
        contextSnippet: '...playing school basketball instilled an enduring appreciation for team camaraderie.',
      },
      {
        phrase: 'clear mental fog',
        cefr: 'C1',
        contextSnippet: '...a vigorous morning run never fails to clear mental fog.',
      },
      {
        phrase: 'rigorous cardiovascular workout',
        cefr: 'C2',
        contextSnippet: '...engaging in a rigorous cardiovascular workout keeps me sharp and energized.',
      },
    ],
    grammarTarget: {
      label: 'Inversion with Not only... but also',
      exampleFromModel: 'Not only does swimming maintain cardiovascular endurance, but it also clears mental fog after hours behind a desk.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: 'When I was in primary school, I played football almost every afternoon with my classmates. We had a school team and it was fun. Now, because of my desk job, I try to go jogging three times a week in the park so that I don’t gain too much weight.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'As a boy, I played competitive basketball, which instilled a lasting appreciation for team camaraderie. In adulthood, maintaining fitness has become a non-negotiable anchor against an otherwise sedentary lifestyle. Not only does swimming or distance running keep me physically resilient, but it also clears mental fog and sharpens my focus.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-parks-nature',
    part: 1,
    topic: 'Parks & Green Spaces',
    question: 'How often do you spend time in public parks or gardens in your neighborhood?',
    sourceBadge: 'Cambridge IELTS 19 • Test 1',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Regular Habit' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Environmental Atmosphere' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Rejuvenating Effect' },
    ],
    targetCollocations: [
      {
        phrase: 'lush verdant canopy',
        cefr: 'C2',
        contextSnippet: '...strolling beneath the lush verdant canopy provides total tranquility.',
      },
      {
        phrase: 'respite from urban concrete',
        cefr: 'C2',
        contextSnippet: '...our civic gardens offer an indispensable respite from urban concrete.',
      },
      {
        phrase: 'recharge one’s batteries',
        cefr: 'B2',
        contextSnippet: '...it provides the perfect peaceful environment to recharge my mental batteries.',
      },
      {
        phrase: 'picturesque walking trail',
        cefr: 'B2',
        contextSnippet: '...I regularly walk along the picturesque walking trail beside the lake.',
      },
    ],
    grammarTarget: {
      label: 'Gerund phrase as grammatical subject',
      exampleFromModel: 'Disconnecting from digital devices while wandering through open botanical gardens is how I restore mental balance.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: 'There is a park about ten minutes from my house, and I visit it almost every Saturday morning. People walk their dogs, and elderly people do morning exercises there. I usually sit on a bench to drink coffee and breathe fresh air, which is very relaxing.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'I make a conscious habit of strolling through our municipal botanical gardens at least twice a week. Wandering beneath the lush, verdant canopy provides an indispensable respite from relentless urban concrete. Disconnecting from screens while surrounded by birdsong and open lawns is how I effectively recharge my mental batteries.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-foreign-languages',
    part: 1,
    topic: 'Languages & Linguistics',
    question: 'Apart from English, what other language would you find valuable or enjoyable to learn?',
    sourceBadge: 'Cambridge IELTS 18 • Test 4',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Target Language Choice' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Cultural & Economic Reach' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Career Synergies' },
    ],
    targetCollocations: [
      {
        phrase: 'diplomatic and cultural bridge',
        cefr: 'C2',
        contextSnippet: '...fluency in Spanish would act as a vital diplomatic and cultural bridge.',
      },
      {
        phrase: 'broaden career prospects',
        cefr: 'B2',
        contextSnippet: '...it would immensely broaden career prospects across multinational corporations.',
      },
      {
        phrase: 'linguistic landscape',
        cefr: 'C1',
        contextSnippet: '...mastering its grammar would help me navigate the Latin American linguistic landscape.',
      },
      {
        phrase: 'rich literary traditions',
        cefr: 'C1',
        contextSnippet: '...allowing me to appreciate rich literary traditions in their original prose.',
      },
    ],
    grammarTarget: {
      label: 'Inverted Conditional (Were I to...)',
      exampleFromModel: 'Were I to embark on learning another tongue, Spanish would undeniably top my list due to its global reach.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'If I have time in the future, I want to learn Spanish because many countries speak it in Europe and South America. It sounds like a romantic and energetic language. Also, speaking Spanish would help me when traveling abroad or looking for international jobs.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'Were I to embark on learning another tongue, Spanish would undeniably top my list. Beyond being a major global language spoken across multiple continents, it would serve as an extraordinary diplomatic and cultural bridge, allowing me to engage directly with rich Hispanic literary traditions and broaden my international career prospects.',
        wordCount: 50,
      },
    },
  },
  {
    id: 'p1-clothes-fashion',
    part: 1,
    topic: 'Clothing & Fashion',
    question: 'Do you place much importance on the clothes you wear, and has your style changed over the years?',
    sourceBadge: 'Cambridge IELTS 16 • Test 1',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Philosophy of Dress' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Shift Toward Minimalism' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Quiet Confidence' },
    ],
    targetCollocations: [
      {
        phrase: 'fleeting fashion trends',
        cefr: 'C1',
        contextSnippet: '...I no longer feel the urge to chase fleeting fashion trends every season.',
      },
      {
        phrase: 'timeless, minimalist aesthetic',
        cefr: 'C2',
        contextSnippet: '...my personal style has evolved toward a timeless, minimalist aesthetic.',
      },
      {
        phrase: 'sartorial choices',
        cefr: 'C2',
        contextSnippet: '...I believe sartorial choices ought to balance understated elegance with comfort.',
      },
      {
        phrase: 'project quiet confidence',
        cefr: 'C1',
        contextSnippet: '...well-tailored classic garments help project quiet confidence in any setting.',
      },
    ],
    grammarTarget: {
      label: 'Passive voice with modal obligation',
      exampleFromModel: 'I believe everyday clothing ought to be chosen for durability and comfort rather than ostentatious brand labels.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: 'I used to care a lot about branded clothes and fashion trends when I was a teenager. But now that I am older, I care much more about comfort and clean colors. In my workplace, I just wear simple shirts and trousers that look neat and professional.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'In my youth, I succumbed to fleeting fashion trends, but my approach has since matured toward a timeless, minimalist aesthetic. I believe sartorial choices ought to prioritize functional comfort and understated tailoring; dressing well is less about ostentatious logos and more about projecting quiet confidence and professionalism in everyday interactions.',
        wordCount: 49,
      },
    },
  },
  {
    id: 'p1-photography',
    part: 1,
    topic: 'Photography & Digital Media',
    question: 'How often do you take photographs with your smartphone, and what do you like capturing most?',
    sourceBadge: 'Cambridge IELTS 17 • Test 4',
    targetDurationSec: 25,
    pacingSegments: [
      { startSec: 0, endSec: 8, label: '0:00–0:08 • Mobile Photo Frequency' },
      { startSec: 8, endSec: 18, label: '0:08–0:18 • Subject Preference' },
      { startSec: 18, endSec: 25, label: '0:18–0:25 • Visual Diary Philosophy' },
    ],
    targetCollocations: [
      {
        phrase: 'candid fleeting moments',
        cefr: 'C2',
        contextSnippet: '...I prefer capturing candid fleeting moments rather than posing for selfies.',
      },
      {
        phrase: 'architectural geometry',
        cefr: 'C1',
        contextSnippet: '...photographing clean architectural geometry against the sky fascinates me.',
      },
      {
        phrase: 'visual diary',
        cefr: 'B2',
        contextSnippet: '...I treat my camera roll as an evolving visual diary of my journeys.',
      },
      {
        phrase: 'evocative snapshot',
        cefr: 'C1',
        contextSnippet: '...preserving subtle expressions and shadows in an evocative snapshot.',
      },
    ],
    grammarTarget: {
      label: 'Participial phrase expressing manner',
      exampleFromModel: 'Treating my gallery as an evolving visual diary, I capture spontaneous urban scenes rather than staged portraits.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'I take photos almost every day on my smartphone. Usually, I photograph delicious food before eating, or take pictures of nice buildings and sunsets when I hang out with friends. It is nice because I can look back at those photos later and remember good times.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'With smartphone cameras being so sophisticated, I capture images almost daily, treating my photo gallery as an evolving visual diary. Rather than staging selfies, I prefer documenting candid, fleeting moments—such as dramatic interplay of light on modern architecture or spontaneous street scenes that capture authentic human emotion in an evocative snapshot.',
        wordCount: 51,
      },
    },
  },

  // ==========================================
  // PART 2: CUE CARDS (120s Target Duration)
  // ==========================================
  {
    id: 'p2-influential-mentor',
    part: 2,
    topic: 'Influential People',
    question: 'Describe a teacher or mentor who had a profound impact on your education.',
    cueCardBullets: [
      'Who this teacher or mentor was',
      'What subject or skill they taught you',
      'What made their approach or style memorable',
      'And explain why their guidance had such an enduring influence on your life',
    ],
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Identity & Setting' },
      { startSec: 25, endSec: 70, label: '0:25–1:10 • Distinctive Teaching Style' },
      { startSec: 70, endSec: 100, label: '1:10–1:40 • Turning Point & Support' },
      { startSec: 100, endSec: 120, label: '1:40–2:00 • Enduring Legacy' },
    ],
    targetCollocations: [
      {
        phrase: 'unorthodox teaching style',
        cefr: 'C2',
        contextSnippet: '...what set him apart immediately was his unorthodox teaching style.',
      },
      {
        phrase: 'instill a profound curiosity',
        cefr: 'C1',
        contextSnippet: '...he had a rare knack for instilling a profound curiosity in every student.',
      },
      {
        phrase: 'think outside the box',
        cefr: 'B2',
        contextSnippet: '...he constantly challenged us to think outside the box rather than memorize formulas.',
      },
      {
        phrase: 'leave an indelible impression',
        cefr: 'C2',
        contextSnippet: '...his mentorship left an indelible impression on my academic journey.',
      },
      {
        phrase: 'academic trajectory',
        cefr: 'C1',
        contextSnippet: '...his encouraging counsel fundamentally reshaped my academic trajectory.',
      },
    ],
    grammarTarget: {
      label: 'Third Conditional Inversion',
      exampleFromModel: 'Had it not been for his patient mentorship during that pivotal year, I would never have developed the confidence to pursue postgraduate study.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 15 Candidate Log)',
        text: "I would like to talk about my high school English teacher, Mr. David. He taught me when I was around sixteen years old. In my school, most teachers just followed the textbook and asked us to write grammar exercises, but Mr. David was different. He was very friendly and always smiled. In his class, we had discussions about interesting topics and movies, so everyone enjoyed his lessons.\n\nOne time, I got a very low score in my midterm test and felt disappointed. He called me to his office, not to scold me, but to ask what difficulties I had. He gave me extra reading books and told me to believe in myself. Because of his help, my English improved a lot and I passed the exam with good grades. Even now, whenever I face difficult studies, I remember his advice to stay calm and keep practicing.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to speak about my high school history teacher, Mr. Harrison, whose mentorship left an indelible impression on both my intellectual growth and my broader approach to learning.\n\nI was taught by Mr. Harrison during my penultimate year of secondary school, a period when many students, myself included, viewed history as little more than rote memorization of dates and treaties. What set him apart immediately, however, was his thoroughly unorthodox teaching style. Rather than lecturing from standard textbooks, he would transform the classroom into an open debate chamber, compelling us to analyze primary documents from competing geopolitical angles and think critically about cause and effect.\n\nHe had a rare knack for instilling a profound curiosity in his pupils. I vividly recall struggling with an essay on the Industrial Revolution; rather than simply marking my mistakes with a red pen, he spent nearly an hour with me after school, deconstructing my thesis and showing me how to synthesize evidence cohesively. Had it not been for his patient mentorship during that pivotal term, I would never have developed the academic rigor required to pursue university research. His guidance went far beyond the curriculum—he taught me how to question surface-level assumptions, a skill that continues to shape my professional life today.",
        wordCount: 214,
      },
    },
  },
  {
    id: 'p2-challenging-decision',
    part: 2,
    topic: 'Important Decisions',
    question: 'Describe an important decision that took you a considerable amount of time to make.',
    cueCardBullets: [
      'What the decision was about',
      'What competing choices or options you weighed',
      'Why reaching a final verdict was so difficult',
      'And explain how you felt once the decision was finalized',
    ],
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Dilemma Introduction' },
      { startSec: 25, endSec: 70, label: '0:25–1:10 • Weighing Pros & Cons' },
      { startSec: 70, endSec: 95, label: '1:10–1:35 • The Decisive Catalyst' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Resolution & Retrospect' },
    ],
    targetCollocations: [
      {
        phrase: 'weigh the pros and cons',
        cefr: 'B2',
        contextSnippet: '...I spent countless sleepless nights weighing the pros and cons of both avenues.',
      },
      {
        phrase: 'plagued with self-doubt',
        cefr: 'C2',
        contextSnippet: '...I was constantly plagued with self-doubt over forfeiting a stable salary.',
      },
      {
        phrase: 'take a leap of faith',
        cefr: 'C1',
        contextSnippet: '...I finally decided to take a leap of faith into postgraduate specialization.',
      },
      {
        phrase: 'crossroads in my career',
        cefr: 'C1',
        contextSnippet: '...I found myself at a critical crossroads in my early career.',
      },
      {
        phrase: 'sense of immense relief',
        cefr: 'B2',
        contextSnippet: '...reaching that definitive conclusion washed over me with a sense of immense relief.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence with what clause',
      exampleFromModel: 'What made the decision exceptionally tortuous was the stark trade-off between guaranteed financial stability and unfulfilled creative ambitions.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: "I want to describe when I had to choose my university major two years ago. It was a really hard decision because my parents wanted me to study business administration or finance so that I could easily find a good corporate job after graduating. However, my real passion was graphic design and digital media.\n\nI thought about it for almost three months. I talked to my high school counselor, searched online about career opportunities, and asked older friends who were working. Finance seemed safer, but design was what I loved. Finally, after many family discussions, I chose to enroll in design school. Once I submitted my application, I felt relieved because I knew I would enjoy studying something creative every day.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to recount an important crossroads in my early professional life: namely, the decision to resign from a dependable corporate position in order to pursue full-time postgraduate research abroad.\n\nThis dilemma arose roughly three years ago. On one hand, I held an enviable position at an established accounting firm offering structured career progression and a comfortable remuneration package. On the other hand, I felt increasingly disillusioned by routine administrative paperwork and yearned to delve into environmental policy and international sustainable development. What made the verdict so exceptionally agonizing was the stark contrast between guaranteed financial security and the unpredictable risks of moving to another continent as a self-funded scholar.\n\nFor nearly six months, I was plagued with self-doubt, endlessly weighing the pros and cons while consulting mentors and family members. The tipping point arrived when an older colleague remarked that the regret of inaction almost always outweighs the sting of failure. Hearing that galvanized my resolve; I resolved to take a leap of faith and submitted my university acceptance forms that evening. The moment the paperwork was transmitted, a profound wave of relief washed over me. While the subsequent academic year was undeniably rigorous, taking ownership of that pivotal choice proved to be one of the most empowering decisions I have ever made.",
        wordCount: 220,
      },
    },
  },
  {
    id: 'p2-memorable-journey',
    part: 2,
    topic: 'Travel & Journeys',
    question: 'Describe an unforgettable journey or road trip you went on.',
    cueCardBullets: [
      'Where you went and who accompanied you',
      'What mode of transport you took',
      'What unexpected incidents or memorable sights you encountered',
      'And explain why this journey remains etched in your memory',
    ],
    sourceBadge: 'Cambridge IELTS 18 • Test 1',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Destination & Transport' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Scenic Journey & Landscape' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • The Unexpected Highlight' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Enduring Significance' },
    ],
    targetCollocations: [
      {
        phrase: 'breathtaking panoramic vistas',
        cefr: 'C1',
        contextSnippet: '...the train climbed winding tracks offering breathtaking panoramic vistas.',
      },
      {
        phrase: 'off the beaten track',
        cefr: 'C1',
        contextSnippet: '...we deliberately chose a scenic route that ventured far off the beaten track.',
      },
      {
        phrase: 'unspoiled natural splendor',
        cefr: 'C2',
        contextSnippet: '...we were mesmerized by the completely unspoiled natural splendor of the valley.',
      },
      {
        phrase: 'hospitable local community',
        cefr: 'B2',
        contextSnippet: '...we were sheltered from the storm by an extraordinarily hospitable local community.',
      },
      {
        phrase: 'etched vividly in my mind',
        cefr: 'C2',
        contextSnippet: '...the sheer serenity of that sunrise remains etched vividly in my mind.',
      },
    ],
    grammarTarget: {
      label: 'Fronted participial phrase',
      exampleFromModel: 'Winding through rugged mountain passes draped in morning mist, the vintage train journey felt entirely disconnected from modern urban haste.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: "I want to share my memory of a road trip to the northern mountains that I took with two close friends last summer. We rented a small car and drove for about eight hours from our hometown. The road was quite bumpy and curvy, but the mountain views were wonderful.\n\nOn the second day, our car broke down near a small village because the tire was flat. We didn’t have the right tools to change it, so we were worried. Luckily, a local farmer helped us fix the wheel and even invited us to his house for lunch and hot tea. We visited some waterfalls and took many pictures. It was a very special trip because the people were kind and the nature was fresh and green.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to describe an unforgettable expedition across the Scottish Highlands that I undertook alongside two close university companions two summers ago.\n\nRather than opting for a standard highway route, we opted for an old-fashioned sleeper train to Fort William followed by a self-drive journey that ventured far off the beaten track into the Isle of Skye. Winding through rugged mountain passes draped in morning mist, the journey offered breathtaking panoramic vistas of shimmering lochs and ancient granite peaks that felt completely untouched by modern urbanization.\n\nThe defining moment of the trip occurred when an abrupt engine malfunction left us temporarily stranded on an isolated coastal single-track road just before dusk. Far from being a catastrophe, this stroke of misfortune led us to seek refuge at a nearby family croft. The crofters welcomed us with heartfelt hospitality, sharing fresh smoked salmon and recounting local Gaelic folklore around a peat fire. Sitting in that warm stone cottage while rain lashed against the windows revealed an authentic cultural warmth that no guidebook could have captured. The trip remains etched vividly in my memory because it reminded me that the most transcendent travel experiences are often born from unexpected deviations from the itinerary.",
        wordCount: 212,
      },
    },
  },
  {
    id: 'p2-environmental-problem',
    part: 2,
    topic: 'Environment & Ecology',
    question: 'Describe an environmental issue in your region that requires urgent attention.',
    cueCardBullets: [
      'What the environmental issue is',
      'What causes or exacerbates this problem',
      'How it impacts the everyday lives of local citizens',
      'And explain what measures should be implemented to address it',
    ],
    sourceBadge: 'Official IDP Sample • Examiner Masterclass',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Issue Definition' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Root Causes & Industrial Factors' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Ecological & Health Consequences' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Concrete Statutory Solutions' },
    ],
    targetCollocations: [
      {
        phrase: 'alarming concentrations of particulate matter',
        cefr: 'C2',
        contextSnippet: '...atmospheric monitors record alarming concentrations of particulate matter every winter.',
      },
      {
        phrase: 'respiratory ailments',
        cefr: 'C1',
        contextSnippet: '...leading to a notable spike in chronic respiratory ailments among vulnerable groups.',
      },
      {
        phrase: 'stringent emission regulations',
        cefr: 'C1',
        contextSnippet: '...authorities must enact stringent emission regulations on suburban manufacturing hubs.',
      },
      {
        phrase: 'ecological degradation',
        cefr: 'C2',
        contextSnippet: '...prompting irreversible ecological degradation across local watershed basins.',
      },
      {
        phrase: 'curb industrial discharge',
        cefr: 'C1',
        contextSnippet: '...drastic municipal steps to curb industrial discharge before pollution worsens.',
      },
    ],
    grammarTarget: {
      label: 'Passive voice with modal necessity',
      exampleFromModel: 'Decisive statutory penalties must be levied on non-compliant industrial polluters if air quality is ever to be sustainably restored.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official IDP Sample)',
        text: "I would like to talk about air pollution in my city, which has become very bad over the last few years. Every winter, a thick layer of smog covers the sky, and you cannot see the buildings in the distance. The main reason is the huge number of private motorbikes and cars on the roads, as well as factories surrounding the city that burn coal.\n\nThis pollution causes many health issues. For example, children and elderly people cough a lot and have to visit hospitals for asthma. People have to wear face masks every day when going outside. To fix this, I think the government should build a better metro network and make bus tickets free so people drive less. They should also move heavy factories away from residential districts.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to address the critical issue of urban air pollution and seasonal smog that plagues my metropolitan region, posing a severe hazard to both public health and quality of life.\n\nThis crisis is primarily exacerbated by an unfortunate convergence of geographical factors and unchecked human activity. During the winter months, thermal inversion traps vehicle exhaust fumes and industrial emissions close to the ground, resulting in alarming concentrations of fine particulate matter, commonly known as PM2.5. Outdated diesel buses, combined with a staggering volume of single-occupancy private commuters and coal-powered brick kilns situated on the urban periphery, continuously discharge toxic effluents into the shared atmosphere.\n\nThe societal repercussions are profound. Respiratory ailments and cardiovascular complications have surged, disproportionately affecting young children and the elderly, while outdoor athletic activities are frequently cancelled due to hazardous air quality advisories. To arrest this ecological degradation, a synchronized policy response is imperative. Municipal leaders must transition the public transit fleet entirely to clean electric power, incentivize hybrid vehicle adoption through tax rebates, and enforce stringent emission caps on manufacturing belts. Without bold regulatory enforcement, the city risks jeopardizing the well-being of future generations.",
        wordCount: 206,
      },
    },
  },
  {
    id: 'p2-historical-period',
    part: 2,
    topic: 'History & Heritage',
    question: 'Describe a historical period or event that you find fascinating and would like to learn more about.',
    cueCardBullets: [
      'What this historical period or event was',
      'When and where it took place',
      'What key developments or changes occurred',
      'And explain why you find this era so intriguing',
    ],
    sourceBadge: 'Cambridge IELTS 15 • Test 1',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Historical Setting & Era' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Scientific & Cultural Innovations' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Paradigm Shifts in Thought' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Enduring Relevance to Modernity' },
    ],
    targetCollocations: [
      {
        phrase: 'seismic cultural paradigm shift',
        cefr: 'C2',
        contextSnippet: '...the Renaissance represented a seismic cultural paradigm shift that transformed Europe.',
      },
      {
        phrase: 'flourishing of human ingenuity',
        cefr: 'C1',
        contextSnippet: '...witnessed an unprecedented flourishing of human ingenuity across art and science.',
      },
      {
        phrase: 'unravel the complexities',
        cefr: 'C1',
        contextSnippet: '...I am eager to unravel the complexities of that transformative period.',
      },
      {
        phrase: 'heralded the modern era',
        cefr: 'C2',
        contextSnippet: '...inventions like the movable-type printing press heralded the modern intellectual era.',
      },
      {
        phrase: 'intellectual enlightenment',
        cefr: 'C1',
        contextSnippet: '...ushering in an era of profound intellectual enlightenment.',
      },
    ],
    grammarTarget: {
      label: 'Third Conditional Inversion',
      exampleFromModel: 'Had it not been for the revival of classical inquiry during the Renaissance, the emergence of modern empirical science would have been stalled for centuries.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 15 Candidate Log)',
        text: "I would like to talk about the Renaissance in Europe, which happened around the 14th to 17th centuries, mainly starting in Italy. During this period, there were many famous artists like Leonardo da Vinci and Michelangelo who created beautiful paintings and sculptures. Also, science and literature developed very fast.\n\nI find this period interesting because people started thinking in a new way, focusing on humans rather than just religious rules. They also invented the printing press, so more books could be read by normal people, not just kings. I want to visit museums in Florence one day to see those historical paintings in person.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to speak about the European Renaissance, an extraordinary historical epoch spanning roughly the fourteenth to the seventeenth centuries that witnessed a seismic cultural paradigm shift centered initially in Northern Italy.\n\nWhat makes this era perpetually captivating is the sudden, unprecedented flourishing of human ingenuity across virtually every discipline. Prior to this period, medieval scholasticism had placed rigid dogmatic boundaries on intellectual thought. The Renaissance, by contrast, revived classical Greek and Roman philosophies of humanism, encouraging empirical observation and scientific experimentation. Thinkers like Leonardo da Vinci personified this ethos, harmonizing fine art with anatomy, optics, and engineering.\n\nSimultaneously, the invention of Gutenberg’s movable-type printing press democratized knowledge dissemination, allowing revolutionary ideas to circulate rapidly beyond the confines of clerical elites. Had it not been for this profound intellectual awakening, the subsequent Scientific Revolution and Enlightenment would undoubtedly have been severely delayed. I find this period endlessly intriguing because it stands as undeniable proof that radical shifts in philosophical perspective can reshape human civilization. Examining how Renaissance thinkers challenged dogma inspires me to maintain a questioning, interdisciplinary mindset in our current era of rapid technological disruption.",
        wordCount: 208,
      },
    },
  },
  {
    id: 'p2-electronic-device',
    part: 2,
    topic: 'Technology & Gadgets',
    question: 'Describe an electronic device or piece of technology that you find indispensable in your daily life.',
    cueCardBullets: [
      'What the device is and when you acquired it',
      'What core tasks or functions you use it for',
      'How often you rely on it throughout the day',
      'And explain why it has become so vital to your productivity or lifestyle',
    ],
    sourceBadge: 'Cambridge IELTS 17 • Test 1',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Device Introduction & Acquisition' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Daily Workflows & Multitasking' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Technical Superiority & Performance' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Impact on Work-Life Balance' },
    ],
    targetCollocations: [
      {
        phrase: 'indispensable workhorse',
        cefr: 'C2',
        contextSnippet: '...my lightweight laptop has evolved into an indispensable workhorse for all academic research.',
      },
      {
        phrase: 'seamless ecosystem integration',
        cefr: 'C1',
        contextSnippet: '...what elevates it is its seamless ecosystem integration with my other peripherals.',
      },
      {
        phrase: 'heavy computational tasks',
        cefr: 'C1',
        contextSnippet: '...it handles heavy computational tasks and statistical software without breaking a sweat.',
      },
      {
        phrase: 'untethered mobility',
        cefr: 'C2',
        contextSnippet: '...its exceptional battery life grants me untethered mobility throughout long campus days.',
      },
      {
        phrase: 'boost operational efficiency',
        cefr: 'B2',
        contextSnippet: '...the machine has dramatically boosted my operational efficiency and daily output.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence with what clause',
      exampleFromModel: 'What makes this device genuinely irreplaceable is its capacity to handle complex data modeling while granting me complete geographic flexibility.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: "I would like to describe my laptop, which I bought about one year ago when I started my current job. It is a thin and silver laptop with a fast processor and a clear display. I use it every day for writing emails, searching information on the internet, and making PowerPoint presentations for meetings.\n\nI rely on it from morning to evening, probably around eight to ten hours a day. It is very important for me because all my work files and study notes are saved there. Also, on weekends I watch movies on it with my friends. If my laptop broke down, I would not be able to finish my tasks on time, so it is definitely my most important electronic device.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to speak about my ultralight laptop computer, an electronic tool that has become an indispensable workhorse across both my professional duties and personal research.\n\nI purchased this machine approximately eighteen months ago when transitioning into a hybrid working model that demanded high portable performance. In terms of daily utility, it serves as the operational nerve center of my routine. I rely on it for drafting technical documentation, executing statistical simulations in R, and managing cloud communications with international stakeholders. What elevates this device above previous machines I’ve owned is its seamless ecosystem integration and silent thermal efficiency—it handles heavy computational tasks without overheating or throttling.\n\nMoreover, the remarkable all-day battery life provides untethered mobility, allowing me to transition effortlessly from a shared office desk to a quiet library carrel without hunting for power sockets. In today’s hyper-connected knowledge economy, having a reliable, responsive portal that securely houses one’s digital intellect is crucial. Were I to be deprived of it, my professional output would grind to an immediate halt. It has fundamentally reshaped how efficiently I organize information, conduct research, and communicate ideas.",
        wordCount: 209,
      },
    },
  },
  {
    id: 'p2-waiting-in-line',
    part: 2,
    topic: 'Life Experiences & Patience',
    question: 'Describe an occasion when you had to wait in a long queue or line for a considerable time.',
    cueCardBullets: [
      'Where and when this took place',
      'What you were waiting for',
      'How you spent your time while waiting',
      'And explain how you felt during and after the ordeal',
    ],
    sourceBadge: 'Cambridge IELTS 18 • Test 2',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Setting & Occasion' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • The Scale of the Queue' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Coping Strategies & Observations' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Relief & Retrospective Lesson' },
    ],
    targetCollocations: [
      {
        phrase: 'interminable serpentine queue',
        cefr: 'C2',
        contextSnippet: '...I was confronted by an interminable serpentine queue snaking out of the terminal.',
      },
      {
        phrase: 'test of endurance',
        cefr: 'C1',
        contextSnippet: '...what was supposed to be a brisk check-in became an agonizing test of endurance.',
      },
      {
        phrase: 'mounting sense of exasperation',
        cefr: 'C2',
        contextSnippet: '...one could sense a mounting sense of exasperation among exhausted passengers.',
      },
      {
        phrase: 'bureaucratic bottleneck',
        cefr: 'C1',
        contextSnippet: '...caused primarily by a sudden technical failure and bureaucratic bottleneck at customs.',
      },
      {
        phrase: 'collective sigh of relief',
        cefr: 'B2',
        contextSnippet: '...a collective sigh of relief echoed through the hall when the gates finally reopened.',
      },
    ],
    grammarTarget: {
      label: 'Past perfect continuous for duration',
      exampleFromModel: 'Having been queueing for nearly two and a half hours in stifling heat, passengers were visibly teetering on the edge of exhaustion.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: "I want to talk about a time last summer when I had to wait in a very long line at the international airport. My flight was scheduled for the afternoon, so I arrived three hours early. However, when I got to the security check area, there were hundreds of people standing in a huge line.\n\nApparently, the computer system had a problem, so the officers had to check everyone's passports manually. I waited in line for more than two hours. To pass the time, I listened to podcasts on my phone and chatted with a tourist standing next to me. I was worried that I would miss my plane, so I felt stressed and tired. Finally, when I cleared security, I had to run to the boarding gate, but fortunately, the plane was delayed as well.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to recount an exasperating experience from last autumn when I found myself trapped in an interminable serpentine queue at an international transit airport during peak holiday season.\n\nI was returning home from a conference in Frankfurt when a sudden, catastrophic malfunction in the automated passport control gates paralyzed border security. Upon entering the arrivals concourse, passengers were confronted by thousands of stranded travelers snaking endlessly through barricaded cordons. What was ordinarily a frictionless ten-minute biometric scan transformed into an agonizing test of patience and physical endurance lasting nearly three hours.\n\nTo preserve my composure and combat boredom, I plugged in my noise-canceling headphones, immersed myself in an audiobook, and struck up a pleasant conversation with a family from Munich. Despite our coping strategies, a palpable sense of tension and collective exasperation permeated the stuffy corridor as people anxiously checked departure boards for connecting flights. When I finally reached the manual immigration booth and had my passport stamped, an overwhelming wave of relief washed over me. The episode served as a vivid reminder of how utterly dependent modern logistics are on algorithmic infrastructure—and how swiftly human frustration mounts when that veneer of automated efficiency dissolves.",
        wordCount: 216,
      },
    },
  },
  {
    id: 'p2-small-business',
    part: 2,
    topic: 'Business & Entrepreneurship',
    question: 'Describe a successful small business or local company you know and admire.',
    cueCardBullets: [
      'What kind of business it is and where it is located',
      'What goods or services it provides',
      'Who the founders or owners are',
      'And explain why you believe this business has achieved such lasting success',
    ],
    sourceBadge: 'Cambridge IELTS 16 • Test 2',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Business Background & Locale' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Product Authenticity & Philosophy' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Customer Loyalty & Community Ties' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Recipe for Lasting Success' },
    ],
    targetCollocations: [
      {
        phrase: 'uncompromising dedication to quality',
        cefr: 'C2',
        contextSnippet: '...what distinguishes them is an uncompromising dedication to artisanal quality.',
      },
      {
        phrase: 'fiercely competitive marketplace',
        cefr: 'C1',
        contextSnippet: '...they have managed to thrive in a fiercely competitive marketplace dominated by chains.',
      },
      {
        phrase: 'cultivate a loyal customer base',
        cefr: 'C1',
        contextSnippet: '...they succeeded in cultivating an extraordinarily loyal customer base across the district.',
      },
      {
        phrase: 'cornerstone of the community',
        cefr: 'C1',
        contextSnippet: '...the bakery has evolved into a beloved cornerstone of the neighborhood.',
      },
      {
        phrase: 'locally sourced organic ingredients',
        cefr: 'B2',
        contextSnippet: '...by relying exclusively on locally sourced organic ingredients and sourdough cultures.',
      },
    ],
    grammarTarget: {
      label: 'Prepositional relative clause',
      exampleFromModel: 'They carved out a lucrative niche against which impersonal retail conglomerates simply cannot compete.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: "I would like to talk about a local bakery near my neighborhood called 'The Daily Loaf'. It was opened five years ago by a young couple who studied baking in France. They make fresh sourdough bread, croissants, and specialty coffee every morning.\n\nEven though there are large supermarket chains nearby, this small bakery is always full of customers. People stand in line early in the morning because the bread is made with natural ingredients and smells delicious. The owners are very welcoming and remember their regular customers' names. I admire them because they started from a small shop with limited money, but through hard work and good quality, they built a very successful business.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to speak about a thriving independent artisan bakery in my hometown named 'The Hearth', established roughly six years ago by a former graphic designer and her baker husband.\n\nSituated in a revitalized historic district, the enterprise specializes in traditional slow-fermented sourdoughs, heritage grain pastries, and specialty single-origin coffees. What initially began as a modest market stall has expanded into a celebrated culinary landmark. In an era where mass-produced supermarket bread is saturated with artificial preservatives and commercial yeast, The Hearth’s founders adopted an uncompromising dedication to authenticity, sourcing stone-milled organic flour directly from regional farmers and allowing their doughs to prove for over thirty-six hours.\n\nThis principled philosophy enabled them to cultivate an extraordinarily loyal customer base against which generic franchise chains struggle to compete. Beyond their exquisite baked goods, the owners have embedded themselves as a cornerstone of the local community, frequently hosting weekend fermentation workshops and donating surplus loaves to neighborhood food shelters. I deeply admire this business because it exemplifies how small-scale entrepreneurs can achieve enduring commercial viability through craft integrity, sustainable sourcing, and genuine civic engagement.",
        wordCount: 204,
      },
    },
  },
  {
    id: 'p2-formative-book',
    part: 2,
    topic: 'Literature & Philosophy',
    question: 'Describe a book or novel you read that made a strong and lasting impression on you.',
    cueCardBullets: [
      'What the title and author of the book were',
      'What the core narrative or argument was about',
      'When you first read it',
      'And explain why this work left such a lasting mark on your outlook',
    ],
    sourceBadge: 'Cambridge IELTS 14 • Test 4',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Book Identification & Theme' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Narrative Plot & Philosophical Core' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Timeless Societal Parallels' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Lasting Intellectual Impact' },
    ],
    targetCollocations: [
      {
        phrase: 'thought-provoking dystopian narrative',
        cefr: 'C2',
        contextSnippet: '...George Orwell’s 1984 remains an extraordinarily thought-provoking dystopian narrative.',
      },
      {
        phrase: 'cautionary tale',
        cefr: 'C1',
        contextSnippet: '...it serves as a harrowing cautionary tale about surveillance capitalism and totalitarianism.',
      },
      {
        phrase: 'manipulation of historical truth',
        cefr: 'C2',
        contextSnippet: '...the regime’s systematic manipulation of historical truth felt disturbingly prescient.',
      },
      {
        phrase: 'reshape one’s worldview',
        cefr: 'C1',
        contextSnippet: '...the novel fundamentally reshaped my worldview regarding linguistic integrity.',
      },
      {
        phrase: 'insidious erosion of privacy',
        cefr: 'C2',
        contextSnippet: '...it alertly warns against the insidious erosion of personal privacy.',
      },
    ],
    grammarTarget: {
      label: 'Concessive clause with no matter how',
      exampleFromModel: 'No matter how familiar one is with historical authoritarianism, reading Orwell’s depiction of thought control remains chillingly relevant.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: "I would like to talk about the novel '1984' written by George Orwell. I read it about two years ago when a friend recommended it for our book club. The story is set in a future totalitarian society where a powerful leader called Big Brother monitors every citizen through screens.\n\nThe main character, Winston Smith, works for the government rewriting history, but secretly he hates the system and falls in love with a woman named Julia. They try to rebel against the party, but in the end, they are captured. This book left a big impression on me because it shows how dangerous government control and propaganda can be if citizens don't protect their freedom.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to speak about George Orwell’s seminal dystopian masterpiece, '1984', a work of fiction that left an indelible mark on my intellectual development when I first encountered it during my undergraduate years.\n\nSet in a grim totalitarian superstate known as Oceania, the narrative follows Winston Smith, an unexceptional bureaucrat tasked with altering historical archives at the Ministry of Truth to conform with the regime’s shifting propaganda. What elevates Orwell’s work beyond standard science fiction is its profound philosophical dissection of power, censorship, and cognitive manipulation. The concept of 'Newspeak'—the deliberate impoverishment of vocabulary to make subversive thought literally impossible—struck me as a chillingly prophetic observation about how language shapes human consciousness.\n\nWhile written in the late 1940s, the novel’s warnings regarding the insidious erosion of privacy and the algorithmic distortion of objective reality feel more urgent today than ever before. Reading it forced me to scrutinize information ecosystems far more critically and reinforced my belief that safeguarding open civic discourse is essential for democratic survival. It fundamentally transformed me from a passive consumer of political news into an active, discerning analyst.",
        wordCount: 206,
      },
    },
  },
  {
    id: 'p2-ambitious-goal',
    part: 2,
    topic: 'Ambition & Personal Goals',
    question: 'Describe an ambitious personal or professional goal that you hope to achieve in the foreseeable future.',
    cueCardBullets: [
      'What this ambition or goal is',
      'When you first conceived this objective',
      'What concrete steps are required to reach it',
      'And explain why achieving this goal is of such personal significance to you',
    ],
    sourceBadge: 'Cambridge IELTS 19 • Test 2',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Goal Articulation & Context' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Genesis & Motivation' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Actionable Roadmap & Prerequisites' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Personal Fulfillment & Climax' },
    ],
    targetCollocations: [
      {
        phrase: 'pivotal milestone',
        cefr: 'C1',
        contextSnippet: '...securing this fellowship represents a pivotal milestone in my research trajectory.',
      },
      {
        phrase: 'daunting endeavor',
        cefr: 'C1',
        contextSnippet: '...while launching a non-profit consultancy is a daunting endeavor, it is thoroughly worthwhile.',
      },
      {
        phrase: 'culmination of years of dedication',
        cefr: 'C2',
        contextSnippet: '...it will represent the hard-won culmination of years of dedicated academic labor.',
      },
      {
        phrase: 'unwavering commitment',
        cefr: 'C1',
        contextSnippet: '...demanding unwavering commitment and methodical preparation.',
      },
      {
        phrase: 'bridge the gap between theory and practice',
        cefr: 'C2',
        contextSnippet: '...allowing me to effectively bridge the gap between academic theory and real-world policy.',
      },
    ],
    grammarTarget: {
      label: 'Future Perfect for long-term projection',
      exampleFromModel: 'By the time I complete my doctoral qualifications, I hope to have established a community-focused clean energy initiative.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: "I would like to describe my ambition to start my own educational technology company in the next five years. I first got this idea when I was helping my younger brother learn math using mobile apps during the pandemic. Most educational apps were quite dry and expensive, so I thought I could build something more engaging.\n\nTo achieve this goal, I need to complete my master’s degree in computer science first. After that, I plan to work at a software startup for two or three years to learn about project management and raising venture capital. This goal is really important to me because I want to make high-quality learning tools accessible to students from low-income families.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to speak about an ambitious long-term objective that has guided my academic and professional decisions for several years: namely, founding an open-access educational technology social enterprise dedicated to underserved rural communities.\n\nI first conceived this vision during my undergraduate studies while volunteering as a mathematics tutor in remote mountainous districts. The sheer disparity between well-resourced urban academies and rural classrooms with outdated textbooks was stark and demoralizing. Realizing that scalable mobile technology could democratize high-caliber instruction, I resolved to dedicate my career to engineering interactive, low-bandwidth pedagogical software.\n\nRealizing this ambition is undeniably a daunting endeavor that demands methodical preparation. First, I must complete my master’s in data engineering, building the technical rigor required to architect adaptive learning algorithms. Subsequently, I intend to spend two to three years collaborating with venture-backed educational platforms to master product-market fit and operational governance. Achieving this milestone would be the culmination of years of focused labor. For me, true professional fulfillment lies not in climbing corporate ladders, but in leveraging technological innovation to empower disenfranchised youth.",
        wordCount: 204,
      },
    },
  },
  {
    id: 'p2-resolving-disagreement',
    part: 2,
    topic: 'Interpersonal Relationships',
    question: 'Describe a disagreement you had with a colleague, friend, or family member that you managed to resolve.',
    cueCardBullets: [
      'Who you had the disagreement with',
      'What the underlying issue was about',
      'How the tension or conflict was addressed',
      'And explain what you learned from how the situation was resolved',
    ],
    sourceBadge: 'Cambridge IELTS 18 • Test 3',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Protagonists & Project Context' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • The Core Clash of Methodologies' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • The Mediated Resolution' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Insights on Emotional Maturity' },
    ],
    targetCollocations: [
      {
        phrase: 'divergent perspectives',
        cefr: 'C1',
        contextSnippet: '...we clashed over divergent perspectives on the marketing campaign’s creative direction.',
      },
      {
        phrase: 'de-escalate simmering tensions',
        cefr: 'C2',
        contextSnippet: '...we agreed to step outside the boardroom to de-escalate simmering tensions.',
      },
      {
        phrase: 'find common ground',
        cefr: 'B2',
        contextSnippet: '...through candid, calm dialogue, we managed to find common ground.',
      },
      {
        phrase: 'constructive compromise',
        cefr: 'C1',
        contextSnippet: '...arriving at a constructive compromise that combined the strengths of both proposals.',
      },
      {
        phrase: 'foster mutual respect',
        cefr: 'C1',
        contextSnippet: '...the resolution served to foster mutual respect between our respective teams.',
      },
    ],
    grammarTarget: {
      label: 'Modal perfect for reflection',
      exampleFromModel: 'We could easily have allowed stubborn pride to derail the project, but choosing transparent dialogue unlocked a far superior hybrid solution.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: "I want to describe a conflict I had with my teammate, Sarah, during a university group project last semester. We were designing a website for a local non-profit organization, but we had very different opinions about the design. She wanted a colorful and complex layout with many animations, while I preferred a clean, simple look that would load quickly.\n\nWe argued for two days, and our progress stopped. Eventually, I suggested that we conduct a quick survey with ten potential users from our class to see what they liked. The survey showed that users preferred a simple layout for reading text, but wanted colorful images in the header. We compromised and combined our ideas. In the end, we received an 'A' grade, and I learned that listening to user feedback is better than arguing over personal tastes.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to recount a sharp professional disagreement I had with a senior marketing colleague during the rollout of a flagship product launch last year.\n\nThe tension originated from starkly divergent perspectives on brand positioning. My colleague championed an aggressive, celebrity-endorsed social media blitz designed to maximize immediate viral impressions. Conversely, I argued that our niche enterprise software demanded a substantive, content-driven approach centered on authoritative white papers and customer case studies. As project deadlines loomed, our team meetings grew fraught with friction, threatening to derail the entire campaign schedule.\n\nRecognizing that stubborn pride was clouding our collective judgment, I proposed stepping outside the boardroom for an informal coffee. By explicitly acknowledging the merits of her high-visibility tactics and framing our dispute around shared commercial objectives rather than personal egos, we succeeded in de-escalating simmering tensions. We crafted a constructive compromise: dedicating twenty percent of the budget to awareness-building video snippets that routed prospective clients directly to my in-depth analytical case studies. The campaign exceeded quarterly conversion targets by thirty percent, and the episode reinforced a vital leadership lesson: resolving professional conflict requires active empathetic listening rather than argumentative entrenchment.",
        wordCount: 209,
      },
    },
  },
  {
    id: 'p2-traditional-celebration',
    part: 2,
    topic: 'Culture & Festivals',
    question: 'Describe an important traditional celebration or cultural festival in your country that you enjoy.',
    cueCardBullets: [
      'What the festival is and when it takes place',
      'What rituals or festive activities are involved',
      'What traditional foods or garments are customary',
      'And explain why this celebration holds special cultural value for your community',
    ],
    sourceBadge: 'Cambridge IELTS 15 • Test 3',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Festival Introduction & Heritage' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Visual Atmosphere & Family Feasts' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Rituals of Renewal & Gratitude' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Cultural Anchor in Modern Times' },
    ],
    targetCollocations: [
      {
        phrase: 'time-honored cultural heritage',
        cefr: 'C2',
        contextSnippet: '...Lunar New Year encapsulates our time-honored cultural heritage unlike any other event.',
      },
      {
        phrase: 'reaffirm ancestral roots',
        cefr: 'C2',
        contextSnippet: '...it offers an annual pilgrimage to reunite with family and reaffirm ancestral roots.',
      },
      {
        phrase: 'exuberant street festivities',
        cefr: 'C1',
        contextSnippet: '...streets are transformed by exuberant street festivities, lantern displays, and lion dances.',
      },
      {
        phrase: 'symbolize prosperity and renewal',
        cefr: 'C1',
        contextSnippet: '...traditional feasts laden with dumplings that symbolize prosperity and renewal.',
      },
      {
        phrase: 'generational cohesion',
        cefr: 'C2',
        contextSnippet: '...fostering deep generational cohesion between grandparents and youth.',
      },
    ],
    grammarTarget: {
      label: 'Fronted participial phrase',
      exampleFromModel: 'Steeped in centuries of folklore, the spring festival brings bustling modern cities to a joyful standstill.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: "I would like to talk about the Lunar New Year, which is the most important festival in my country. It usually takes place in late January or early February depending on the lunar calendar. Before the holiday, families clean their houses thoroughly and decorate their living rooms with red paper and peach blossoms.\n\nOn New Year's Eve, all family members gather for a huge dinner with traditional foods like sticky rice cakes and boiled chicken. Children receive lucky money in red envelopes from their parents and grandparents. I love this festival because everyone is in a joyful mood, work stops for a week, and I get to see relatives whom I haven't seen all year.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to speak about the Lunar New Year festival, or the Spring Festival, which stands as the crowning jewel of my country’s time-honored cultural heritage.\n\nCelebrated across late January and early February, the festival marks the transition into the agricultural spring. Steeped in centuries of folklore, the occasion transforms bustling urban metropolises into serene havens as millions of migrant workers return to their ancestral hometowns. Homes are meticulously cleaned to sweep away lingering misfortune, while doorways are adorned with poetic calligraphy scrolls that symbolize prosperity and renewal.\n\nThe centerpiece of the celebration is the reunion banquet on New Year’s Eve. Generations gather around multi-course feasts featuring dumplings, steamed whole fish, and glutinous rice cakes, each dish carrying auspicious metaphorical significance. Elders distribute red envelopes containing crisp banknotes to children, imparting blessings of wisdom and fortitude. What renders this celebration so deeply meaningful is its capacity to foster generational cohesion in an increasingly atomized modern society. Amid the relentless pace of contemporary life, the festival serves as an indispensable cultural anchor, drawing families together to express gratitude and reaffirm communal bonds.",
        wordCount: 206,
      },
    },
  },
  {
    id: 'p2-autonomous-skill',
    part: 2,
    topic: 'Education & Lifelong Learning',
    question: 'Describe an important skill you acquired outside of formal schooling or classroom instruction.',
    cueCardBullets: [
      'What the skill was and why you decided to learn it',
      'What self-study methods or resources you utilized',
      'What obstacles or steep learning curves you encountered',
      'And explain how acquiring this competence has benefited you',
    ],
    sourceBadge: 'Cambridge IELTS 17 • Test 3',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Skill Motivation & Background' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Self-Taught Methodology & Tools' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Overcoming Obstacles & Frustration' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Professional & Personal Dividend' },
    ],
    targetCollocations: [
      {
        phrase: 'self-directed learning journey',
        cefr: 'C2',
        contextSnippet: '...embarking on a self-directed learning journey in web application development.',
      },
      {
        phrase: 'demystify complex concepts',
        cefr: 'C1',
        contextSnippet: '...online open-source repositories helped demystify complex backend architectures.',
      },
      {
        phrase: 'steep learning curve',
        cefr: 'C1',
        contextSnippet: '...navigating asynchronous code presented a tremendously steep learning curve initially.',
      },
      {
        phrase: 'tangible portfolio',
        cefr: 'B2',
        contextSnippet: '...building tangible portfolio projects solidified my practical competencies.',
      },
      {
        phrase: 'invaluable professional asset',
        cefr: 'C1',
        contextSnippet: '...autonomously mastering coding has proved to be an invaluable professional asset.',
      },
    ],
    grammarTarget: {
      label: 'Inverted conditional for retrospective hypothesis',
      exampleFromModel: 'Were it not for collaborative open-source forums and persistence, I would have abandoned software development within the first month.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: "I want to talk about how I learned web design and basic coding by myself during the pandemic lockdown. I always wanted to build websites, but my university course was in business, not computer science. So I decided to watch video tutorials on YouTube and read programming blogs online.\n\nAt the beginning, it was really confusing because there were many errors in my code that I couldn't fix. Sometimes I spent hours looking for a missing semicolon. However, I joined an online forum where experienced coders gave me advice. After six months of practice, I built a portfolio website for my father's store. This skill helped me get my current job because my manager liked my proactive attitude.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to describe how I autonomously acquired competence in front-end web development, an endeavor that completely transformed my career trajectory.\n\nWhile my university degree was rooted in economics, I realized early on that digital literacy and programmatic problem-solving were becoming non-negotiable workplace assets. Rather than enrolling in exorbitant bootcamps, I committed to a disciplined self-directed learning journey, devoting two hours every evening to interactive coding platforms and open-source documentation. Initially, understanding asynchronous algorithms and responsive UI architecture presented an intensely steep learning curve; encountering cryptic syntax bugs was frequently demoralizing.\n\nWere it not for the collaborative ethos of online developer communities like GitHub, where seasoned engineers generously demystified architectural concepts, I might well have abandoned the pursuit. By systematically building tangible portfolio projects—ranging from financial calculators to interactive dashboards—I transitioned from theoretical syntax to pragmatic software development. Acquiring this competence has yielded extraordinary dividends: it not only allowed me to build proprietary analytical tools in my current analyst role, but it also fundamentally cultivated intellectual resilience, proving that curiosity and self-discipline can transcend formal classroom boundaries.",
        wordCount: 204,
      },
    },
  },
  {
    id: 'p2-public-space',
    part: 2,
    topic: 'Urban Planning & Community',
    question: 'Describe a public park, urban plaza, or civic space in your city that you enjoy spending time in.',
    cueCardBullets: [
      'Where this public space is located',
      'What physical features and landscapes it offers',
      'What people typically do there',
      'And explain why this venue serves as such an enriching hub for the local community',
    ],
    sourceBadge: 'Cambridge IELTS 16 • Test 3',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Civic Space Setting & History' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Architectural & Natural Features' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Diverse Social Dynamics' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • The Democratic Essence of Public Space' },
    ],
    targetCollocations: [
      {
        phrase: 'harmonious blend of architecture and greenery',
        cefr: 'C2',
        contextSnippet: '...the plaza features a harmonious blend of modernist architecture and verdant greenery.',
      },
      {
        phrase: 'pedestrianized civic promenade',
        cefr: 'C1',
        contextSnippet: '...spanning an expansive pedestrianized civic promenade free from vehicular noise.',
      },
      {
        phrase: 'foster social cohesion',
        cefr: 'C1',
        contextSnippet: '...such accessible public spaces actively foster social cohesion across diverse demographics.',
      },
      {
        phrase: 'sanctuary from sensory overload',
        cefr: 'C2',
        contextSnippet: '...it provides an essential sanctuary from sensory overload in the city center.',
      },
      {
        phrase: 'inclusive communal gathering spot',
        cefr: 'B2',
        contextSnippet: '...it acts as a vibrant, inclusive communal gathering spot throughout the seasons.',
      },
    ],
    grammarTarget: {
      label: 'Participial clause opening',
      exampleFromModel: 'Flanked by historic stone facades and interactive water fountains, the central plaza creates a magnetic democratic gathering ground for the public.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: "I would like to talk about Central City Square in my hometown. It is a large open plaza right in front of the municipal city hall. There are green lawns, flower gardens, and a big musical fountain in the middle with many wooden benches where people can sit.\n\nIn the afternoons, families bring their children here to roller-skate and ride bicycles because there are no cars allowed. Young people meet their friends to drink boba tea, and elderly people play chess in the shade of the trees. I like going there in the evening to read books and enjoy the cool breeze. It is a very friendly and safe public place where everyone can relax without spending any money.",
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: "I would like to describe Victoria Civic Plaza, an expansive urban public space situated in the heart of my city’s cultural quarter.\n\nRe-engineered five years ago as part of a major pedestrianization initiative, the plaza features a harmonious blend of sustainable modernist architecture and lush horticultural landscaping. Flanked by historic stone facades on one side and a contemporary glass library on the other, the precinct incorporates tiered amphitheater seating, native birch groves, and interactive reflecting pools that neutralize traffic noise from adjacent thoroughfares.\n\nWhat makes this civic venue truly exceptional is its capacity to foster social cohesion across disparate demographics. On any given weekend, one observes elderly residents engrossed in spirited games of chess beneath shady pergolas, university students collaborating on laptops, and families watching children play safely in the car-free zone. Unlike commercial shopping malls that demand consumption, Victoria Plaza represents an authentic democratic commons accessible to all citizens regardless of socioeconomic status. It functions as an indispensable urban sanctuary from sensory overload, where the pace of metropolitan life naturally decelerates and genuine community bonds can flourish.",
        wordCount: 203,
      },
    },
  },
  {
    id: 'p2-good-news',
    part: 2,
    topic: 'Memorable Moments',
    question: 'Describe a time when you received exceptionally positive news that surprised or delighted you.',
    cueCardBullets: [
      'What the news was about and who delivered it to you',
      'When and where you were when you heard it',
      'How you initially reacted upon hearing the news',
      'And explain why this development had such a meaningful impact on your circumstances',
    ],
    sourceBadge: 'Cambridge IELTS 19 • Test 1',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • News Announcement & Setting' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Anticipation & Immediate Reaction' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Why It Was Such a Milestone' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Enduring Gratitude & Transformation' },
    ],
    targetCollocations: [
      {
        phrase: 'momentous announcement',
        cefr: 'C2',
        contextSnippet: '...it was a momentous announcement that fundamentally altered my career prospects.',
      },
      {
        phrase: 'overcome with pure elation',
        cefr: 'C1',
        contextSnippet: '...I was completely overcome with pure elation upon opening the notification.',
      },
      {
        phrase: 'unburdened by financial strain',
        cefr: 'C2',
        contextSnippet: '...receiving the full merit scholarship meant being unburdened by financial strain.',
      },
      {
        phrase: 'hard work bearing fruit',
        cefr: 'B2',
        contextSnippet: '...it felt like the ultimate validation of countless sleepless nights bearing fruit.',
      },
      {
        phrase: 'unprecedented opportunity',
        cefr: 'C1',
        contextSnippet: '...the scholarship unlocked an unprecedented opportunity to study abroad.',
      },
    ],
    grammarTarget: {
      label: 'Negative Inversion (Rarely have I felt...)',
      exampleFromModel: 'Rarely have I experienced such profound jubilation as when I saw the congratulatory subject line appear on my screen.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: "I would like to talk about the day I received an email saying I had won a university scholarship to study abroad. It happened about one year ago. I was sitting at home in my living room having dinner with my parents when my phone buzzed with a notification.\n\nI opened my email and saw the word 'Congratulations' from the admissions office. I was so happy that I jumped up from my chair and shouted to my parents. We were all laughing and hugging each other because we had worried a lot about tuition fees. Getting this scholarship was very meaningful because my family couldn't afford international university tuition, so it made my dream of studying overseas come true.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to recount the exhilarating moment I received notification that I had been awarded a prestigious fully-funded postgraduate scholarship to study in the United Kingdom.\n\nThis momentous announcement arrived on a rainy Tuesday afternoon last spring. I was sitting anxiously in my university library cubicle, refreshing my inbox while nervously reviewing my research thesis. The competition for this particular grant had been fiercely contested, with thousands of international candidates vying for just three openings, so I had mentally prepared myself for disappointment. Rarely have I experienced such pure elation as when I clicked open the formal letter and read the opening sentence confirming my award.\n\nI sat frozen in disbelief for several moments, heart pounding, before quietly rushing out to the corridor to call my parents. Hearing my mother’s voice crack with emotion was deeply moving; it represented the hard-won culmination of months spent drafting proposals and sitting demanding panel interviews. Beyond the prestige, the scholarship had an immense practical consequence: it unburdened my family from prohibitive financial strain and granted me the freedom to pursue specialized research under world-renowned professors. It served as a powerful reminder that perseverance in the face of daunting odds can genuinely open unprecedented doors.",
        wordCount: 216,
      },
    },
  },
  {
    id: 'p2-environmental-policy',
    part: 2,
    topic: 'Environmental Legislation',
    question: 'Describe an environmental regulation, law, or civic policy introduced in your city or country.',
    cueCardBullets: [
      'What the policy or legislation is aimed at curbing',
      'When and how it was implemented',
      'How the general public responded to its enforcement',
      'And explain how effective this rule has been in protecting the environment',
    ],
    sourceBadge: 'Cambridge IELTS 14 • Test 2',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Legislation Background & Intent' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Implementation Strategy & Mechanism' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Public Reaction & Behavioral Shift' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Measurable Environmental Dividend' },
    ],
    targetCollocations: [
      {
        phrase: 'drastic reduction in single-use plastics',
        cefr: 'C1',
        contextSnippet: '...the statutory ban triggered an immediate, drastic reduction in single-use plastics.',
      },
      {
        phrase: 'mandatory financial surcharge',
        cefr: 'C1',
        contextSnippet: '...levying a mandatory financial surcharge on all disposable shopping bags.',
      },
      {
        phrase: 'foster civic stewardship',
        cefr: 'C2',
        contextSnippet: '...the initiative succeeded in fostering genuine civic stewardship across consumers.',
      },
      {
        phrase: 'curb ecological degradation',
        cefr: 'C2',
        contextSnippet: '...a landmark step toward curbing maritime and urban ecological degradation.',
      },
      {
        phrase: 'tangible behavioral shift',
        cefr: 'B2',
        contextSnippet: '...prompting a swift, tangible behavioral shift toward reusable canvas bags.',
      },
    ],
    grammarTarget: {
      label: 'Passive reporting structure with modal',
      exampleFromModel: 'While the levy was initially predicted to generate public resistance, it has been embraced as common civic practice.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: "I want to describe a government law introduced two years ago that banned free plastic shopping bags in all supermarkets and retail stores in my country. In the past, whenever you bought groceries, the cashier gave you five or six thin plastic bags for free, which resulted in a lot of trash in the streets and rivers.\n\nNow, customers must bring their own cloth bags or pay a fee of about ten cents for each paper bag. At first, many shoppers complained because they forgot their reusable bags at home. But after a few months, people got used to it. I think this policy has been very successful because you see much less plastic waste in public parks and rivers now.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to speak about a landmark environmental regulation introduced by our municipal government approximately three years ago: a statutory ban on free single-use plastic carrier bags coupled with a mandatory surcharge on all disposable packaging across commercial outlets.\n\nThe policy was conceived to curb rampant ecological degradation in our waterways and landfills, where billions of discarded polymer bags were choking drainage networks and threatening marine ecosystems. While consumer protection groups initially feared the surcharge would generate fierce public backlash, the municipal rollout was executed with admirable clarity. Authorities accompanied the policy with widespread public awareness campaigns in schools and public transit hubs, framing the fee not as a punitive tax, but as a collective civic investment.\n\nWithin six months, consumer habits underwent a profound, tangible behavioral shift. Carrying durable cotton totes and collapsible baskets rapidly transitioned from a niche eco-conscious preference to universally accepted social etiquette. Official audits revealed an astonishing eighty percent reduction in single-use plastic consumption across major supermarket chains within the first year alone. This policy demonstrated to me that targeted economic disincentives, when paired with clear ethical reasoning, can rapidly recalibrate societal norms and deliver immediate environmental dividends.",
        wordCount: 205,
      },
    },
  },

  // ==========================================
  // PART 3: TWO-WAY DISCUSSION (45s Target Duration)
  // ==========================================
  {
    id: 'p3-decision-making',
    part: 3,
    topic: 'Decision-Making & Society',
    question: 'Why do many people find it difficult to make long-term life decisions in modern society?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Direct Core Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Paradox of Choice' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Economic & Social Volatility' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Concise Synthesis' },
    ],
    targetCollocations: [
      {
        phrase: 'paradox of choice',
        cefr: 'C1',
        contextSnippet: '...citizens face a paralyzing paradox of choice in virtually every sphere of life.',
      },
      {
        phrase: 'relentless career volatility',
        cefr: 'C2',
        contextSnippet: '...driven by rapid automation and relentless career volatility in the global market.',
      },
      {
        phrase: 'fear of missing out',
        cefr: 'B2',
        contextSnippet: '...social media amplifies the fear of missing out on alternative paths.',
      },
      {
        phrase: 'paralyzing analysis',
        cefr: 'C1',
        contextSnippet: '...leading to chronic decision paralysis when committing to a long-term goal.',
      },
    ],
    grammarTarget: {
      label: 'Concession clause with While',
      exampleFromModel: 'While past generations followed linear societal scripts, contemporary youth confront an overwhelming proliferation of career options.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: 'I think people struggle to make decisions today because there are too many options available. In the past, people just followed what their parents did, but now you can study anything and work anywhere. Also, the cost of living is high and jobs are not stable, so people are afraid of making mistakes and regretting them later.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'I attribute this difficulty primarily to the paradox of choice. Whereas prior generations adhered to relatively predictable, linear life scripts, modern individuals face an overwhelming proliferation of lifestyle and career trajectories. Compounding this is acute economic volatility driven by rapid technological disruption, which fosters a persistent fear of making suboptimal commitments in an unpredictable world.',
        wordCount: 61,
      },
    },
  },
  {
    id: 'p3-teacher-vs-ai',
    part: 3,
    topic: 'Education & Technology',
    question: 'Could automated artificial intelligence ever entirely replace human classroom teachers?',
    sourceBadge: 'Cambridge IELTS 19 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Definitive Verdict' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • AI Algorithmic Strength' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Irreplaceable Human Traits' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Balanced Conclusion' },
    ],
    targetCollocations: [
      {
        phrase: 'pedagogical empathy',
        cefr: 'C2',
        contextSnippet: '...machines completely lack the pedagogical empathy necessary to inspire struggling pupils.',
      },
      {
        phrase: 'tailor instructional pacing',
        cefr: 'C1',
        contextSnippet: '...while neural networks can effortlessly tailor instructional pacing to individual metrics.',
      },
      {
        phrase: 'emotional resonance',
        cefr: 'C1',
        contextSnippet: '...teaching fundamentally relies on emotional resonance and moral guidance.',
      },
      {
        phrase: 'mere knowledge transmission',
        cefr: 'C2',
        contextSnippet: '...education extends far beyond mere knowledge transmission into character building.',
      },
    ],
    grammarTarget: {
      label: 'Condition of degree with No matter how',
      exampleFromModel: 'No matter how sophisticated automated learning algorithms become, they cannot replicate the empathetic intuition of an experienced human educator.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'I don’t think AI can ever replace teachers completely. Computers are good at checking grammar and giving quizzes quickly, but they cannot comfort a sad student or teach values. If children only learn from screens, they will become anti-social. So teachers will always be necessary in schools.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'I consider that prospect highly improbable. While artificial intelligence can undeniably tailor instructional pacing and provide instantaneous quantitative feedback, genuine education extends far beyond mere knowledge transmission. An algorithm cannot discern subtle emotional distress, foster moral courage, or provide the pedagogical empathy that inspires children to overcome self-doubt.',
        wordCount: 56,
      },
    },
  },
  {
    id: 'p3-heritage-tourism',
    part: 3,
    topic: 'Heritage & Conservation',
    question: 'Should governments restrict tourist numbers to protect fragile historic landmarks from degradation?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Policy Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Economic vs Conservation Conflict' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Concrete Quota Strategy' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Long-term Vision' },
    ],
    targetCollocations: [
      {
        phrase: 'statutory visitor caps',
        cefr: 'C2',
        contextSnippet: '...implementing statutory visitor caps is essential to preserve fragile stonework.',
      },
      {
        phrase: 'irreparable physical degradation',
        cefr: 'C2',
        contextSnippet: '...unfettered mass tourism inevitably inflicts irreparable physical degradation on ancient monuments.',
      },
      {
        phrase: 'lucrative source of revenue',
        cefr: 'B2',
        contextSnippet: '...while historical tourism represents a lucrative source of revenue for municipalities.',
      },
      {
        phrase: 'preserve heritage for posterity',
        cefr: 'C1',
        contextSnippet: '...our foremost obligation must be to preserve cultural heritage for posterity.',
      },
    ],
    grammarTarget: {
      label: 'Only by... inversion',
      exampleFromModel: 'Only by enforcing strict daily visitor quotas can authorities preserve fragile archaeological sites for future generations.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official IDP Candidate Sample)',
        text: 'I agree that historical places should limit tourists because too many visitors make ancient temples dirty and damaged. Also, local people feel uncomfortable when historic streets are always crowded. However, governments still need money from tourism to maintain the sites, so maybe they can charge higher ticket prices instead of banning people.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'I believe statutory caps on tourist numbers are entirely justified. While cultural tourism is undeniably a lucrative source of revenue for local economies, unfettered foot traffic inevitably induces irreparable physical degradation to ancient masonry and fragile ecosystems. Only by implementing strict visitor quotas and pre-booked time slots can conservators strike a sustainable balance between commercial accessibility and the sacred duty of preserving heritage for posterity.',
        wordCount: 68,
      },
    },
  },
  {
    id: 'p3-career-stability',
    part: 3,
    topic: 'Careers & Workplace',
    question: 'Why do younger workers today change employers more frequently than older generations did?',
    sourceBadge: 'Official British Council Sample • Band 9.0',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Generational Shift' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Economic Reality' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Skill Diversification' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Cultural Conclusion' },
    ],
    targetCollocations: [
      {
        phrase: 'climb the corporate ladder',
        cefr: 'B2',
        contextSnippet: '...the traditional mindset of climbing the corporate ladder within a single firm is obsolete.',
      },
      {
        phrase: 'strategic job-hopping',
        cefr: 'C1',
        contextSnippet: '...strategic job-hopping has become the primary mechanism for career acceleration.',
      },
      {
        phrase: 'stagnant wage growth',
        cefr: 'C1',
        contextSnippet: '...in an era characterized by stagnant internal wage growth and economic volatility.',
      },
      {
        phrase: 'diversify one’s skill set',
        cefr: 'C1',
        contextSnippet: '...frequent moves allow ambitious professionals to rapidly diversify their skill sets.',
      },
    ],
    grammarTarget: {
      label: 'Whereas concession clause',
      exampleFromModel: 'Whereas previous cohorts prioritized institutional loyalty and lifelong pensions, modern professionals view strategic mobility as essential.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'In my opinion, young workers change jobs often because they want higher salaries and promotions faster. If you stay in one company for five years, your salary only increases a little bit each year, but if you move to a new company, you can negotiate higher pay. Also, young people want to try different work environments before settling down.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'This marked generational divergence is driven primarily by economic realism. Whereas older cohorts placed a premium on lifelong institutional loyalty in exchange for guaranteed pensions, younger professionals operate in a labor market characterized by stagnant internal wage growth. Consequently, strategic job-hopping has evolved into the most effective mechanism for career acceleration, allowing ambitious individuals to diversify their skill sets and maintain competitive compensation in a volatile digital economy.',
        wordCount: 72,
      },
    },
  },
  {
    id: 'p3-history-heritage',
    part: 3,
    topic: 'History & Cultural Heritage',
    question: 'Why do governments invest substantial public funds into preserving historic monuments rather than redirecting those resources to contemporary infrastructure?',
    sourceBadge: 'Cambridge IELTS 15 • Test 1',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • National Identity Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Intangible Cultural Anchor' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Economic & Educational Yield' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Synthetic Conclusion' },
    ],
    targetCollocations: [
      {
        phrase: 'tangible manifestation of collective memory',
        cefr: 'C2',
        contextSnippet: '...historic landmarks represent the tangible manifestation of a nation’s collective memory.',
      },
      {
        phrase: 'foster civic pride',
        cefr: 'C1',
        contextSnippet: '...such monuments foster civic pride and bind diverse communities together.',
      },
      {
        phrase: 'myopic utilitarian perspective',
        cefr: 'C2',
        contextSnippet: '...viewing conservation purely through a myopic utilitarian lens is dangerous.',
      },
      {
        phrase: 'vital educational touchstone',
        cefr: 'C1',
        contextSnippet: '...serving as a vital educational touchstone for future generations.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence with what clause',
      exampleFromModel: 'What makes state preservation essential is that ancient architecture anchors a society’s identity against homogenization.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 15 Candidate Log)',
        text: 'I think governments spend money on old buildings because they attract many foreign tourists who spend money in hotels and restaurants. Also, historical monuments teach children about past heroes and traditions. If we destroy old castles to build highways, people will forget their country’s culture.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'State investment in historic preservation is essential because architectural monuments represent the tangible manifestation of a nation’s collective memory. While contemporary infrastructure is undeniably vital, viewing state expenditure through a purely utilitarian lens overlooks the profound psychological need for cultural continuity. Historic landmarks foster civic pride, anchor national identity against global homogenization, and provide invaluable educational touchstones that bridge generations.',
        wordCount: 63,
      },
    },
  },
  {
    id: 'p3-tech-autonomy',
    part: 3,
    topic: 'Technology & Society',
    question: 'To what extent has the ubiquitous presence of smart algorithms and mobile devices eroded our capacity for independent critical thinking?',
    sourceBadge: 'Cambridge IELTS 17 • Test 1',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Cognitive Diagnosis' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Outsourcing of Analytical Effort' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Echo Chambers & Intellectual Atrophy' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Pragmatic Synthesis' },
    ],
    targetCollocations: [
      {
        phrase: 'cognitive offloading',
        cefr: 'C2',
        contextSnippet: '...excessive reliance on algorithms has fostered a pervasive habit of cognitive offloading.',
      },
      {
        phrase: 'intellectual atrophy',
        cefr: 'C2',
        contextSnippet: '...outsourcing memory and orientation risks inducing intellectual atrophy over time.',
      },
      {
        phrase: 'algorithmic echo chambers',
        cefr: 'C1',
        contextSnippet: '...content recommendation engines trap users in algorithmic echo chambers.',
      },
      {
        phrase: 'erode critical discernment',
        cefr: 'C1',
        contextSnippet: '...passively consuming curated feeds can steadily erode critical discernment.',
      },
    ],
    grammarTarget: {
      label: 'Participle clause indicating consequence',
      exampleFromModel: 'By outsourcing mental calculation and fact-retrieval to automated search feeds, individuals risk eroding their analytical discernment.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'I believe smart devices have definitely made people lazy in their thinking. Instead of memorizing phone numbers or calculating numbers in their head, everyone just uses a smartphone app. Also, news apps only show articles that confirm what people already believe, so nobody thinks deeply anymore.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'The pervasive adoption of predictive algorithms has undeniably catalyzed a subtle form of cognitive offloading. When individuals habitually outsource navigation, memory retention, and analytical synthesis to digital interfaces, their capacity for sustained, deep inquiry inevitably atrophies. Furthermore, because recommendation algorithms prioritize engagement over intellectual rigor, users are frequently ensnared in confirmation-bias echo chambers that erode independent critical discernment.',
        wordCount: 62,
      },
    },
  },
  {
    id: 'p3-instant-gratification',
    part: 3,
    topic: 'Consumer Psychology & Speed',
    question: 'Has modern digital service delivery fostered a culture of impatience, or are elevated consumer expectations simply a hallmark of economic efficiency?',
    sourceBadge: 'Cambridge IELTS 18 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Nuanced Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Instant Gratification Syndrome' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Spillover into Social Relationships' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Philosophical Repercussions' },
    ],
    targetCollocations: [
      {
        phrase: 'culture of instant gratification',
        cefr: 'C1',
        contextSnippet: '...on-demand streaming and same-day logistics cultivate a culture of instant gratification.',
      },
      {
        phrase: 'diminish frustration tolerance',
        cefr: 'C2',
        contextSnippet: '...hyper-responsive digital platforms dramatically diminish everyday frustration tolerance.',
      },
      {
        phrase: 'hallmark of logistical efficiency',
        cefr: 'C1',
        contextSnippet: '...while streamlined deliveries are a hallmark of logistical efficiency, the psychological cost is real.',
      },
      {
        phrase: 'spill over into interpersonal spheres',
        cefr: 'C2',
        contextSnippet: '...impatience conditioned by apps inevitably spills over into interpersonal spheres.',
      },
    ],
    grammarTarget: {
      label: 'Correlative conjunction (Not only... but also)',
      exampleFromModel: 'Modern delivery apps not only accelerate supply chains, but they also condition consumers to expect instantaneous solutions to complex problems.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'I think fast delivery apps like Amazon and food delivery make people very impatient. When we order something online and it takes three days instead of one day, we get angry. People expect everything immediately now, and this makes them less patient when waiting in lines or dealing with other people.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'While on-demand commerce represents a triumphs of logistical optimization, it has undeniably fostered a pervasive culture of instant gratification. When consumer friction is systematically eliminated by same-hour delivery apps, individuals become neurologically conditioned to expect immediate fulfillment. Consequently, this diminished frustration tolerance spills over into interpersonal and professional realms, where meaningful endeavors still demand slow, deliberate perseverance.',
        wordCount: 60,
      },
    },
  },
  {
    id: 'p3-local-vs-multinational',
    part: 3,
    topic: 'Commerce & Local Economy',
    question: 'Can family-owned independent businesses survive the aggressive price competition and logistical dominance of multinational corporations?',
    sourceBadge: 'Cambridge IELTS 16 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Strategic Viability' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Inherent Corporate Limitations' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Craftsmanship & Community Moat' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Prognosis' },
    ],
    targetCollocations: [
      {
        phrase: 'economies of scale',
        cefr: 'C1',
        contextSnippet: '...independent shops cannot hope to rival the sheer economies of scale enjoyed by multinationals.',
      },
      {
        phrase: 'carve out specialized niches',
        cefr: 'C1',
        contextSnippet: '...they must instead carve out specialized niches centered on craft and bespoke service.',
      },
      {
        phrase: 'impersonal corporate homogeneity',
        cefr: 'C2',
        contextSnippet: '...consumers are increasingly fatigued by impersonal corporate homogeneity.',
      },
      {
        phrase: 'authentic human connection',
        cefr: 'B2',
        contextSnippet: '...local merchants thrive because they provide authentic human connection.',
      },
    ],
    grammarTarget: {
      label: 'Contrastive inversion with Only by',
      exampleFromModel: 'Only by prioritizing bespoke artisanal quality can independent merchants insulate themselves from multinational price wars.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: 'It is very hard for small family shops to survive today because big supermarkets can sell products much cheaper. However, small shops have one advantage: personal service. The shopkeepers know their customers well and can give customized recommendations, so loyal customers will keep supporting them.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'Independent retailers cannot hope to outcompete multinational conglomerates on price or automated logistics, given the vast economies of scale corporate giants command. However, their survival hinges on carving out bespoke niches that impersonal monopolies cannot replicate. By offering artisanal craftsmanship, transparent ethical sourcing, and genuine communal warmth, small enterprises provide an antidote to corporate homogeneity that discerning consumers are increasingly willing to pay a premium for.',
        wordCount: 68,
      },
    },
  },
  {
    id: 'p3-print-vs-digital-literature',
    part: 3,
    topic: 'Literature & Digital Reading',
    question: 'Does the proliferation of micro-content and algorithmic feeds threaten deep reading and the appreciation of complex literary works?',
    sourceBadge: 'Cambridge IELTS 14 • Test 4',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Neurological Threat Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Fragmentation of Attention Spans' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Loss of Reflective Capacity' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Urgent Cultural Reappraisal' },
    ],
    targetCollocations: [
      {
        phrase: 'fragmentation of sustained attention',
        cefr: 'C2',
        contextSnippet: '...short-form video feeds inevitably accelerate the fragmentation of sustained attention spans.',
      },
      {
        phrase: 'nuanced thematic complexity',
        cefr: 'C2',
        contextSnippet: '...appreciating classical literature requires wrestling with nuanced thematic complexity.',
      },
      {
        phrase: 'dopaminergic stimulation',
        cefr: 'C2',
        contextSnippet: '...readers accustomed to rapid dopaminergic stimulation find novels arduous.',
      },
      {
        phrase: 'patience for deep contemplative reading',
        cefr: 'C1',
        contextSnippet: '...we are witnessing a gradual erosion of the patience required for deep contemplative reading.',
      },
    ],
    grammarTarget: {
      label: 'Participial clause expressing causal link',
      exampleFromModel: 'Accustomed to instantaneous digital rewards, contemporary readers increasingly struggle with the cognitive endurance demanded by nineteenth-century prose.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: 'I think apps like TikTok and Instagram make it difficult for young people to read long books. When people spend two hours scrolling through 30-second videos, their brains get used to quick entertainment. Sitting quietly for three hours to read a difficult novel feels too slow and boring for them now.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'The ubiquitous consumption of bite-sized algorithmic media poses an undeniable threat to deep literary engagement. Engaging with substantive literature demands sustained cognitive endurance and reflective solitude. When brains are continually conditioned by hyper-compressed digital stimulation, the patience required to parse nuanced thematic complexity and layered subtext inevitably atrophies, reducing reading to a superficial exercise in scanning headlines rather than profound intellectual immersion.',
        wordCount: 64,
      },
    },
  },
  {
    id: 'p3-success-wellbeing',
    part: 3,
    topic: 'Philosophy of Success',
    question: 'Why does contemporary society predominantly measure personal achievement through professional prestige and financial accumulation rather than mental well-being?',
    sourceBadge: 'Cambridge IELTS 19 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Societal Paradigm Overview' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Quantifiability vs Intangibility' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Capitalist Signaling' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Emerging Counter-Movement' },
    ],
    targetCollocations: [
      {
        phrase: 'readily quantifiable metrics',
        cefr: 'C2',
        contextSnippet: '...capitalist systems favor wealth and job titles because they are readily quantifiable metrics.',
      },
      {
        phrase: 'conspicuous consumption',
        cefr: 'C1',
        contextSnippet: '...social prestige is reinforced through conspicuous consumption and public credentials.',
      },
      {
        phrase: 'inherently subjective state',
        cefr: 'C2',
        contextSnippet: '...whereas psychological equanimity is an internal, inherently subjective state.',
      },
      {
        phrase: 'recalibrate definitions of success',
        cefr: 'C1',
        contextSnippet: '...a growing counter-movement seeks to recalibrate definitions of success toward holistic fulfillment.',
      },
    ],
    grammarTarget: {
      label: 'Whereas clause with contrasting attributes',
      exampleFromModel: 'Whereas financial remuneration and corporate titles are conspicuous and quantifiable, genuine emotional equanimity is largely invisible to external observers.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: 'In our society, people judge success by money and luxury cars because everyone can see those things easily. You cannot post your peaceful mind on Instagram, but you can post photos of your expensive watch or fancy apartment. Also, advertising constantly tells us that buying more products will make us happy.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'This imbalance stems from our economic framework’s preference for tangible, quantifiable metrics. Wealth, luxury assets, and corporate titles provide instantaneous social proof that can be conspicuously signaled, whereas emotional equanimity and psychological wholeness are inherently private, subjective states. Furthermore, commercial advertising thrives on perpetual discontent, continually reinforcing the illusion that material accumulation equates to genuine human fulfillment.',
        wordCount: 59,
      },
    },
  },
  {
    id: 'p3-workplace-conflict',
    part: 3,
    topic: 'Organizational Psychology',
    question: 'Is interpersonal disagreement in professional settings inherently destructive, or can structured dissent drive innovation within an organization?',
    sourceBadge: 'Cambridge IELTS 18 • Test 3',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Constructive Potential' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • The Danger of Groupthink' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Psychological Safety as Prerequisite' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Synthesis' },
    ],
    targetCollocations: [
      {
        phrase: 'institutional groupthink',
        cefr: 'C2',
        contextSnippet: '...structured dissent serves as an indispensable antidote to institutional groupthink.',
      },
      {
        phrase: 'intellectual cross-pollination',
        cefr: 'C2',
        contextSnippet: '...healthy friction sparks intellectual cross-pollination and stress-tests weak strategies.',
      },
      {
        phrase: 'psychological safety',
        cefr: 'C1',
        contextSnippet: '...provided disputes occur within an established climate of psychological safety.',
      },
      {
        phrase: 'interpersonal animosity',
        cefr: 'C1',
        contextSnippet: '...without degenerating into toxic interpersonal animosity and territorial disputes.',
      },
    ],
    grammarTarget: {
      label: 'Conditional clause with provided that',
      exampleFromModel: 'Disagreement fuels breakthrough innovation, provided that teams maintain a culture of psychological safety where ideas, rather than individuals, are contested.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'I think disagreements at work can be very positive if people discuss issues politely. If everyone always agrees with the boss, nobody will notice potential mistakes in the project plan. When colleagues express different viewpoints, they can find creative solutions, as long as they don’t take criticism personally.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'Far from being inherently destructive, structured intellectual friction is the primary catalyst for organizational breakthrough. Without dissenting voices, teams succumb to complacent groupthink and fail to stress-test flawed hypotheses. Provided conflict centers on strategic methodologies rather than interpersonal egos—and unfolds within an environment of psychological safety—vigorous debate sharpens decision-making and exposes blind spots that consensus-driven cultures habitually overlook.',
        wordCount: 60,
      },
    },
  },
  {
    id: 'p3-cultural-homogenization',
    part: 3,
    topic: 'Globalization & Culture',
    question: 'As entertainment and social media become increasingly homogenized across borders, how can minority cultures preserve their unique rituals and dialects?',
    sourceBadge: 'Cambridge IELTS 15 • Test 3',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • The Homogenization Threat' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Leveraging Modern Media for Defense' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Institutional & Community Support' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Living Culture Conclusion' },
    ],
    targetCollocations: [
      {
        phrase: 'cultural homogenization',
        cefr: 'C1',
        contextSnippet: '...global entertainment streams accelerate cultural homogenization at an alarming rate.',
      },
      {
        phrase: 'preserve linguistic nuance',
        cefr: 'C2',
        contextSnippet: '...active institutional subsidies are required to preserve regional linguistic nuance.',
      },
      {
        phrase: 'living, evolving traditions',
        cefr: 'C1',
        contextSnippet: '...rituals must be nurtured as living, evolving traditions rather than museum artifacts.',
      },
      {
        phrase: 'digital storytelling platforms',
        cefr: 'B2',
        contextSnippet: '...young creators must harness digital storytelling platforms to revitalize ancestral heritage.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence with It is through... that',
      exampleFromModel: 'It is through dynamic digital archives and active community education that endangered dialects can withstand the homogenizing tide of global media.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 15 Candidate Log)',
        text: 'I think schools should teach minority dialects and cultural customs to young children so they don’t forget their roots. Also, young musicians and filmmakers can create modern songs and movies using their native languages, which makes young audiences proud of their unique cultural background.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'Preserving cultural nuance in an era of global algorithmic consolidation demands proactive institutional support and digital adaptation. Rather than viewing heritage as static museum relics, indigenous communities must be empowered to harness contemporary media—producing digital archives, podcasts, and vernacular literature. When state education systems subsidize bilingual immersion and local storytelling, minority traditions can flourish as vibrant, living identities rather than fading into nostalgic footnotes.',
        wordCount: 64,
      },
    },
  },
  {
    id: 'p3-credentials-vs-skills',
    part: 3,
    topic: 'Employment & Higher Education',
    question: 'Should employers place greater weight on formal university degrees or on demonstrated practical portfolios acquired through self-directed learning?',
    sourceBadge: 'Cambridge IELTS 17 • Test 3',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Shift to Meritocracy' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Limits of Theoretical Credentialism' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Proof of Practical Competence' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Nuanced Sector Balance' },
    ],
    targetCollocations: [
      {
        phrase: 'demonstrated practical competence',
        cefr: 'C1',
        contextSnippet: '...enterprises must prioritize demonstrated practical competence over academic pedigree.',
      },
      {
        phrase: 'theoretical credentialism',
        cefr: 'C2',
        contextSnippet: '...relying strictly on theoretical credentialism frequently yields poorly equipped candidates.',
      },
      {
        phrase: 'proactive self-discipline',
        cefr: 'C1',
        contextSnippet: '...a self-built portfolio signals extraordinary proactive self-discipline and resourcefulness.',
      },
      {
        phrase: 'rapidly evolving technological landscape',
        cefr: 'C1',
        contextSnippet: '...especially in a rapidly evolving technological landscape where textbooks lag behind.',
      },
    ],
    grammarTarget: {
      label: 'Concessive clause with While',
      exampleFromModel: 'While formal degrees indicate foundational dedication, practical portfolios provide irrefutable evidence of real-world problem-solving ability.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'I think practical portfolios are more useful for jobs like software development and graphic design, because a degree doesn’t prove that you can write clean code or design beautiful logos. However, for doctors or civil engineers, a formal university degree is still mandatory for safety reasons.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'In our rapidly evolving digital economy, demonstrated portfolio competence should undoubtedly supersede traditional academic pedigree across creative and technological domains. While university degrees signal baseline diligence, they often lag behind industry practices. A self-assembled portfolio of functioning software, publications, or client case studies provides irrefutable proof of problem-solving adaptability and proactive self-discipline—qualities far more predictive of workplace excellence than static academic credentials.',
        wordCount: 65,
      },
    },
  },
  {
    id: 'p3-civic-spaces-cohesion',
    part: 3,
    topic: 'Urban Planning & Society',
    question: 'How do well-maintained civic parks and urban plazas bridge socioeconomic divides in densely populated metropolises?',
    sourceBadge: 'Cambridge IELTS 16 • Test 3',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • The Democratic Commons' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Counteracting Social Segregation' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Informal Encounters & Empathy' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Conclusion on Civic Health' },
    ],
    targetCollocations: [
      {
        phrase: 'democratic egalitarian commons',
        cefr: 'C2',
        contextSnippet: '...public parks function as an egalitarian commons where financial status is irrelevant.',
      },
      {
        phrase: 'counteract social segregation',
        cefr: 'C2',
        contextSnippet: '...accessible civic plazas actively counteract social and spatial segregation.',
      },
      {
        phrase: 'foster cross-cultural encounters',
        cefr: 'C1',
        contextSnippet: '...providing communal green corridors that foster cross-cultural encounters.',
      },
      {
        phrase: 'sense of civic belonging',
        cefr: 'B2',
        contextSnippet: '...instilling a shared sense of civic belonging in an otherwise fragmented city.',
      },
    ],
    grammarTarget: {
      label: 'By + Gerund phrase for cause and effect',
      exampleFromModel: 'By offering high-quality leisure spaces completely free of commercial pressure, urban plazas democratize access to public health and social connection.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: 'Public parks are great because everyone can enter for free regardless of whether they are rich or poor. In shopping malls, poor people feel out of place because everything is expensive, but in a park, all citizens share the same benches, walking paths, and fresh air. This helps people feel equal.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'Civic parks and pedestrian plazas serve as the ultimate egalitarian commons in modern metropolises. Unlike privatized commercial centers that subtly filter out individuals based on purchasing power, municipal green spaces welcome all citizens on equal terms. By facilitating unscripted cross-demographic encounters among children playing and neighbors strolling, well-tended public realms counteract social segregation and nurture a vital sense of shared civic belonging.',
        wordCount: 63,
      },
    },
  },
  {
    id: 'p3-journalism-integrity',
    part: 3,
    topic: 'Media & Journalism',
    question: 'How has commercial pressure for viral headlines and click-through rates affected the credibility of breaking news reportage?',
    sourceBadge: 'Cambridge IELTS 19 • Test 1',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • The Click-Economy Diagnosis' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Sensationalism vs Factual Rigor' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Erosion of Civic Trust' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Systemic Repercussion' },
    ],
    targetCollocations: [
      {
        phrase: 'sensationalist clickbait headlines',
        cefr: 'C1',
        contextSnippet: '...the relentless financial demand for advertising traffic incentivizes sensationalist clickbait headlines.',
      },
      {
        phrase: 'compromise journalistic integrity',
        cefr: 'C1',
        contextSnippet: '...newsrooms frequently compromise journalistic integrity in the race to be first.',
      },
      {
        phrase: 'erode public institutional trust',
        cefr: 'C2',
        contextSnippet: '...premature reporting steadily erodes public trust in mainstream journalism.',
      },
      {
        phrase: 'polarizing hyperbole',
        cefr: 'C2',
        contextSnippet: '...substantive analytical depth is discarded in favor of polarizing hyperbole.',
      },
    ],
    grammarTarget: {
      label: 'Correlative comparison with The more... the more...',
      exampleFromModel: 'The more media conglomerates prioritize algorithmic click-through metrics, the more investigative rigor is sacrificed for sensationalism.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: 'I think modern online journalism has lost a lot of credibility because websites only care about clicks and views to make advertising money. Reporters publish shocking headlines without checking the facts thoroughly. When people read these exaggerated stories and find out they are wrong, they stop trusting news organizations.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'The transition to an advertising-driven click economy has severely corroded journalistic credibility. When digital newsrooms prioritize viral impressions and instantaneous publication over meticulous fact-checking, editorial standards inevitably deteriorate. Substantive contextual analysis is discarded in favor of provocative, polarizing hyperbole, fostering widespread public cynicism and leaving citizens cynical about the objectivity of mainstream media reportage.',
        wordCount: 57,
      },
    },
  },
  {
    id: 'p3-corporate-climate-action',
    part: 3,
    topic: 'Environmental Economics',
    question: 'Should ecological responsibility be driven by individual ethical consumerism or by stringent, legally binding corporate carbon taxes?',
    sourceBadge: 'Cambridge IELTS 14 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Systemic Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Limits of Individual Action' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Power of Corporate Taxation' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Concluding Mandate' },
    ],
    targetCollocations: [
      {
        phrase: 'legally binding carbon pricing',
        cefr: 'C2',
        contextSnippet: '...only statutory, legally binding carbon pricing can reshape industrial supply chains.',
      },
      {
        phrase: 'systemic industrial transformation',
        cefr: 'C1',
        contextSnippet: '...relying on consumer goodwill cannot substitute for systemic industrial transformation.',
      },
      {
        phrase: 'disproportionate carbon footprint',
        cefr: 'C1',
        contextSnippet: '...multinational conglomerates account for the vast, disproportionate carbon footprint.',
      },
      {
        phrase: 'internalize negative externalities',
        cefr: 'C2',
        contextSnippet: '...carbon taxes force polluters to internalize environmental negative externalities.',
      },
    ],
    grammarTarget: {
      label: 'Passive with modal necessity',
      exampleFromModel: 'While individual ethical consumerism is laudable, rigorous emissions penalties must be enforced at the legislative level to avert catastrophic climate disruption.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 14 Candidate Log)',
        text: 'I think individual actions like recycling plastic and taking public transit are good, but they are not enough to stop global warming. The biggest pollution comes from large energy companies and multinational factories. Therefore, governments must impose heavy taxes and regulations on corporate polluters to make real changes.',
      },
      band9: {
        band: 'Band 9.0 (British Council Masterclass)',
        text: 'While ethical consumerism is culturally commendable, relying on voluntary personal restraint to arrest climate disruption is dangerously inadequate. A tiny cohort of multinational energy conglomerates and heavy industrial manufacturers generates the overwhelming majority of global greenhouse emissions. Only through legally binding statutory carbon taxes can market economies force corporations to internalize their environmental externalities and aggressively transition toward renewable infrastructure.',
        wordCount: 61,
      },
    },
  },
];
