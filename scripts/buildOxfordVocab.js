const fs = require('fs');
const path = require('path');

// Read existing academic dictionary from oxfordDictionary.ts
const dictFile = fs.readFileSync(path.join(__dirname, '../src/lib/oxfordDictionary.ts'), 'utf8');

const existingDict = {};
const entryRegex = /(\w+):\s*\{\s*word:\s*"([^"]+)",\s*phonetic:\s*"([^"]+)",\s*partOfSpeech:\s*"([^"]+)",\s*cefrLevel:\s*"([^"]+)",\s*definition:\s*"([^"]+)",\s*example:\s*"([^"]+)",\s*collocations:\s*\[([^\]]*)\],/g;
let m;
while ((m = entryRegex.exec(dictFile)) !== null) {
  const collocations = m[7].split(',').map(s => s.replace(/"/g, '').trim()).filter(Boolean);
  existingDict[m[1].toLowerCase()] = {
    word: m[2],
    phonetic: m[3],
    partOfSpeech: m[4],
    cefrLevel: m[5],
    definition: m[6],
    example: m[7],
    collocations
  };
}

// Add a rich bank of authentic IELTS B2 & C1 definitions
const RICH_DEFINITIONS = {
  ...existingDict,
  abandon: {
    phonetic: "/əˈbændən/",
    definition: "To leave a place, thing, or person permanently, or to cease supporting something.",
    example: "Under severe economic stress, municipal councils were forced to abandon rural revitalization projects.",
    collocations: ["abandon an initiative", "abandon hopes", "hastily abandon"]
  },
  abolish: {
    phonetic: "/əˈbɒlɪʃ/",
    definition: "To officially end a law, a system or an institution.",
    example: "Progressive nations seek to abolish tuition fees to make higher education equitable.",
    collocations: ["abolish taxes", "officially abolish", "abolish the death penalty"]
  },
  abundance: {
    phonetic: "/əˈbʌndəns/",
    definition: "A very large quantity of something that is more than enough.",
    example: "An abundance of natural resources does not automatically guarantee socioeconomic stability.",
    collocations: ["abundance of opportunities", "relative abundance", "in great abundance"]
  },
  accelerate: {
    phonetic: "/əkˈseləreɪt/",
    definition: "To happen or make something happen faster or earlier than expected.",
    example: "Automation will accelerate structural shifts in modern employment landscapes.",
    collocations: ["accelerate economic growth", "accelerate pace", "rapidly accelerate"]
  },
  accessible: {
    phonetic: "/əkˈsesəbl/",
    definition: "That can be reached, entered, used, or seen easily by everyone.",
    example: "Public infrastructure must remain universally accessible to citizens of all physical abilities.",
    collocations: ["readily accessible", "easily accessible", "accessible healthcare"]
  },
  accommodate: {
    phonetic: "/əˈkɒmədeɪt/",
    definition: "To provide enough space for someone/something, or to adjust to someone's needs.",
    example: "Modern megacities must expand housing sectors to accommodate surging demographic migration.",
    collocations: ["accommodate the influx", "accommodate diverse needs", "comfortably accommodate"]
  },
  accomplish: {
    phonetic: "/əˈkʌmplɪʃ/",
    definition: "To succeed in doing or completing something successfully.",
    example: "Collaborative research allows environmental bodies to accomplish ambitious net-zero targets.",
    collocations: ["accomplish an objective", "accomplish tasks", "successfully accomplish"]
  },
  accumulate: {
    phonetic: "/əˈkjuːmjəleɪt/",
    definition: "To gradually get more and more of something over a period of time.",
    example: "Without proactive recycling systems, toxic non-biodegradable plastics accumulate in marine habitats.",
    collocations: ["accumulate debt", "accumulate wealth", "rapidly accumulate"]
  },
  acute: {
    phonetic: "/əˈkjuːt/",
    definition: "Very serious or severe; deeply felt and demanding urgent attention.",
    example: "Developing countries frequently suffer an acute shortage of specialized healthcare personnel.",
    collocations: ["acute shortage", "acute crisis", "acute awareness"]
  },
  adhere: {
    phonetic: "/ədˈhɪə(r)/",
    definition: "To stick firmly to something, or to follow a particular set of rules or beliefs closely.",
    example: "Commercial enterprises must strictly adhere to statutory environmental regulations.",
    collocations: ["adhere to standards", "strictly adhere", "adhere to guidelines"]
  },
  advocate: {
    phonetic: "/ˈædvəkeɪt/",
    definition: "To publicly support or recommend a particular policy, action, or way of doing things.",
    example: "Public health specialists passionately advocate preventive lifestyle education in schools.",
    collocations: ["strongly advocate", "advocate reforms", "advocate policies"]
  },
  aesthetic: {
    phonetic: "/iːsˈθetɪk/",
    definition: "Concerned with beauty, artistic taste, or the appreciation of art and design.",
    example: "Contemporary architecture must harmonize practical utility with appealing aesthetic standards.",
    collocations: ["aesthetic appeal", "aesthetic value", "aesthetic standards"]
  },
  allocate: {
    phonetic: "/ˈæləkeɪt/",
    definition: "To give something officially to somebody/something for a particular purpose.",
    example: "Local governments should allocate more financial resources to sustainable public transit.",
    collocations: ["allocate funds", "allocate resources", "fairly allocate"]
  },
  ambiguous: {
    phonetic: "/æmˈbɪɡjuəs/",
    definition: "That can be understood in more than one way; not having one obvious meaning.",
    example: "Ambiguous contractual clauses frequently give rise to avoidable industrial litigation.",
    collocations: ["ambiguous statement", "highly ambiguous", "remain ambiguous"]
  },
  amend: {
    phonetic: "/əˈmend/",
    definition: "To change a law, document, or statement slightly in order to improve it or make it more accurate.",
    example: "Parliament convened an emergency session to amend outdated data privacy legislation.",
    collocations: ["amend legislation", "amend the law", "formally amend"]
  },
  anticipate: {
    phonetic: "/ænˈtɪsɪpeɪt/",
    definition: "To expect something to happen and prepare for it in advance.",
    example: "Urban planners must anticipate prospective population expansion when zoning residential sectors.",
    collocations: ["eagerly anticipate", "anticipate future demand", "fail to anticipate"]
  },
  apparent: {
    phonetic: "/əˈpærənt/",
    definition: "Easy to see or understand; obvious and clearly evident.",
    example: "The positive impacts of renewable energy investments have become increasingly apparent.",
    collocations: ["readily apparent", "increasingly apparent", "apparent discrepancy"]
  },
  articulate: {
    phonetic: "/ɑːˈtɪkjuleɪt/",
    definition: "To express or explain thoughts, ideas, or feelings clearly and coherently in words.",
    example: "Candidates who articulate reasoned viewpoints with fluency achieve higher speaking band scores.",
    collocations: ["articulate an argument", "clearly articulate", "articulate vision"]
  },
  aspiration: {
    phonetic: "/ˌæspəˈreɪʃn/",
    definition: "A strong desire to achieve something high, noble, or ambitious.",
    example: "Vocational mentorship helps young people realize their educational and career aspirations.",
    collocations: ["career aspirations", "legitimate aspirations", "fulfill aspirations"]
  },
  assert: {
    phonetic: "/əˈsɜːt/",
    definition: "To state clearly and firmly that something is true, or to insist on rights or authority.",
    example: "Proponents of remote work assert that flexible arrangements bolster employee well-being.",
    collocations: ["assert authority", "firmly assert", "assert rights"]
  },
  beneficial: {
    phonetic: "/ˌbenɪˈfɪʃl/",
    definition: "Having a good, positive, or helpful result or effect.",
    example: "Regular cardiovascular physical exercise is universally beneficial for metabolic longevity.",
    collocations: ["mutually beneficial", "highly beneficial", "beneficial effects"]
  },
  bias: {
    phonetic: "/ˈbaɪəs/",
    definition: "An inclination or prejudice in favor of or against one thing, person, or group.",
    example: "Algorithmic decision systems must be audited continuously to avoid systemic racial or gender bias.",
    collocations: ["unconscious bias", "eliminate bias", "cultural bias"]
  },
  catalyst: {
    phonetic: "/ˈkætəlɪst/",
    definition: "A person, thing, or event that causes significant change or action to happen.",
    example: "The pandemic served as a powerful catalyst for the rapid adoption of remote learning platforms.",
    collocations: ["catalyst for change", "primary catalyst", "economic catalyst"]
  },
  coherent: {
    phonetic: "/kəʊˈhɪərənt/",
    definition: "Logical and well-organized; easy to understand and clear in parts and whole.",
    example: "High-scoring IELTS essays present a coherent progression of ideas supported by pertinent evidence.",
    collocations: ["coherent argument", "coherent structure", "logically coherent"]
  },
  colossal: {
    phonetic: "/kəˈlɒsl/",
    definition: "Extremely large, massive, or immense in scale or extent.",
    example: "Mitigating climate change demands a colossal transition toward decarbonized power grids.",
    collocations: ["colossal waste", "colossal scale", "colossal impact"]
  },
  compensate: {
    phonetic: "/ˈkɒmpənseɪt/",
    definition: "To provide something good to balance or reduce the bad effect of damage or loss.",
    example: "Generous fringe benefits often compensate for modest base salaries in non-profit institutions.",
    collocations: ["compensate for loss", "adequately compensate", "financially compensate"]
  },
  competence: {
    phonetic: "/ˈkɒmpɪtəns/",
    definition: "The ability to do something successfully, efficiently, or to a recognized standard.",
    example: "Cross-cultural communicative competence is a vital prerequisite for multinational management.",
    collocations: ["linguistic competence", "professional competence", "core competence"]
  },
  complexity: {
    phonetic: "/kəmˈpleksəti/",
    definition: "The state of having many interconnected parts or being difficult to understand.",
    example: "Navigating the geopolitical complexity of international treaties requires seasoned diplomatic finesse.",
    collocations: ["sheer complexity", "unravel complexity", "growing complexity"]
  },
  comprehensive: {
    phonetic: "/ˌkɒmprɪˈhensɪv/",
    definition: "Including all or almost all aspects, details, or items that may be involved.",
    example: "A comprehensive public health policy is necessary to address sedentary lifestyle diseases.",
    collocations: ["comprehensive review", "comprehensive strategy", "comprehensive coverage"]
  },
  concur: {
    phonetic: "/kənˈkɜː(r)/",
    definition: "To agree with somebody or an opinion; to happen at the same time.",
    example: "Most contemporary climate scientists concur that anthropogenic emissions drive global warming.",
    collocations: ["readily concur", "broadly concur", "concur with the view"]
  },
  consensus: {
    phonetic: "/kənˈsensəs/",
    definition: "An opinion or decision that all members of a group agree with.",
    example: "Building a broad political consensus is indispensable for long-term fiscal pension reform.",
    collocations: ["reach a consensus", "scientific consensus", "broad consensus"]
  },
  consequently: {
    phonetic: "/ˈkɒnsɪkwəntli/",
    definition: "As a result or effect; therefore.",
    example: "Consumer expenditure fell sharply, and consequently, retail businesses sustained major losses.",
    collocations: ["consequently lead to", "and consequently", "consequently suffer"]
  },
  considerable: {
    phonetic: "/kənˈsɪdərəbl/",
    definition: "Large in amount, size, or importance; significant.",
    example: "Investing in offshore wind farms entails considerable upfront capital expenditure.",
    collocations: ["considerable amount", "considerable influence", "considerable progress"]
  },
  controversial: {
    phonetic: "/ˌkɒntrəˈvɜːʃl/",
    definition: "Causing a lot of public angry discussion and disagreement.",
    example: "The implementation of genetic editing in agricultural crops remains deeply controversial.",
    collocations: ["highly controversial", "controversial policy", "controversial topic"]
  },
  crucial: {
    phonetic: "/ˈkruːʃl/",
    definition: "Extremely important, because it will affect how other things happen.",
    example: "Early intervention plays a crucial role in rectifying developmental speech delays in infants.",
    collocations: ["crucial factor", "play a crucial role", "crucial decision"]
  },
  deficiency: {
    phonetic: "/dɪˈfɪʃnsi/",
    definition: "The state of lacking something essential, or a fault or weakness in something.",
    example: "Iron deficiency can cause chronic fatigue and diminished cognitive performance in teenagers.",
    collocations: ["nutritional deficiency", "remedy a deficiency", "structural deficiency"]
  },
  deteriorate: {
    phonetic: "/dɪˈtɪəriəreɪt/",
    definition: "To become progressively worse in quality, condition, or value.",
    example: "Without immediate maintenance, historical landmarks rapidly deteriorate under industrial pollution.",
    collocations: ["conditions deteriorate", "rapidly deteriorate", "continue to deteriorate"]
  },
  detrimental: {
    phonetic: "/ˌdetrɪˈmentl/",
    definition: "Harmful, damaging, or causing disadvantage to something or someone.",
    example: "Excessive smartphone usage before bed exerts a detrimental impact on restorative sleep patterns.",
    collocations: ["detrimental effect", "detrimental impact", "detrimental to health"]
  },
  diminish: {
    phonetic: "/dɪˈmɪnɪʃ/",
    definition: "To become or cause something to become smaller, weaker, or less important.",
    example: "Transparent communication can diminish public skepticism regarding controversial infrastructure plans.",
    collocations: ["diminish over time", "diminish the importance", "rapidly diminish"]
  },
  disparity: {
    phonetic: "/dɪˈspærəti/",
    definition: "A notable difference or inequality, especially one connected with unfair treatment.",
    example: "Regional governments must implement targeted subsidies to eliminate the urban-rural income disparity.",
    collocations: ["economic disparity", "growing disparity", "income disparity"]
  },
  distinguish: {
    phonetic: "/dɪˈstɪŋɡwɪʃ/",
    definition: "To recognize or show the difference between people or things.",
    example: "Competent academic researchers must clearly distinguish correlation from underlying causation.",
    collocations: ["distinguish between", "clearly distinguish", "distinguish oneself"]
  },
  drudgery: {
    phonetic: "/ˈdrʌdʒəri/",
    definition: "Hard, boring work that has to be repeated without intellectual stimulation.",
    example: "Automated assembly systems emancipate industrial workers from repetitive physical drudgery.",
    collocations: ["routine drudgery", "domestic drudgery", "escape the drudgery"]
  },
  elaborate: {
    phonetic: "/ɪˈlæbərət/",
    definition: "Very detailed, carefully designed, and complicated; or (verb) to explain in greater detail.",
    example: "The ministry designed an elaborate framework to monitor carbon neutrality benchmarks.",
    collocations: ["elaborate on", "elaborate design", "highly elaborate"]
  },
  elevate: {
    phonetic: "/ˈelɪveɪt/",
    definition: "To raise someone or something to a higher position, rank, standard, or level.",
    example: "Incorporating sophisticated academic vocabulary will elevate the candidate's Lexical Resource score.",
    collocations: ["elevate status", "elevate standards", "elevate the discourse"]
  },
  eliminate: {
    phonetic: "/ɪˈlɪmɪneɪt/",
    definition: "To completely remove, defeat, or get rid of something that is not wanted or needed.",
    example: "Automating paper documentation helps public hospitals eliminate redundant bureaucratic delays.",
    collocations: ["eliminate waste", "virtually eliminate", "eliminate poverty"]
  },
  embrace: {
    phonetic: "/ɪmˈbreɪs/",
    definition: "To accept an idea, proposal, or belief eagerly and wholeheartedly.",
    example: "Forward-thinking educational institutions embrace artificial intelligence as an interactive tutor.",
    collocations: ["eagerly embrace", "embrace change", "embrace technology"]
  },
  enhance: {
    phonetic: "/ɪnˈhɑːns/",
    definition: "To increase or further improve the good quality, value, or status of something.",
    example: "Interdisciplinary training can substantially enhance the employability of tertiary graduates.",
    collocations: ["enhance productivity", "enhance performance", "greatly enhance"]
  },
  equitable: {
    phonetic: "/ˈekwɪtəbl/",
    definition: "Fair and reasonable; treating everyone in an equal and just way.",
    example: "An equitable distribution of healthcare resources is paramount in sustaining social harmony.",
    collocations: ["equitable distribution", "equitable access", "equitable society"]
  },
  eradicate: {
    phonetic: "/ɪˈrædɪkeɪt/",
    definition: "To destroy or get rid of something completely, especially something bad like disease or poverty.",
    example: "Coordinated vaccination initiatives succeeded in eradicating smallpox across the globe.",
    collocations: ["eradicate poverty", "completely eradicate", "eradicate disease"]
  },
  escalate: {
    phonetic: "/ˈeskəleɪt/",
    definition: "To become or make something greater, more serious, or more intense.",
    example: "If diplomatic discussions stall, bilateral trade tensions may quickly escalate into tariff warfare.",
    collocations: ["tensions escalate", "rapidly escalate", "escalate into conflict"]
  },
  exacerbate: {
    phonetic: "/ɪɡˈzæsəbeɪt/",
    definition: "To make something that is already bad or unpleasant even worse.",
    example: "Rapid unplanned urbanization tends to exacerbate localized poverty and traffic congestion.",
    collocations: ["exacerbate the problem", "exacerbate tensions", "exacerbate disparities"]
  },
  exemplify: {
    phonetic: "/ɪɡˈzemplɪfaɪ/",
    definition: "To be a typical example of something, or to explain something by showing an example.",
    example: "Renewable energy cooperatives exemplify successful grassroots climate initiatives.",
    collocations: ["exemplify the trend", "perfectly exemplify", "exemplify qualities"]
  },
  feasible: {
    phonetic: "/ˈfiːzəbl/",
    definition: "That is possible and likely to be achieved successfully; viable.",
    example: "Engineers conducted a feasibility study to verify whether solar desalination was economically feasible.",
    collocations: ["economically feasible", "feasible alternative", "technically feasible"]
  },
  formidable: {
    phonetic: "/ˈfɔːmɪdəbl/",
    definition: "Inspiring respect, awe, or fear through being impressively large, powerful, or intense.",
    example: "Transitioning a nation's energy grid away from fossil fuels remains a formidable task.",
    collocations: ["formidable challenge", "formidable task", "formidable obstacle"]
  },
  fundamental: {
    phonetic: "/ˌfʌndəˈmentl/",
    definition: "Forming the necessary base or core, or having central importance.",
    example: "Freedom of inquiry is a fundamental pillar of credible higher academic research.",
    collocations: ["fundamental principle", "fundamental shift", "fundamental importance"]
  },
  impede: {
    phonetic: "/ɪmˈpiːd/",
    definition: "To delay or stop the progress of something; to hinder.",
    example: "Cumbersome administrative red tape can seriously impede the growth of entrepreneurial ventures.",
    collocations: ["impede progress", "impede development", "seriously impede"]
  },
  indispensable: {
    phonetic: "/ˌɪndɪˈspensəbl/",
    definition: "Too important or valuable to be without; absolutely essential.",
    example: "Critical thinking is an indispensable competency for modern university graduates.",
    collocations: ["indispensable tool", "prove indispensable", "indispensable component"]
  },
  inevitable: {
    phonetic: "/ɪnˈevɪtəbl/",
    definition: "That you cannot avoid or prevent from happening.",
    example: "Given exponential computational advancement, widespread industry disruption was virtually inevitable.",
    collocations: ["inevitable outcome", "virtually inevitable", "inevitable consequence"]
  },
  mitigate: {
    phonetic: "/ˈmɪtɪɡeɪt/",
    definition: "To make something less harmful, serious, or severe; to alleviate.",
    example: "Comprehensive coastal reforestation helps mitigate the destructive impacts of tropical cyclones.",
    collocations: ["mitigate risks", "mitigate the effects", "mitigate climate change"]
  },
  paramount: {
    phonetic: "/ˈpærəmaʊnt/",
    definition: "More important than anything else; having supreme significance.",
    example: "Preserving patient data confidentiality is of paramount importance in healthcare management.",
    collocations: ["of paramount importance", "paramount concern", "paramount priority"]
  },
  prevalent: {
    phonetic: "/ˈprevələnt/",
    definition: "Common, widespread, or generally occurring in a particular place or time.",
    example: "Sedentary lifestyle habits have become alarmingly prevalent among modern desk workers.",
    collocations: ["widely prevalent", "increasingly prevalent", "prevalent attitude"]
  },
  scrutiny: {
    phonetic: "/ˈskruːtəni/",
    definition: "Careful, detailed, and thorough examination or inspection.",
    example: "Government spending allocations must remain subject to rigorous independent parliamentary scrutiny.",
    collocations: ["under close scrutiny", "intense scrutiny", "withstand scrutiny"]
  },
  substantial: {
    phonetic: "/səbˈstænʃl/",
    definition: "Large in amount, value, or importance; considerable.",
    example: "The renewable energy sector received substantial fiscal backing from institutional investors.",
    collocations: ["substantial increase", "substantial amount", "substantial progress"]
  },
  unprecedented: {
    phonetic: "/ʌnˈpresɪdentɪd/",
    definition: "Never having happened, occurred, or existed in the past; unparalleled.",
    example: "The rapid integration of machine learning algorithms represents an unprecedented technological milestone.",
    collocations: ["unprecedented scale", "unprecedented growth", "unprecedented challenge"]
  }
};

function cleanPdfLines(text) {
  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const cleaned = [];
  let currentLevel = 'B2';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.startsWith('© Oxford') || line.startsWith('The Oxford') || line.startsWith('--')) continue;
    if (line.includes('core word list') || line.includes('most important words') || line.includes('includes an additional') || line.includes('is the list of')) continue;
    if (/^\d+\s*\/\s*\d+$/.test(line)) continue;
    if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(line)) {
      currentLevel = line;
      continue;
    }

    if (cleaned.length > 0) {
      const prev = cleaned[cleaned.length - 1];
      if (/^[,\/]/.test(line) || /^(?:adv\.|adj\.|n\.|v\.|prep\.|number|conj\.|pron\.|det\.)/i.test(line)) {
        prev.raw += ' ' + line;
        continue;
      }
      if (/^\([a-z\s]+\)/i.test(line)) {
        prev.raw += ' ' + line;
        continue;
      }
    }

    cleaned.push({ raw: line, level: currentLevel });
  }
  return cleaned;
}

function parseEntry(raw, level, sourceList) {
  let clean = raw.replace(/([a-zA-Z]+)[1-9]\b/g, '$1').trim();

  // Special manual edge case adjustments
  if (clean.startsWith('a, an indefinite')) {
    return { word: 'a / an', pos: 'indefinite article', rawPos: 'article', level: 'A1', sourceList };
  }
  if (clean.startsWith('per cent')) {
    return { word: 'per cent', pos: 'noun / adverb', rawPos: 'n., adv.', level: 'A2', sourceList };
  }
  if (clean.includes('Wi-Fi')) {
    return { word: 'Wi-Fi', pos: 'noun', rawPos: 'n.', level: 'B1', sourceList };
  }

  let sense = '';
  const senseMatch = clean.match(/\(([^)]+)\)/);
  if (senseMatch) {
    sense = senseMatch[1];
    clean = clean.replace(/\([^)]+\)/, '').replace(/\s+/g, ' ').trim();
  }

  // Find part of speech
  const tokens = clean.split(/\s+/);
  let posIndex = -1;
  for (let i = 1; i < tokens.length; i++) {
    if (/^(v\.|n\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|modal|number|article|exclam)/i.test(tokens[i])) {
      posIndex = i;
      break;
    }
  }

  let word = '';
  let pos = '';
  if (posIndex !== -1) {
    word = tokens.slice(0, posIndex).join(' ').trim();
    pos = tokens.slice(posIndex).join(' ').trim();
  } else {
    word = tokens[0] || '';
    pos = tokens.slice(1).join(' ') || '';
  }

  word = word.replace(/[,;:]+$/, '').trim();

  let posLabel = pos;
  if (/^v\./i.test(pos)) posLabel = 'verb';
  else if (/^n\./i.test(pos)) posLabel = 'noun';
  else if (/^adj\./i.test(pos)) posLabel = 'adjective';
  else if (/^adv\./i.test(pos)) posLabel = 'adverb';
  else if (/^prep\./i.test(pos)) posLabel = 'preposition';
  else if (/^conj\./i.test(pos)) posLabel = 'conjunction';
  else if (/^pron\./i.test(pos)) posLabel = 'pronoun';
  else if (/^det\./i.test(pos)) posLabel = 'determiner';

  return {
    word,
    pos: posLabel || 'word',
    rawPos: pos,
    sense: sense || undefined,
    level,
    sourceList
  };
}

const f1 = path.join(__dirname, '../src/lib/pdf1_text.txt');
const f2 = path.join(__dirname, '../src/lib/pdf2_text.txt');

const c1 = cleanPdfLines(fs.readFileSync(f1, 'utf8'));
const c2 = cleanPdfLines(fs.readFileSync(f2, 'utf8'));

const entries = [];
for (const item of c2) {
  const p = parseEntry(item.raw, item.level, 'Oxford 3000');
  if (p.word && p.word.length >= 1) entries.push(p);
}
for (const item of c1) {
  const p = parseEntry(item.raw, item.level, 'Oxford 5000');
  if (p.word && p.word.length >= 1) entries.push(p);
}

const wordMap = new Map();
for (const e of entries) {
  const key = e.word.toLowerCase();
  if (!wordMap.has(key)) {
    wordMap.set(key, e);
  } else {
    const existing = wordMap.get(key);
    if (e.level === 'C1' || (e.level === 'B2' && existing.level !== 'C1')) {
      existing.level = e.level;
      existing.sourceList = e.sourceList;
    }
    if (!existing.sense && e.sense) existing.sense = e.sense;
    if (existing.pos === 'word' && e.pos !== 'word') existing.pos = e.pos;
  }
}

const finalWords = Array.from(wordMap.values()).map((w, index) => {
  const key = w.word.toLowerCase();
  const rich = RICH_DEFINITIONS[key];

  let definition = rich ? rich.definition : '';
  let example = rich ? rich.example : '';
  let collocations = rich ? rich.collocations : [];
  let phonetic = rich ? rich.phonetic : `/${w.word.toLowerCase()}/`;

  if (!definition) {
    if (w.sense) {
      definition = `(${w.sense}) Core Oxford ${w.level} ${w.pos}.`;
    } else {
      definition = `Oxford ${w.level} ${w.pos}. Click to inspect full definition, usage, and collocations.`;
    }
  }

  if (!example) {
    example = `Using "${w.word}" accurately demonstrates natural lexical precision in IELTS ${w.level === 'C1' || w.level === 'B2' ? 'academic' : 'everyday'} contexts.`;
  }

  return {
    id: `oxford-${index + 1}`,
    word: w.word,
    pos: w.pos,
    rawPos: w.rawPos,
    sense: w.sense,
    level: w.level,
    phonetic,
    definition,
    example,
    collocations: collocations && collocations.length > 0 ? collocations : [`use of ${w.word}`, `academic ${w.word}`],
    oxfordUrl: `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(w.word.toLowerCase())}`,
    sourceList: w.sourceList
  };
}).sort((a, b) => a.word.localeCompare(b.word));

console.log('Total processed words:', finalWords.length);
const counts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
for (const w of finalWords) counts[w.level] = (counts[w.level] || 0) + 1;
console.log('Final counts by level:', counts);

// Write to JSON file
const outJsonPath = path.join(__dirname, '../src/lib/oxfordVocabList.json');
fs.writeFileSync(outJsonPath, JSON.stringify(finalWords, null, 2), 'utf8');
console.log('Wrote to', outJsonPath);
