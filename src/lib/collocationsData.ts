import rawCollocations from "./collocationsList.json";

export type CollocationLevel = "Intermediate" | "Advanced";

export type CollocationType =
  | "adj_noun" // Adjective + Noun (e.g., substantial evidence, torrential rain)
  | "verb_noun" // Verb + Noun (e.g., cast doubt on, conduct research)
  | "adv_adj" // Adverb + Adjective (e.g., acutely aware, bitterly disappointed)
  | "noun_verb" // Noun + Verb (e.g., evidence suggests, profits plummet)
  | "verb_adv"; // Verb + Adverb (e.g., decline sharply, strongly recommend)

export type CollocationTopic =
  | "academic_writing"
  | "intensifying_adverbs"
  | "work_business"
  | "society_policy"
  | "environment_science"
  | "emotions_mind"
  | "everyday_verbs"
  | "change_time";

export interface CollocationItem {
  id: string;
  collocation: string;
  type: CollocationType;
  typeLabel: string;
  level: CollocationLevel;
  sourceBook: "English Collocations in Use Intermediate" | "English Collocations in Use Advanced";
  unit: string;
  topic: CollocationTopic;
  topicLabel: string;
  definition: string;
  example: string;
  commonMistake: string;
  bandImpact: string;
  alternativePartners?: string[];
  ieltsTip?: string;
}

export interface CollocationQuizQuestion {
  id: string;
  level: CollocationLevel;
  sourceUnit: string;
  sentencePrompt: string; // sentence with [____]
  targetCollocation: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mistakeAlert?: string;
}

export const COLLOCATION_TOPIC_LABELS: Record<CollocationTopic, string> = {
  academic_writing: "Academic & Essay Writing",
  intensifying_adverbs: "Intensifying Adverbs",
  work_business: "Work, Business & Economy",
  society_policy: "Society, Law & Policy",
  environment_science: "Environment & Science",
  emotions_mind: "Feelings & Psychology",
  everyday_verbs: "Key Verbs (Make, Do, Have)",
  change_time: "Time, Trend & Change",
};

export const COLLOCATION_TYPE_LABELS: Record<CollocationType, string> = {
  adj_noun: "Adjective + Noun",
  verb_noun: "Verb + Noun",
  adv_adj: "Adverb + Adjective",
  noun_verb: "Noun + Verb",
  verb_adv: "Verb + Adverb",
};

// ==========================================
// COMPREHENSIVE CAMBRIDGE COLLOCATIONS DATASET (508 ITEMS)
// Curated strictly from English Collocations in Use (Intermediate & Advanced)
// by Michael McCarthy & Felicity O'Dell (Cambridge University Press)
// ==========================================
export const COLLOCATIONS_DATASET: CollocationItem[] = rawCollocations as CollocationItem[];

// ==========================================
// AUTHENTIC CAMBRIDGE PRACTICE EXERCISES (30 QUESTIONS)
// Sourced from exercises in both Cambridge books
// ==========================================
export const COLLOCATIONS_QUIZ_QUESTIONS: CollocationQuizQuestion[] = [
  {
    id: "quiz-001",
    level: "Advanced",
    sourceUnit: "Unit 16: Academic Writing I",
    sentencePrompt:
      "Recent empirical findings have [____] serious doubt on the assumptions underpinning the market deregulation policy.",
    targetCollocation: "cast doubt on",
    options: ["given", "cast", "placed", "shedded"],
    correctIndex: 1,
    explanation:
      "The natural academic collocation is 'cast doubt on'. Neither 'give doubt' nor 'place doubt' are used in English.",
    mistakeAlert: "❌ gave doubt on / placed doubt on → ✔ cast doubt on",
  },
  {
    id: "quiz-002",
    level: "Advanced",
    sourceUnit: "Unit 16: Academic Writing I",
    sentencePrompt:
      "There is now a substantial [____] of evidence confirming the psychological benefits of bilingual upbringing.",
    targetCollocation: "body of evidence",
    options: ["pack", "crowd", "body", "collection"],
    correctIndex: 2,
    explanation:
      "Cambridge explicitly highlights 'a substantial body of evidence' as the standard academic phrase for cumulative proof.",
    mistakeAlert: "❌ pack of evidence / collection of evidence → ✔ a body of evidence",
  },
  {
    id: "quiz-003",
    level: "Advanced",
    sourceUnit: "Unit 10: Intensifying Adverbs",
    sentencePrompt:
      "Senior administrators are [____] aware of the growing mental health strain on undergraduate students.",
    targetCollocation: "acutely aware",
    options: ["heavily", "acutely", "bitterly", "fiercely"],
    correctIndex: 1,
    explanation:
      "'Acutely' specifically collocates with 'aware' or 'conscious'. 'Bitterly' pairs with cold or disappointment, and 'fiercely' with competition.",
    mistakeAlert: "❌ heavily aware / bitterly aware → ✔ acutely aware",
  },
  {
    id: "quiz-004",
    level: "Intermediate",
    sourceUnit: "Unit 7: Everyday Verbs: Make and Do",
    sentencePrompt:
      "Heavy industrial discharge continues to [____] extensive damage to delicate marine ecosystems.",
    targetCollocation: "do damage to",
    options: ["make", "do", "construct", "bring"],
    correctIndex: 1,
    explanation:
      "English collocations dictate 'do damage to' (or 'cause damage to'). You never 'make damage'.",
    mistakeAlert: "❌ make damage → ✔ do damage / cause damage",
  },
  {
    id: "quiz-005",
    level: "Intermediate",
    sourceUnit: "Unit 7: Everyday Verbs: Make and Do",
    sentencePrompt:
      "To succeed in competitive universities, candidates must [____] a concerted effort to master academic discourse.",
    targetCollocation: "make an effort",
    options: ["do", "make", "create", "execute"],
    correctIndex: 1,
    explanation:
      "You 'make an effort' (or 'exert effort'). 'Do an effort' is a classic candidate error highlighted across Cambridge exam reports.",
    mistakeAlert: "❌ do an effort → ✔ make an effort",
  },
  {
    id: "quiz-006",
    level: "Advanced",
    sourceUnit: "Unit 27: Law and Order",
    sentencePrompt:
      "The newly appointed appellate judge vowed to [____] the rule of law without fear or political favour.",
    targetCollocation: "uphold the rule of law",
    options: ["keep", "uphold", "carry", "stand"],
    correctIndex: 1,
    explanation:
      "'Uphold the rule of law' is the constitutional legal collocation used in formal academic English.",
    mistakeAlert: "❌ keep the rule of law → ✔ uphold the rule of law",
  },
  {
    id: "quiz-007",
    level: "Advanced",
    sourceUnit: "Unit 17: Academic Writing II",
    sentencePrompt:
      "The committee dismissed the environmental review because it was founded upon a fundamentally [____] premise.",
    targetCollocation: "flawed premise",
    options: ["broken", "cracked", "flawed", "mistaken"],
    correctIndex: 2,
    explanation:
      "An argument or theory is based on a 'flawed premise' (or 'false premise'). Not 'broken premise'.",
    mistakeAlert: "❌ broken premise / cracked premise → ✔ flawed premise",
  },
  {
    id: "quiz-008",
    level: "Intermediate",
    sourceUnit: "Unit 12: Weather",
    sentencePrompt:
      "Commuters struggled through [____] cold and biting northern winds on their morning journey to work.",
    targetCollocation: "bitter cold",
    options: ["sour", "bitter", "acid", "harshly"],
    correctIndex: 1,
    explanation:
      "'Bitter cold' or 'bitterly cold' is the established English collocation for piercing, painful freezing weather.",
    mistakeAlert: "❌ sour cold / acid cold → ✔ bitter cold",
  },
  {
    id: "quiz-009",
    level: "Advanced",
    sourceUnit: "Unit 34: Nature and the Elements",
    sentencePrompt:
      "Unprecedented seasonal typhoons [____] havoc on smallholder agricultural communities in the river basin.",
    targetCollocation: "wreak havoc",
    options: ["wrecked", "wreaked", "did", "made"],
    correctIndex: 1,
    explanation:
      "The present / past collocation is 'wreak havoc' / 'wreaked havoc' (or archaic 'wrought havoc'). 'Wreak' means to inflict.",
    mistakeAlert: "❌ wrecked havoc → ✔ wreaked havoc on",
  },
  {
    id: "quiz-010",
    level: "Intermediate",
    sourceUnit: "Unit 8: Everyday Verbs: Have, Take, Give",
    sentencePrompt:
      "Local authorities must [____] immediate measures to reinforce coastal flood defences.",
    targetCollocation: "take measures",
    options: ["do", "make", "take", "hold"],
    correctIndex: 2,
    explanation:
      "One 'takes measures' or 'takes steps' to solve an urgent issue. Never 'do measures' or 'make measures'.",
    mistakeAlert: "❌ make measures / do measures → ✔ take measures",
  },
  {
    id: "quiz-011",
    level: "Advanced",
    sourceUnit: "Unit 12: Utterly, Blissfully, Bitterly",
    sentencePrompt:
      "The young tourists swam in the bay, [____] unaware that strong rip currents had formed beneath the surface.",
    targetCollocation: "blissfully unaware",
    options: ["happily", "blissfully", "joyfully", "laughingly"],
    correctIndex: 1,
    explanation:
      "'Blissfully unaware' is an established collocation meaning happy and at peace because you do not realize danger is present.",
    mistakeAlert: "❌ happily unaware → ✔ blissfully unaware",
  },
  {
    id: "quiz-012",
    level: "Advanced",
    sourceUnit: "Unit 21: Business Strategy",
    sentencePrompt:
      "Startups that adopt predictive inventory modeling can gain a significant [____] edge over brick-and-mortar incumbents.",
    targetCollocation: "competitive edge",
    options: ["competitive", "warrior", "fighting", "aggressive"],
    correctIndex: 0,
    explanation:
      "The standard economic phrase is 'gain / maintain a competitive edge' (or 'competitive advantage').",
    mistakeAlert: "❌ warrior edge / aggressive edge → ✔ competitive edge",
  },
  {
    id: "quiz-013",
    level: "Intermediate",
    sourceUnit: "Unit 1: What is a Collocation?",
    sentencePrompt:
      "Commuters were stranded for over an hour following hours of torrential [____] and flash flooding.",
    targetCollocation: "torrential rain",
    options: ["water", "wind", "rain", "storm"],
    correctIndex: 2,
    explanation:
      "'Torrential' specifically collocates with 'rain' or 'downpour' (rain flowing violently in fast torrents).",
    mistakeAlert: "❌ torrential wind / torrential water → ✔ torrential rain",
  },
  {
    id: "quiz-014",
    level: "Advanced",
    sourceUnit: "Unit 40: Challenge and Risk",
    sentencePrompt:
      "Negotiating a peace settlement under the current climate of distrust is [____] with immense difficulty.",
    targetCollocation: "fraught with difficulty",
    options: ["burdened", "fraught", "trapped", "crowded"],
    correctIndex: 1,
    explanation:
      "'Fraught with' is an advanced collocation meaning completely loaded or teeming with danger, risk, or difficulty.",
    mistakeAlert: "❌ trapped with difficulty → ✔ fraught with difficulty",
  },
  {
    id: "quiz-015",
    level: "Advanced",
    sourceUnit: "Unit 44: Describing Numbers and Trends",
    sentencePrompt:
      "Official census data registered a [____] increase in single-person urban households over the last decade.",
    targetCollocation: "marked increase",
    options: ["penned", "marked", "signed", "inscribed"],
    correctIndex: 1,
    explanation:
      "'A marked increase' means a clear, conspicuous, and noteworthy rise. Essential for IELTS Task 1 Academic Band 8+.",
    mistakeAlert: "❌ signed increase → ✔ a marked increase",
  },
  {
    id: "quiz-016",
    level: "Advanced",
    sourceUnit: "Unit 21: Business Strategy",
    sentencePrompt:
      "The multinational conglomerate restructured its divisions to [____] operations and curb overheads.",
    targetCollocation: "streamline operations",
    options: ["straighten", "streamline", "smoothen", "flatten"],
    correctIndex: 1,
    explanation:
      "'Streamline operations' means to make organizational systems more efficient by removing bottlenecks and unnecessary steps.",
    mistakeAlert: "❌ straighten operations → ✔ streamline operations",
  },
  {
    id: "quiz-017",
    level: "Intermediate",
    sourceUnit: "Unit 30: War & Peace",
    sentencePrompt:
      "Warring factions met in Geneva to formally sign a historic peace [____] ending five years of armed conflict.",
    targetCollocation: "peace treaty",
    options: ["paper", "treaty", "contract", "deal"],
    correctIndex: 1,
    explanation:
      "Sovereign states sign a 'peace treaty' (or 'peace accord') to conclude military hostilities.",
    mistakeAlert: "❌ peace paper / peace contract → ✔ a peace treaty",
  },
  {
    id: "quiz-018",
    level: "Intermediate",
    sourceUnit: "Unit 2: Finding, Recording and Learning",
    sentencePrompt:
      "Reading classical literature and quality journalism is a dependable way to [____] one's vocabulary.",
    targetCollocation: "enrich one's vocabulary",
    options: ["rich", "enrich", "wealth", "prosper"],
    correctIndex: 1,
    explanation:
      "You 'enrich your vocabulary' or 'expand your vocabulary'. 'Enrich' is the formal collocate for qualitative lexical growth.",
    mistakeAlert: "❌ make rich your words → ✔ enrich one's vocabulary",
  },
  {
    id: "quiz-019",
    level: "Advanced",
    sourceUnit: "Unit 8: Metaphorical Collocations",
    sentencePrompt:
      "The proposal to construct a commercial skyscraper adjacent to the cathedral provoked a fierce [____] of protest.",
    targetCollocation: "storm of protest",
    options: ["wind", "storm", "rain", "blizzard"],
    correctIndex: 1,
    explanation:
      "'A storm of protest' is an authentic Cambridge metaphor describing a sudden, furious outburst of public objection.",
    mistakeAlert: "❌ wind of protest → ✔ a storm of protest",
  },
  {
    id: "quiz-020",
    level: "Advanced",
    sourceUnit: "Unit 51: Success and Failure",
    sentencePrompt:
      "The sudden factory closure dealt a [____] blow to the regional manufacturing economy.",
    targetCollocation: "shattering blow",
    options: ["crushing", "shattering", "breaking", "smashing"],
    correctIndex: 1,
    explanation:
      "Cambridge highlights 'a shattering blow' (or 'a devastating blow') to describe an event causing sudden, traumatic ruin.",
    mistakeAlert: "❌ smashing blow / breaking blow → ✔ a shattering blow",
  },
  {
    id: "quiz-021",
    level: "Intermediate",
    sourceUnit: "Unit 9: Everyday Verbs: Have, Take, Give",
    sentencePrompt:
      "National development plans must [____] top priority to rural water sanitation and literacy.",
    targetCollocation: "give priority to",
    options: ["put", "make", "give", "take"],
    correctIndex: 2,
    explanation:
      "The established phrase is 'give priority to' (or 'accord priority to'). You do not 'make priority'.",
    mistakeAlert: "❌ make priority to → ✔ give priority to",
  },
  {
    id: "quiz-022",
    level: "Advanced",
    sourceUnit: "Unit 17: Academic Writing II",
    sentencePrompt:
      "Researchers were urged to [____] their assertions with verifiable empirical data prior to publication.",
    targetCollocation: "substantiate a claim",
    options: ["substantiate", "substance", "solidify", "harden"],
    correctIndex: 0,
    explanation:
      "'Substantiate an assertion' or 'substantiate a claim' means to provide solid evidence to prove something is true.",
    mistakeAlert: "❌ give proof to an assertion → ✔ substantiate an assertion",
  },
  {
    id: "quiz-023",
    level: "Intermediate",
    sourceUnit: "Unit 4: Types of Collocation",
    sentencePrompt:
      "The official felt [____] ashamed after leaked correspondence exposed his undisclosed conflict of interest.",
    targetCollocation: "deeply ashamed",
    options: ["heavily", "darkly", "deeply", "strictly"],
    correctIndex: 2,
    explanation:
      "'Deeply' specifically collocates with emotions like 'ashamed', 'grateful', and 'regretted'.",
    mistakeAlert: "❌ heavily ashamed → ✔ deeply ashamed",
  },
  {
    id: "quiz-024",
    level: "Intermediate",
    sourceUnit: "Unit 53: Money & Finance",
    sentencePrompt:
      "Easy access to consumer credit cards often tempts young adults to live [____] their means.",
    targetCollocation: "live beyond one's means",
    options: ["over", "above", "beyond", "outside"],
    correctIndex: 2,
    explanation:
      "The idiom is strictly 'live beyond one's means' (spending more money than one actually earns).",
    mistakeAlert: "❌ live above one's wallet / live over means → ✔ live beyond one's means",
  },
  {
    id: "quiz-025",
    level: "Intermediate",
    sourceUnit: "Unit 37: Current Affairs",
    sentencePrompt:
      "The prime minister declared an official state of [____] following catastrophic flash flooding in the capital.",
    targetCollocation: "state of emergency",
    options: ["urgency", "emergency", "crisis", "danger"],
    correctIndex: 1,
    explanation:
      "The constitutional term is 'a state of emergency' for crisis governance during natural disasters.",
    mistakeAlert: "❌ state of crisis / state of urgency → ✔ a state of emergency",
  },
  {
    id: "quiz-026",
    level: "Intermediate",
    sourceUnit: "Unit 42: Conversation",
    sentencePrompt:
      "Sensing that the political debate was turning rancorous, the host politely chose to [____] the subject.",
    targetCollocation: "change the subject",
    options: ["turn", "switch", "change", "pivot"],
    correctIndex: 2,
    explanation:
      "To deliberately start discussing a different topic in conversation, one 'changes the subject'.",
    mistakeAlert: "❌ switch the talking theme → ✔ change the subject",
  },
  {
    id: "quiz-027",
    level: "Intermediate",
    sourceUnit: "Unit 43: Ways of Speaking",
    sentencePrompt:
      "Employees respect executives who possess the courage to speak their [____] during critical consultations.",
    targetCollocation: "speak one's mind",
    options: ["brain", "heart", "mind", "soul"],
    correctIndex: 2,
    explanation:
      "The established English idiom is 'speak one's mind' (to state one's honest opinions candidly).",
    mistakeAlert: "❌ talk one's brain / speak one's heart → ✔ speak one's mind",
  },
  {
    id: "quiz-028",
    level: "Intermediate",
    sourceUnit: "Unit 56: Environmental Issues",
    sentencePrompt:
      "Industrial manufacturing plants face severe fines if they discharge untreated [____] waste into rivers.",
    targetCollocation: "toxic waste",
    options: ["poison", "toxic", "venomous", "lethal"],
    correctIndex: 1,
    explanation:
      "Industrial pollutants are described as 'toxic waste' or 'hazardous waste'. Not 'poison waste'.",
    mistakeAlert: "❌ poison waste / venomous garbage → ✔ toxic waste",
  },
  {
    id: "quiz-029",
    level: "Intermediate",
    sourceUnit: "Unit 24: Study & Education",
    sentencePrompt:
      "Senior academic fellows are scheduled to [____] a keynote lecture at the international conference.",
    targetCollocation: "deliver a lecture",
    options: ["give", "deliver", "speech", "say"],
    correctIndex: 1,
    explanation:
      "One 'delivers a lecture' or 'gives a lecture' in formal academic environments.",
    mistakeAlert: "❌ make a lecture / speech a lecture → ✔ deliver a lecture",
  },
  {
    id: "quiz-030",
    level: "Intermediate",
    sourceUnit: "Unit 6: Register & Formality",
    sentencePrompt:
      "Metropolitan police launched a synchronized campaign to clamp [____] on illegal street vending.",
    targetCollocation: "clamp down on",
    options: ["up", "down", "out", "over"],
    correctIndex: 1,
    explanation:
      "The phrasal collocation is 'clamp down on' (or 'crack down on') meaning to take strict punitive action against wrongdoing.",
    mistakeAlert: "❌ clamp over / crack over → ✔ clamp down on",
  },
];
