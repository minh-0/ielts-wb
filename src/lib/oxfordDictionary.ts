import { OXFORD_VOCAB_LIST, OxfordVocabItem } from "./oxfordVocabData";
import collocationsRaw from "./collocationsList.json";
import { WRITING_PROMPTS } from "./ieltsPromptBank";

export interface OxfordDictionaryEntry {
  word: string;
  matchedQuery?: string;
  phonetic: string;
  partOfSpeech: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  sourceList?: string;
  definition: string;
  additionalDefinitions?: { pos: string; definition: string }[];
  example: string;
  collocations: string[];
  oxfordUrl: string;
  needsLiveEnrichment?: boolean;
}

interface CollocationRecord {
  id: string;
  collocation: string;
  type: string;
  typeLabel: string;
  level: string;
  sourceBook?: string;
  definition: string;
  example: string;
  bandImpact?: string;
  alternativePartners?: string[];
}

const COLLOCATION_RECORDS = collocationsRaw as CollocationRecord[];

export const OXFORD_ACADEMIC_DICTIONARY: Record<string, OxfordDictionaryEntry> = {
  paramount: {
    word: "paramount",
    phonetic: "/ˈpærəmaʊnt/",
    partOfSpeech: "adjective",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "More important than anything else; having supreme rank or supreme significance.",
    example: "The safety of public health is of paramount importance during a global crisis.",
    collocations: ["of paramount importance", "paramount concern", "paramount priority"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/paramount",
  },
  predicament: {
    word: "predicament",
    phonetic: "/prɪˈdɪkəmənt/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "A difficult, unpleasant, or perplexing situation which is hard to escape.",
    example: "Young graduates often find themselves in an acute financial predicament upon finishing university.",
    collocations: ["acute predicament", "financial predicament", "escape a predicament"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/predicament",
  },
  formidable: {
    word: "formidable",
    phonetic: "/ˈfɔːmɪdəbl/",
    partOfSpeech: "adjective",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "Inspiring respect or wonder through being impressively large, powerful, or intense.",
    example: "Developing clean renewable energy remains a formidable challenge for industrial economies.",
    collocations: ["formidable challenge", "formidable impediment", "formidable task"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/formidable",
  },
  impediment: {
    word: "impediment",
    phonetic: "/ɪmˈpedɪmənt/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Something that delays or stops the progress of something; an obstacle or hindrance.",
    example: "A lack of capital continues to act as a serious impediment to technological innovation.",
    collocations: ["serious impediment", "impediment to growth", "remove impediments"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/impediment",
  },
  drudgery: {
    word: "drudgery",
    phonetic: "/ˈdrʌdʒəri/",
    partOfSpeech: "noun",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "Hard, boring work that has to be repeated without intellectual stimulation.",
    example: "Automated systems emancipate factory workers from tedious routine drudgery.",
    collocations: ["routine drudgery", "domestic drudgery", "escape the drudgery"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/drudgery",
  },
  synergy: {
    word: "synergy",
    phonetic: "/ˈsɪnədʒi/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "The extra energy, power, or success that is achieved by two or more people or organizations working together.",
    example: "International research teams foster synergistic cooperation across biological sciences.",
    collocations: ["scientific synergy", "productive synergy", "create synergy"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/synergy",
  },
  exacerbate: {
    word: "exacerbate",
    phonetic: "/ɪɡˈzæsəbeɪt/",
    partOfSpeech: "verb",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "To make something that is already bad or unpleasant even worse.",
    example: "Unplanned urbanization will exacerbate existing socioeconomic inequalities.",
    collocations: ["exacerbate the problem", "exacerbate disparities", "exacerbate tensions"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/exacerbate",
  },
  mitigate: {
    word: "mitigate",
    phonetic: "/ˈmɪtɪɡeɪt/",
    partOfSpeech: "verb",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "To make something less harmful, serious, or severe; to alleviate.",
    example: "Strict emission controls help mitigate the catastrophic impacts of climate change.",
    collocations: ["mitigate the effects", "mitigate risks", "mitigate climate change"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/mitigate",
  },
  alleviate: {
    word: "alleviate",
    phonetic: "/əˈliːvieɪt/",
    partOfSpeech: "verb",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "To make something less severe, painful, or difficult to deal with.",
    example: "Targeted municipal investments can alleviate traffic congestion in metropolitan centers.",
    collocations: ["alleviate poverty", "alleviate pressure", "alleviate congestion"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/alleviate",
  },
  quandary: {
    word: "quandary",
    phonetic: "/ˈkwɒndəri/",
    partOfSpeech: "noun",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "A state of perplexity or uncertainty over what to do in a difficult situation.",
    example: "Policymakers face an ethical quandary when regulating artificial intelligence models.",
    collocations: ["ethical quandary", "moral quandary", "in a quandary"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/quandary",
  },
  substantially: {
    word: "substantially",
    phonetic: "/səbˈstænʃəli/",
    partOfSpeech: "adverb",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "To a great or significant degree; very considerably.",
    example: "Technological innovation substantially enhances productivity across global supply chains.",
    collocations: ["substantially enhance", "substantially reduce", "differ substantially"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/substantially",
  },
  pivotal: {
    word: "pivotal",
    phonetic: "/ˈpɪvətl/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Of crucial importance in relation to the development or success of something else.",
    example: "Education plays a pivotal role in eradicating intergenerational poverty.",
    collocations: ["play a pivotal role", "pivotal moment", "pivotal factor"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/pivotal",
  },
  unprecedented: {
    word: "unprecedented",
    phonetic: "/ʌnˈpresɪdentɪd/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "Never having happened or existed in the past; exceptional and unparalleled.",
    example: "The rapid rollout of generative artificial intelligence represents an unprecedented transformation.",
    collocations: ["unprecedented transformation", "unprecedented scale", "unprecedented challenge"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/unprecedented",
  },
  disparity: {
    word: "disparity",
    phonetic: "/dɪˈspærəti/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "A notable difference or inequality, especially one connected with unfair treatment.",
    example: "Governments must address socioeconomic disparities between rural and metropolitan populations.",
    collocations: ["socioeconomic disparity", "growing disparity", "income disparity"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/disparity",
  },
  emancipate: {
    word: "emancipate",
    phonetic: "/ɪˈmænsɪpeɪt/",
    partOfSpeech: "verb",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "To free somebody from legal, political, or social restrictions; to liberate from hardship.",
    example: "Modern technology has the potential to emancipate workers from perilous occupations.",
    collocations: ["emancipate the workforce", "emancipate from poverty", "socially emancipated"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/emancipate",
  },
  proponent: {
    word: "proponent",
    phonetic: "/prəˈpəʊnənt/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "A person who supports or speaks in favor of an idea, theory, or course of action.",
    example: "Proponents contend that renewable energy will generate millions of green jobs.",
    collocations: ["proponents contend", "staunch proponent", "leading proponent"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/proponent",
  },
  contentious: {
    word: "contentious",
    phonetic: "/kənˈtenʃəs/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Likely to cause argument, disagreement, or strong controversy between people.",
    example: "Animal testing remains a deeply contentious issue in contemporary biomedical ethics.",
    collocations: ["contentious issue", "contentious topic", "highly contentious"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/contentious",
  },
  ubiquitous: {
    word: "ubiquitous",
    phonetic: "/juːˈbɪkwɪtəs/",
    partOfSpeech: "adjective",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "Seeming to be seen everywhere; omnipresent.",
    example: "Smartphones have become ubiquitous across every demographic stratum.",
    collocations: ["ubiquitous presence", "become ubiquitous", "ubiquitous technology"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/ubiquitous",
  },
  imperative: {
    word: "imperative",
    phonetic: "/ɪmˈperətɪv/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Extremely vital or urgent; something that cannot be neglected.",
    example: "It is an imperative duty of educators to cultivate rigorous independent analytical thinking.",
    collocations: ["moral imperative", "economic imperative", "categorically imperative"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/imperative",
  },
  advocate: {
    word: "advocate",
    phonetic: "/ˈædvəkeɪt/",
    partOfSpeech: "verb",
    cefrLevel: "B2",
    sourceList: "Oxford 5000",
    definition: "To publicly recommend or support a particular policy or approach.",
    example: "Environmentalists advocate for substantial investments in public mass transit.",
    collocations: ["strongly advocate", "advocate reforms", "advocate policies"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/advocate",
  },
  multifaceted: {
    word: "multifaceted",
    phonetic: "/ˌmʌltiˈfæsɪtɪd/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Having many different aspects, features, or dimensions.",
    example: "Climate migration represents a multifaceted dilemma encompassing economic and humanitarian dimensions.",
    collocations: ["multifaceted problem", "multifaceted dilemma", "multifaceted strategy"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/multifaceted",
  },
  scrutiny: {
    word: "scrutiny",
    phonetic: "/ˈskruːtəni/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "Careful and thorough examination, inspection, or observation.",
    example: "Public expenditure on infrastructure must be subjected to rigorous democratic scrutiny.",
    collocations: ["close scrutiny", "come under scrutiny", "rigorous scrutiny"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/scrutiny",
  },
  ephemeral: {
    word: "ephemeral",
    phonetic: "/ɪˈfemərəl/",
    partOfSpeech: "adjective",
    cefrLevel: "C2",
    sourceList: "Oxford Academic",
    definition: "Lasting or used for only a very short time; transient.",
    example: "Fads in digital entertainment are often ephemeral, dissipating within months.",
    collocations: ["ephemeral nature", "ephemeral trends", "ephemeral popularity"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/ephemeral",
  },
  diminish: {
    word: "diminish",
    phonetic: "/dɪˈmɪnɪʃ/",
    partOfSpeech: "verb",
    cefrLevel: "B2",
    sourceList: "Oxford 5000",
    definition: "To become or make something become smaller, weaker, or less important.",
    example: "Inaction on pollution will diminish the quality of life for future generations.",
    collocations: ["diminish over time", "diminish the importance", "diminish rapidly"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/diminish",
  },
  catalyze: {
    word: "catalyze",
    phonetic: "/ˈkætəlaɪz/",
    partOfSpeech: "verb",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "To cause an action or process to begin, accelerate, or develop much more quickly.",
    example: "Government grants catalyzed groundbreaking advances in green battery storage.",
    collocations: ["catalyze change", "catalyze development", "catalyze economic growth"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/catalyze",
  },
  integration: {
    word: "integration",
    phonetic: "/ˌɪntɪˈɡreɪʃn/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "The act or process of combining two or more things in an effective way, or the process of becoming part of a community.",
    example: "Successful economic integration requires harmonious cooperation between sovereign member states.",
    collocations: ["economic integration", "seamless integration", "social integration"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/integration",
  },
  barrier: {
    word: "barrier",
    phonetic: "/ˈbæriə/",
    partOfSpeech: "noun",
    cefrLevel: "B2",
    sourceList: "Oxford 3000",
    definition: "A problem, rule, or situation that prevents somebody from doing something, or that makes something impossible.",
    example: "Language differences can present a formidable barrier to cross-cultural communication.",
    collocations: ["formidable barrier", "break down barriers", "trade barriers"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/barrier",
  },
  important: {
    word: "important",
    phonetic: "/ɪmˈpɔːtnt/",
    partOfSpeech: "adjective",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "Having a great effect on people or things; of great value or consequence.",
    example: "It is important that international environmental protocols are strictly enforced.",
    collocations: ["vitally important", "crucial factor", "important role"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/important",
  },
  problem: {
    word: "problem",
    phonetic: "/ˈprɒbləm/",
    partOfSpeech: "noun",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "A thing that is difficult to deal with, resolve, or understand.",
    example: "Overpopulation poses an acute problem for municipal urban infrastructure.",
    collocations: ["tackle a problem", "acute problem", "pressing problem"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/problem",
  },
  change: {
    word: "change",
    phonetic: "/tʃeɪndʒ/",
    partOfSpeech: "noun",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "The process of becoming different, or the result of something becoming different.",
    example: "Technological innovation triggers far-reaching change across traditional manufacturing.",
    collocations: ["profound change", "catalyze change", "undergo change"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/change",
  },
  increase: {
    word: "increase",
    phonetic: "/ɪnˈkriːs/",
    partOfSpeech: "verb",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "To become greater in amount, number, value, or degree.",
    example: "Renewable energy adoption continues to increase substantially across developing nations.",
    collocations: ["increase dramatically", "exponentially increase", "sharp increase"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/increase",
  },
  decrease: {
    word: "decrease",
    phonetic: "/dɪˈkriːs/",
    partOfSpeech: "verb",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "To become smaller in size, number, etc., or to make something do this.",
    example: "Carbon emissions must decrease markedly to forestall ecological tipping points.",
    collocations: ["decrease substantially", "gradual decrease", "decrease sharply"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/decrease",
  },
  advantage: {
    word: "advantage",
    phonetic: "/ədˈvɑːntɪdʒ/",
    partOfSpeech: "noun",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "A thing that helps you to be better or more successful than other people.",
    example: "Bilingualism confers a distinctive cognitive advantage in multitasking scenarios.",
    collocations: ["distinctive advantage", "confer an advantage", "outweigh advantages"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/advantage",
  },
  solution: {
    word: "solution",
    phonetic: "/səˈluːʃn/",
    partOfSpeech: "noun",
    cefrLevel: "B1",
    sourceList: "Oxford 3000",
    definition: "A way of solving a problem or dealing with a difficult situation.",
    example: "Forward-looking urban planning offers an enduring solution to traffic congestion.",
    collocations: ["viable solution", "propose a solution", "enduring solution"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/solution",
  },
  detrimental: {
    word: "detrimental",
    phonetic: "/ˌdetrɪˈmentl/",
    partOfSpeech: "adjective",
    cefrLevel: "C1",
    sourceList: "Oxford Academic",
    definition: "Harmful or damaging to something or somebody.",
    example: "Sedentary lifestyle habits exert a deeply detrimental influence on metabolic health.",
    collocations: ["detrimental effect", "detrimental impact", "highly detrimental"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/detrimental",
  },
  foster: {
    word: "foster",
    phonetic: "/ˈfɒstə/",
    partOfSpeech: "verb",
    cefrLevel: "C1",
    sourceList: "Oxford 5000",
    definition: "To encourage something to develop; to promote the growth of something.",
    example: "Universities should foster inquisitive reasoning and intellectual autonomy.",
    collocations: ["foster innovation", "foster collaboration", "foster growth"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/foster",
  },
  crucial: {
    word: "crucial",
    phonetic: "/ˈkruːʃl/",
    partOfSpeech: "adjective",
    cefrLevel: "B2",
    sourceList: "Oxford 3000",
    definition: "Extremely important, because it will affect other things.",
    example: "Fiscal discipline is crucial to sustaining macroeconomic stability.",
    collocations: ["crucial factor", "play a crucial role", "crucial decision"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/crucial",
  },
  enhance: {
    word: "enhance",
    phonetic: "/ɪnˈhɑːns/",
    partOfSpeech: "verb",
    cefrLevel: "B2",
    sourceList: "Oxford 3000",
    definition: "To increase or further improve the good quality, value, or status of somebody/something.",
    example: "Targeted professional training can substantially enhance workforce employability.",
    collocations: ["enhance productivity", "enhance performance", "greatly enhance"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/enhance",
  },
  comprehensive: {
    word: "comprehensive",
    phonetic: "/ˌkɒmprɪˈhensɪv/",
    partOfSpeech: "adjective",
    cefrLevel: "B2",
    sourceList: "Oxford 3000",
    definition: "Including all, or almost all, the items, details, facts, information, etc. that may be involved.",
    example: "A comprehensive policy reform is vital to overcome municipal waste crises.",
    collocations: ["comprehensive study", "comprehensive strategy", "comprehensive reform"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/comprehensive",
  },
  inevitable: {
    word: "inevitable",
    phonetic: "/ɪnˈevɪtəbl/",
    partOfSpeech: "adjective",
    cefrLevel: "B2",
    sourceList: "Oxford 3000",
    definition: "That you cannot avoid or prevent.",
    example: "Technological disruptions make continuous lifelong upskilling inevitable.",
    collocations: ["inevitable consequence", "virtually inevitable", "inevitable outcome"],
    oxfordUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/inevitable",
  },
};

// Build fast lookup maps at module load time
const vocabByWord = new Map<string, OxfordVocabItem[]>();
for (const item of OXFORD_VOCAB_LIST) {
  const key = item.word.toLowerCase().trim();
  const existing = vocabByWord.get(key);
  if (existing) {
    existing.push(item);
  } else {
    vocabByWord.set(key, [item]);
  }
}

const collocationByPhrase = new Map<string, CollocationRecord>();
const collocationWordIndex = new Map<string, CollocationRecord[]>();

for (const rec of COLLOCATION_RECORDS) {
  const phraseKey = rec.collocation.toLowerCase().trim().replace(/\s+/g, " ");
  collocationByPhrase.set(phraseKey, rec);

  const tokens = phraseKey.split(/[^a-z]+/).filter((w) => w.length >= 3);
  for (const tok of tokens) {
    const list = collocationWordIndex.get(tok);
    if (list) {
      list.push(rec);
    } else {
      collocationWordIndex.set(tok, [rec]);
    }
  }
}

// Extract sentences from model essays and collocation examples for authentic context
const CORPUS_SENTENCES: string[] = [];
for (const rec of COLLOCATION_RECORDS) {
  if (rec.example) CORPUS_SENTENCES.push(rec.example);
}
for (const prompt of WRITING_PROMPTS) {
  if (prompt.modelEssay) {
    const sents = prompt.modelEssay
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 35 && s.length < 220);
    CORPUS_SENTENCES.push(...sents);
  }
}

const IRREGULAR_LEMMAS: Record<string, string> = {
  children: "child",
  men: "man",
  women: "woman",
  people: "person",
  feet: "foot",
  teeth: "tooth",
  mice: "mouse",
  criteria: "criterion",
  phenomena: "phenomenon",
  analyses: "analysis",
  crises: "crisis",
  hypotheses: "hypothesis",
  theses: "thesis",
  indices: "index",
  matrices: "matrix",
  stimulated: "stimulate",
  went: "go",
  gone: "go",
  better: "good",
  best: "good",
  worse: "bad",
  worst: "bad",
  further: "far",
  furthest: "far",
  less: "little",
  least: "little",
  more: "much",
  most: "much",
  wrote: "write",
  written: "write",
  took: "take",
  taken: "take",
  made: "make",
  led: "lead",
  driven: "drive",
  drove: "drive",
  spoken: "speak",
  spoke: "speak",
  chosen: "choose",
  chose: "choose",
  grown: "grow",
  grew: "grow",
  known: "know",
  knew: "know",
  shown: "show",
  showed: "show",
  begun: "begin",
  began: "begin",
  ran: "run",
  built: "build",
  spent: "spend",
  sent: "send",
  lost: "lose",
  held: "hold",
  kept: "keep",
  left: "leave",
  felt: "feel",
  brought: "bring",
  thought: "think",
  bought: "buy",
  caught: "catch",
  taught: "teach",
  sought: "seek",
  found: "find",
  understood: "understand",
  stood: "stand",
  paid: "pay",
  said: "say",
  laid: "lay",
  dealt: "deal",
  meant: "mean",
  fell: "fall",
  fallen: "fall",
  rose: "rise",
  risen: "rise",
  arose: "arise",
  arisen: "arise",
  gave: "give",
  given: "give",
  became: "become",
  overcame: "overcome",
  underwent: "undergo",
  undergone: "undergo",
  withdrew: "withdraw",
  withdrawn: "withdraw",
  upheld: "uphold",
  withheld: "withhold",
  forbade: "forbid",
  forbidden: "forbid",
};

function hasSingleWordEntry(w: string): boolean {
  return (
    Boolean(OXFORD_ACADEMIC_DICTIONARY[w]) ||
    vocabByWord.has(w) ||
    collocationWordIndex.has(w)
  );
}

/**
 * Resolves a single English word (including inflections or UK/US spelling variants)
 * to its base dictionary key if it exists in our dictionaries.
 */
export function resolveSingleWordLemma(rawWord: string): string | null {
  const w = rawWord.toLowerCase().trim();
  if (!w || !/^[a-z]+(-[a-z]+)?$/.test(w) || w.length < 2) {
    return null;
  }

  if (hasSingleWordEntry(w)) return w;
  if (IRREGULAR_LEMMAS[w] && hasSingleWordEntry(IRREGULAR_LEMMAS[w])) {
    return IRREGULAR_LEMMAS[w];
  }

  // Generate candidate lemmas from standard English morphological rules
  const candidates: string[] = [];

  // UK <-> US spelling normalizations
  if (w.endsWith("ise")) candidates.push(w.slice(0, -3) + "ize");
  if (w.endsWith("ize")) candidates.push(w.slice(0, -3) + "ise");
  if (w.endsWith("ised")) candidates.push(w.slice(0, -4) + "ize", w.slice(0, -4) + "ise");
  if (w.endsWith("ized")) candidates.push(w.slice(0, -4) + "ize", w.slice(0, -4) + "ise");
  if (w.endsWith("ising")) candidates.push(w.slice(0, -5) + "ize", w.slice(0, -5) + "ise");
  if (w.endsWith("izing")) candidates.push(w.slice(0, -5) + "ize", w.slice(0, -5) + "ise");
  if (w.endsWith("isation")) candidates.push(w.slice(0, -7) + "ization", w.slice(0, -7) + "ize");
  if (w.endsWith("ization")) candidates.push(w.slice(0, -7) + "isation", w.slice(0, -7) + "ize");
  if (w.endsWith("our")) candidates.push(w.slice(0, -3) + "or");
  if (w.endsWith("or")) candidates.push(w.slice(0, -2) + "our");

  // Plural / 3rd person singular (-ies, -es, -s)
  if (w.endsWith("ies") && w.length > 4) {
    candidates.push(w.slice(0, -3) + "y");
  }
  if (w.endsWith("ves") && w.length > 4) {
    candidates.push(w.slice(0, -3) + "f", w.slice(0, -3) + "fe");
  }
  if (w.endsWith("es") && w.length > 3) {
    candidates.push(w.slice(0, -2), w.slice(0, -1));
  }
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 2) {
    candidates.push(w.slice(0, -1));
  }

  // Past / participle (-ied, -ed)
  if (w.endsWith("ied") && w.length > 4) {
    candidates.push(w.slice(0, -3) + "y");
  }
  if (w.endsWith("ed") && w.length > 3) {
    const stem = w.slice(0, -2);
    candidates.push(stem, w.slice(0, -1));
    // Doubled consonant (e.g. stopped -> stop, occurred -> occur)
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.push(stem.slice(0, -1));
    }
  }

  // Gerund / present participle (-ing)
  if (w.endsWith("ing") && w.length > 4) {
    const stem = w.slice(0, -3);
    candidates.push(stem, stem + "e");
    if (stem.endsWith("y") && stem.length > 2) {
      candidates.push(stem.slice(0, -1) + "ie");
    }
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.push(stem.slice(0, -1));
    }
  }

  // Adverbs (-ily, -ally, -ably, -ibly, -ly)
  if (w.endsWith("ily") && w.length > 4) {
    candidates.push(w.slice(0, -3) + "y");
  }
  if (w.endsWith("ally") && w.length > 5) {
    candidates.push(w.slice(0, -4) + "al", w.slice(0, -2));
  }
  if (w.endsWith("ably") && w.length > 5) {
    candidates.push(w.slice(0, -4) + "able");
  }
  if (w.endsWith("ibly") && w.length > 5) {
    candidates.push(w.slice(0, -4) + "ible");
  }
  if (w.endsWith("ly") && w.length > 4) {
    candidates.push(w.slice(0, -2), w.slice(0, -2) + "e");
  }

  // Comparatives & Superlatives (-ier, -iest, -er, -est)
  if (w.endsWith("ier") && w.length > 4) {
    candidates.push(w.slice(0, -3) + "y");
  }
  if (w.endsWith("iest") && w.length > 5) {
    candidates.push(w.slice(0, -4) + "y");
  }
  if (w.endsWith("er") && w.length > 4) {
    const stem = w.slice(0, -2);
    candidates.push(stem, stem + "e");
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.push(stem.slice(0, -1));
    }
  }
  if (w.endsWith("est") && w.length > 5) {
    const stem = w.slice(0, -3);
    candidates.push(stem, stem + "e");
    if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
      candidates.push(stem.slice(0, -1));
    }
  }

  // Nominalizations (-ation, -ition, -ment, -ness, -ity)
  if (w.endsWith("ation") && w.length > 6) {
    candidates.push(w.slice(0, -5) + "ate", w.slice(0, -5) + "e", w.slice(0, -5));
  }
  if (w.endsWith("ment") && w.length > 6) {
    candidates.push(w.slice(0, -4), w.slice(0, -4) + "e");
  }
  if (w.endsWith("ness") && w.length > 5) {
    candidates.push(w.slice(0, -4));
    if (w.endsWith("iness")) candidates.push(w.slice(0, -5) + "y");
  }

  for (const cand of candidates) {
    if (cand.length >= 2 && hasSingleWordEntry(cand)) {
      return cand;
    }
  }

  return null;
}

/**
 *Resolves a multi-word selection to a known collocation or phrasal entry if valid.
 */
function resolvePhraseEntry(normalizedPhrase: string): {
  type: "collocation" | "vocab";
  collocation?: CollocationRecord;
  vocab?: OxfordVocabItem;
} | null {
  if (collocationByPhrase.has(normalizedPhrase)) {
    return { type: "collocation", collocation: collocationByPhrase.get(normalizedPhrase)! };
  }
  const vocabMatch = vocabByWord.get(normalizedPhrase);
  if (vocabMatch && vocabMatch.length > 0) {
    return { type: "vocab", vocab: vocabMatch[0] };
  }

  // Also check if the first or last word in a 2-3 word phrase is inflected
  // e.g. "plays a pivotal role" or "mitigating the effects"
  const parts = normalizedPhrase.split(" ");
  if (parts.length >= 2 && parts.length <= 4) {
    const firstLemma = resolveSingleWordLemma(parts[0]);
    if (firstLemma && firstLemma !== parts[0]) {
      const candidatePhrase = [firstLemma, ...parts.slice(1)].join(" ");
      if (collocationByPhrase.has(candidatePhrase)) {
        return { type: "collocation", collocation: collocationByPhrase.get(candidatePhrase)! };
      }
      const vMatch = vocabByWord.get(candidatePhrase);
      if (vMatch && vMatch.length > 0) {
        return { type: "vocab", vocab: vMatch[0] };
      }
    }
    const lastIdx = parts.length - 1;
    const lastLemma = resolveSingleWordLemma(parts[lastIdx]);
    if (lastLemma && lastLemma !== parts[lastIdx]) {
      const candidatePhrase = [...parts.slice(0, lastIdx), lastLemma].join(" ");
      if (collocationByPhrase.has(candidatePhrase)) {
        return { type: "collocation", collocation: collocationByPhrase.get(candidatePhrase)! };
      }
    }
  }

  return null;
}

/**
 * Strictly validates whether the user's selected text makes sense and exists
 * in our Oxford 3000/5000, Academic, or Collocations dictionaries.
 */
export function isValidOxfordSelection(rawText: string): boolean {
  if (!rawText) return false;

  // Strip only leading/trailing quotes or punctuation
  const strippedOuter = rawText
    .trim()
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")
    .replace(/\s+/g, " ");

  if (!strippedOuter || strippedOuter.length < 2 || strippedOuter.length > 40) {
    return false;
  }

  // Reject if selection contains internal sentence punctuation, digits, or slashes
  if (/[^a-zA-Z\s-]/.test(strippedOuter)) {
    return false;
  }

  const normalized = strippedOuter.toLowerCase();
  const words = normalized.split(" ").filter(Boolean);

  if (words.length === 0 || words.length > 4) {
    return false;
  }

  if (words.length === 1) {
    return resolveSingleWordLemma(words[0]) !== null;
  }

  return resolvePhraseEntry(normalized) !== null;
}

function isPlaceholderDefinition(def: string): boolean {
  return (
    !def ||
    def.includes("Click to inspect full definition") ||
    def.includes("Click below to inspect comprehensive Oxford")
  );
}

function isPlaceholderExample(ex: string): boolean {
  return (
    !ex ||
    ex.includes("In IELTS academic responses, precise use of") ||
    ex.includes("elevates your Lexical Resource score under official IELTS descriptors")
  );
}

function findAuthenticExample(word: string, lemma: string, pos: string): string {
  const regexWord = new RegExp(`\\b(${word}|${lemma})(s|es|ed|ing|ly)?\\b`, "i");
  for (const sent of CORPUS_SENTENCES) {
    if (regexWord.test(sent)) {
      return sent;
    }
  }

  // Contextual academic fallback tailored to part of speech (only if not in corpus)
  if (pos.includes("verb")) {
    return `Public institutions must ${lemma} effective long-term strategies to address emerging socioeconomic challenges.`;
  }
  if (pos.includes("adjective")) {
    return `Policymakers must consider the ${lemma} implications of rapid technological transformation on the workforce.`;
  }
  if (pos.includes("adverb")) {
    return `Sustained investment in education ${ word.endsWith("ly") ? word : lemma } improves long-term social mobility.`;
  }
  return `Empirical research highlights the role of ${lemma} in shaping contemporary public policy.`;
}

function findLocalCollocations(lemma: string): string[] {
  const matches = collocationWordIndex.get(lemma) || [];
  const results: string[] = [];
  for (const m of matches) {
    if (!results.includes(m.collocation)) {
      results.push(m.collocation);
    }
    if (m.alternativePartners) {
      for (const alt of m.alternativePartners) {
        if (alt.toLowerCase().includes(lemma) && !results.includes(alt)) {
          results.push(alt);
        }
      }
    }
    if (results.length >= 5) break;
  }
  return results;
}

/**
 * Synchronously resolves any valid word or collocation from our local dictionaries.
 * Never returns a generic fixed boilerplate response.
 */
export function lookupOxfordWord(rawWord: string): OxfordDictionaryEntry {
  const strippedOuter = rawWord
    .trim()
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  // 1. Check multi-word collocation/phrase first
  if (strippedOuter.includes(" ")) {
    const phraseMatch = resolvePhraseEntry(strippedOuter);
    if (phraseMatch?.type === "collocation" && phraseMatch.collocation) {
      const col = phraseMatch.collocation;
      return {
        word: col.collocation,
        phonetic: "Academic Collocation",
        partOfSpeech: col.typeLabel || "collocation",
        cefrLevel: col.bandImpact?.includes("8.5") ? "C2" : "C1",
        sourceList: col.sourceBook || "Academic Collocations",
        definition: col.definition,
        example: col.example,
        collocations: col.alternativePartners || [],
        oxfordUrl: `https://www.oxfordlearnersdictionaries.com/spellcheck/english/?q=${encodeURIComponent(col.collocation)}`,
        needsLiveEnrichment: false,
      };
    }
    if (phraseMatch?.type === "vocab" && phraseMatch.vocab) {
      const v = phraseMatch.vocab;
      const needsLive = isPlaceholderDefinition(v.definition);
      return {
        word: v.word,
        phonetic: v.phonetic,
        partOfSpeech: v.pos,
        cefrLevel: v.level,
        sourceList: v.sourceList,
        definition: needsLive ? "" : v.definition,
        example: isPlaceholderExample(v.example)
          ? findAuthenticExample(v.word, v.word, v.pos)
          : v.example,
        collocations: v.collocations?.length ? v.collocations : findLocalCollocations(v.word),
        oxfordUrl: v.oxfordUrl,
        needsLiveEnrichment: needsLive,
      };
    }
  }

  // 2. Single word resolution
  const cleanWord = strippedOuter.replace(/[^a-z-]/g, "");
  const lemma = resolveSingleWordLemma(cleanWord) || cleanWord;

  // Check curated OXFORD_ACADEMIC_DICTIONARY first
  if (OXFORD_ACADEMIC_DICTIONARY[cleanWord]) {
    return OXFORD_ACADEMIC_DICTIONARY[cleanWord];
  }
  if (OXFORD_ACADEMIC_DICTIONARY[lemma]) {
    return {
      ...OXFORD_ACADEMIC_DICTIONARY[lemma],
      matchedQuery: cleanWord !== lemma ? cleanWord : undefined,
    };
  }

  // Check OXFORD_VOCAB_LIST (4,953 Oxford 3000 & 5000 words)
  const vocabEntries = vocabByWord.get(cleanWord) || vocabByWord.get(lemma);
  if (vocabEntries && vocabEntries.length > 0) {
    // Prefer an entry that already has a full definition if multiple POS entries exist
    const primary =
      vocabEntries.find((e) => !isPlaceholderDefinition(e.definition)) || vocabEntries[0];
    const allPos = Array.from(new Set(vocabEntries.map((e) => e.pos))).join(", ");
    const needsLive = isPlaceholderDefinition(primary.definition);
    const localColls = primary.collocations?.length
      ? primary.collocations
      : findLocalCollocations(primary.word);

    return {
      word: primary.word,
      matchedQuery: cleanWord !== primary.word.toLowerCase() ? cleanWord : undefined,
      phonetic: primary.phonetic,
      partOfSpeech: allPos || primary.pos,
      cefrLevel: primary.level,
      sourceList: primary.sourceList,
      definition: needsLive ? "" : primary.definition,
      example: isPlaceholderExample(primary.example)
        ? findAuthenticExample(cleanWord, primary.word, primary.pos)
        : primary.example,
      collocations: localColls,
      oxfordUrl: primary.oxfordUrl,
      needsLiveEnrichment: needsLive,
    };
  }

  // Check if the word appears in our Collocations dictionary
  const collMatches = collocationWordIndex.get(lemma);
  if (collMatches && collMatches.length > 0) {
    const first = collMatches[0];
    return {
      word: lemma,
      matchedQuery: cleanWord !== lemma ? cleanWord : undefined,
      phonetic: `/${lemma}/`,
      partOfSpeech: "academic vocabulary",
      cefrLevel: "C1",
      sourceList: "Academic Collocations",
      definition: "",
      example: first.example,
      collocations: collMatches.slice(0, 4).map((c) => c.collocation),
      oxfordUrl: `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(lemma)}`,
      needsLiveEnrichment: true,
    };
  }

  return {
    word: lemma || rawWord.trim(),
    phonetic: `/${lemma}/`,
    partOfSpeech: "vocabulary",
    cefrLevel: "B2",
    definition: "",
    example: findAuthenticExample(cleanWord, lemma, "noun"),
    collocations: findLocalCollocations(lemma),
    oxfordUrl: `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(lemma || rawWord.trim())}`,
    needsLiveEnrichment: true,
  };
}

const liveEnrichmentCache = new Map<string, OxfordDictionaryEntry>();

const POS_TAG_MAP: Record<string, string> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
};

function formatDefinitionText(rawDef: string): { pos: string; text: string } {
  const parts = rawDef.split("\t");
  const rawPos = parts.length > 1 ? parts[0].trim() : "";
  const rawText = (parts.length > 1 ? parts.slice(1).join(" ") : parts[0]).trim();
  const formattedText = rawText
    ? rawText.charAt(0).toUpperCase() + rawText.slice(1) + (rawText.endsWith(".") ? "" : ".")
    : "";
  return {
    pos: POS_TAG_MAP[rawPos] || rawPos || "definition",
    text: formattedText,
  };
}

/**
 * Fetches real word-specific dictionary definitions, IPA phonetics, and collocations
 * for entries in the Oxford 3000/5000 list that do not have inline definitions stored locally.
 */
export async function enrichOxfordEntry(
  baseEntry: OxfordDictionaryEntry
): Promise<OxfordDictionaryEntry> {
  if (!baseEntry.needsLiveEnrichment && baseEntry.definition) {
    return baseEntry;
  }

  const cacheKey = baseEntry.word.toLowerCase();
  if (liveEnrichmentCache.has(cacheKey)) {
    return liveEnrichmentCache.get(cacheKey)!;
  }

  let definition = baseEntry.definition;
  let phonetic = baseEntry.phonetic;
  const additionalDefinitions: { pos: string; definition: string }[] = [];
  let collocations = [...(baseEntry.collocations || [])];

  try {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(baseEntry.word)}&md=dpfr&ipa=1&max=3`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const match =
        data.find((d: any) => d.word?.toLowerCase() === cacheKey && d.defs?.length > 0) ||
        data.find((d: any) => d.defs?.length > 0);

      if (match) {
        // Extract IPA phonetic if available
        if (Array.isArray(match.tags)) {
          const ipaTag = match.tags.find((t: string) => t.startsWith("ipa_pron:"));
          if (ipaTag) {
            const rawIpa = ipaTag.replace("ipa_pron:", "").trim();
            if (rawIpa) {
              phonetic = `/${rawIpa}/`;
            }
          }
        }

        // Extract definitions, prioritizing ones matching the Oxford part of speech
        if (Array.isArray(match.defs) && match.defs.length > 0) {
          const parsedDefs = match.defs
            .map(formatDefinitionText)
            .filter((d: { pos: string; text: string }) => d.text.length > 0);

          const primaryPosNormalized = baseEntry.partOfSpeech.toLowerCase();
          const matchingPosDef = parsedDefs.find((d: { pos: string; text: string }) =>
            primaryPosNormalized.includes(d.pos)
          );

          const primaryDef = matchingPosDef || parsedDefs[0];
          if (primaryDef) {
            definition = primaryDef.text;
          }

          for (const d of parsedDefs) {
            if (d.text !== definition && additionalDefinitions.length < 3) {
              additionalDefinitions.push({ pos: d.pos, definition: d.text });
            }
          }
        }
      }
    }

    // Fetch real corpus collocations if we have fewer than 2 local collocations
    if (collocations.length < 2 && !baseEntry.word.includes(" ")) {
      const isNoun = baseEntry.partOfSpeech.toLowerCase().includes("noun");
      const relParam = isNoun
        ? `rel_jjb=${encodeURIComponent(baseEntry.word)}`
        : `rel_bga=${encodeURIComponent(baseEntry.word)}`;
      const collRes = await fetch(`https://api.datamuse.com/words?${relParam}&max=4`);
      if (collRes.ok) {
        const collData = await collRes.json();
        for (const item of collData) {
          if (item.word && /^[a-z]+$/.test(item.word) && item.word.length > 2) {
            const phrase = isNoun
              ? `${item.word} ${baseEntry.word}`
              : `${baseEntry.word} ${item.word}`;
            if (!collocations.includes(phrase)) {
              collocations.push(phrase);
            }
          }
          if (collocations.length >= 4) break;
        }
      }
    }
  } catch {
    // Ignore network errors and fall back to concise local metadata
  }

  if (!definition) {
    // Check if the word participates in a collocation with a definition
    const collMatches = collocationWordIndex.get(cacheKey);
    if (collMatches && collMatches.length > 0) {
      definition = `${collMatches[0].definition} (as in "${collMatches[0].collocation}").`;
    } else {
      definition = `${baseEntry.sourceList || "Oxford"} ${baseEntry.cefrLevel} ${baseEntry.partOfSpeech}.`;
    }
  }

  const enriched: OxfordDictionaryEntry = {
    ...baseEntry,
    phonetic,
    definition,
    additionalDefinitions: additionalDefinitions.length > 0 ? additionalDefinitions : undefined,
    collocations,
    needsLiveEnrichment: false,
  };

  liveEnrichmentCache.set(cacheKey, enriched);
  return enriched;
}

export const HIGHLIGHT_COLORS = [
  { id: "yellow", label: "Key Idea", bg: "rgba(250, 204, 21, 0.35)", border: "#facc15", text: "#854d0e", dot: "#eab308" },
  { id: "emerald", label: "Academic Lexis", bg: "rgba(52, 211, 153, 0.35)", border: "#34d399", text: "#065f46", dot: "#10b981" },
  { id: "sky", label: "Collocation", bg: "rgba(56, 189, 248, 0.35)", border: "#38bdf8", text: "#0369a1", dot: "#0ea5e9" },
  { id: "violet", label: "Idiom / C2", bg: "rgba(167, 139, 250, 0.35)", border: "#a78bfa", text: "#5b21b6", dot: "#8b5cf6" },
  { id: "rose", label: "Check / Review", bg: "rgba(251, 113, 133, 0.35)", border: "#fb7185", text: "#9f1239", dot: "#f43f5e" },
] as const;

export type HighlightColorId = (typeof HIGHLIGHT_COLORS)[number]["id"];
