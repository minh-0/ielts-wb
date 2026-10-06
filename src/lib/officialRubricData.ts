export interface RubricRow {
  band: string;
  col1: string[];
  col2: string[];
  col3: string[];
  col4: string[];
}

export interface RubricDefinition {
  title: string;
  source: string;
  columns: [string, string, string, string];
  rows: RubricRow[];
}

export const WRITING_TASK_2_RUBRIC: RubricDefinition = {
  title: "Writing Task 2",
  source: "",
  columns: [
    "Task Response",
    "Coherence and Cohesion",
    "Lexical Resource",
    "Grammatical Range and Accuracy",
  ],
  rows: [
    {
      band: "9",
      col1: [
        "fully addresses all parts of the task",
        "presents a fully developed position in answer to the question with relevant, fully extended and well supported ideas",
      ],
      col2: [
        "uses cohesion in such a way that it attracts no attention",
        "skilfully manages paragraphing",
      ],
      col3: [
        "uses a wide range of vocabulary with very natural and sophisticated control of lexical features; rare minor errors occur only as 'slips'",
      ],
      col4: [
        "uses a wide range of structures with full flexibility and accuracy; rare minor errors occur only as 'slips'",
      ],
    },
    {
      band: "8",
      col1: [
        "sufficiently addresses all parts of the task",
        "presents a well-developed response to the question with relevant, extended and supported ideas",
      ],
      col2: [
        "sequences information and ideas logically",
        "manages all aspects of cohesion well",
        "uses paragraphing sufficiently and appropriately",
      ],
      col3: [
        "uses a wide range of vocabulary fluently and flexibly to convey precise meanings",
        "skilfully uses uncommon lexical items but there may be occasional inaccuracies in word choice and collocation",
        "produces rare errors in spelling and/or word formation",
      ],
      col4: [
        "uses a wide range of structures",
        "the majority of sentences are error-free",
        "makes only very occasional errors or inappropriacies",
      ],
    },
    {
      band: "7",
      col1: [
        "addresses all parts of the task",
        "presents a clear position throughout the response",
        "presents, extends and supports main ideas, but there may be a tendency to over-generalise and/or supporting ideas may lack focus",
      ],
      col2: [
        "logically organises information and ideas; there is clear progression throughout",
        "uses a range of cohesive devices appropriately although there may be some under-/over-use",
        "presents a clear central topic within each paragraph",
      ],
      col3: [
        "uses a sufficient range of vocabulary to allow some flexibility and precision",
        "uses less common lexical items with some awareness of style and collocation",
        "may produce occasional errors in word choice, spelling and/or word formation",
      ],
      col4: [
        "uses a variety of complex structures",
        "produces frequent error-free sentences",
        "has good control of grammar and punctuation but may make a few errors",
      ],
    },
    {
      band: "6",
      col1: [
        "addresses all parts of the task although some parts may be more fully covered than others",
        "presents a relevant position although the conclusions may become unclear or repetitive",
        "presents relevant main ideas but some may be inadequately developed/unclear",
      ],
      col2: [
        "arranges information and ideas coherently and there is a clear overall progression",
        "uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical",
        "may not always use referencing clearly or appropriately",
        "uses paragraphing, but not always logically",
      ],
      col3: [
        "uses an adequate range of vocabulary for the task",
        "attempts to use less common vocabulary but with some inaccuracy",
        "makes some errors in spelling and/or word formation, but they do not impede communication",
      ],
      col4: [
        "uses a mix of simple and complex sentence forms",
        "makes some errors in grammar and punctuation but they rarely reduce communication",
      ],
    },
    {
      band: "5",
      col1: [
        "addresses the task only partially; the format may be inappropriate in places",
        "expresses a position but the development is not always clear and there may be no conclusions drawn",
        "presents some main ideas but these are limited and not sufficiently developed; there may be irrelevant detail",
      ],
      col2: [
        "presents information with some organisation but there may be a lack of overall progression",
        "makes inadequate, inaccurate or over-use of cohesive devices",
        "may be repetitive because of lack of referencing and substitution",
        "may not write in paragraphs, or paragraphing may be inadequate",
      ],
      col3: [
        "uses a limited range of vocabulary, but this is minimally adequate for the task",
        "may make noticeable errors in spelling and/or word formation that may cause some difficulty for the reader",
      ],
      col4: [
        "uses only a limited range of structures",
        "attempts complex sentences but these tend to be less accurate than simple sentences",
        "may make frequent grammatical errors and punctuation may be faulty; errors can cause some difficulty for the reader",
      ],
    },
    {
      band: "4",
      col1: [
        "responds to the task only in a minimal way or the answer is tangential; the format may be inappropriate",
        "presents a position but this is unclear",
        "presents some main ideas but these are difficult to identify and may be repetitive, irrelevant or not well supported",
      ],
      col2: [
        "presents information and ideas but these are not arranged coherently and there is no clear progression in the response",
        "uses some basic cohesive devices but these may be inaccurate or repetitive",
        "may not write in paragraphs or their use may be confusing",
      ],
      col3: [
        "uses only basic vocabulary which may be used repetitively or which may be inappropriate for the task",
        "has limited control of word formation and/or spelling; errors may cause strain for the reader",
      ],
      col4: [
        "uses only a very limited range of structures with only rare use of subordinate clauses",
        "some structures are accurate but errors predominate, and punctuation is often faulty",
      ],
    },
    {
      band: "3",
      col1: [
        "does not adequately address any part of the task",
        "does not express a clear position",
        "presents few ideas, which are largely undeveloped or irrelevant",
      ],
      col2: [
        "does not organise ideas logically",
        "may use a very limited range of cohesive devices, and those used may not indicate a logical relationship between ideas",
      ],
      col3: [
        "uses only a very limited range of words and expressions with very limited control of word formation and/or spelling",
        "errors may severely distort the message",
      ],
      col4: [
        "attempts sentence forms but errors in grammar and punctuation predominate and distort the meaning",
      ],
    },
    {
      band: "2",
      col1: [
        "barely responds to the task",
        "does not express a position",
        "may attempt to present one or two ideas but there is no development",
      ],
      col2: ["has very little control of organisational features"],
      col3: [
        "uses an extremely limited range of vocabulary; essentially no control of word formation and/or spelling",
      ],
      col4: ["cannot use sentence forms except in memorised phrases"],
    },
    {
      band: "1",
      col1: ["answer is completely unrelated to the task"],
      col2: ["fails to communicate any message"],
      col3: ["can only use a few isolated words"],
      col4: ["cannot use sentence forms at all"],
    },
    {
      band: "0",
      col1: [
        "does not attend",
        "does not attempt the task in any way",
        "writes a totally memorised response",
      ],
      col2: ["does not attend"],
      col3: ["does not attend"],
      col4: ["does not attend"],
    },
  ],
};

export const WRITING_TASK_1_RUBRIC: RubricDefinition = {
  title: "Writing Task 1",
  source: "",
  columns: [
    "Task Achievement",
    "Coherence and Cohesion",
    "Lexical Resource",
    "Grammatical Range and Accuracy",
  ],
  rows: [
    {
      band: "9",
      col1: [
        "fully satisfies all the requirements of the task",
        "clearly presents a fully developed response",
      ],
      col2: [
        "uses cohesion in such a way that it attracts no attention",
        "skilfully manages paragraphing",
      ],
      col3: [
        "uses a wide range of vocabulary with very natural and sophisticated control of lexical features; rare minor errors occur only as 'slips'",
      ],
      col4: [
        "uses a wide range of structures with full flexibility and accuracy; rare minor errors occur only as 'slips'",
      ],
    },
    {
      band: "8",
      col1: [
        "covers all requirements of the task sufficiently",
        "presents, highlights and illustrates key features/bullet points clearly and appropriately",
      ],
      col2: [
        "sequences information and ideas logically",
        "manages all aspects of cohesion well",
        "uses paragraphing sufficiently and appropriately",
      ],
      col3: [
        "uses a wide range of vocabulary fluently and flexibly to convey precise meanings",
        "skilfully uses uncommon lexical items but there may be occasional inaccuracies in word choice and collocation",
        "produces rare errors in spelling and/or word formation",
      ],
      col4: [
        "uses a wide range of structures",
        "the majority of sentences are error-free",
        "makes only very occasional errors or inappropriacies",
      ],
    },
    {
      band: "7",
      col1: [
        "covers the requirements of the task",
        "(Academic) presents a clear overview of main trends, differences or stages",
        "(General Training) presents a clear purpose, with the tone consistent and appropriate",
        "clearly presents and highlights key features/bullet points but could be more fully extended",
      ],
      col2: [
        "logically organises information and ideas; there is clear progression throughout",
        "uses a range of cohesive devices appropriately although there may be some under-/over-use",
      ],
      col3: [
        "uses a sufficient range of vocabulary to allow some flexibility and precision",
        "uses less common lexical items with some awareness of style and collocation",
        "may produce occasional errors in word choice, spelling and/or word formation",
      ],
      col4: [
        "uses a variety of complex structures",
        "produces frequent error-free sentences",
        "has good control of grammar and punctuation but may make a few errors",
      ],
    },
    {
      band: "6",
      col1: [
        "addresses the requirements of the task",
        "(Academic) presents an overview with information appropriately selected",
        "(General Training) presents a purpose that is generally clear, there may be inconsistencies in tone",
        "presents and adequately highlights key features/bullet points but details may be irrelevant, inappropriate or inaccurate",
      ],
      col2: [
        "arranges information and ideas coherently and there is a clear overall progression",
        "uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical",
        "may not always use referencing clearly or appropriately",
      ],
      col3: [
        "uses an adequate range of vocabulary for the task",
        "attempts to use less common vocabulary but with some inaccuracy",
        "makes some errors in spelling and/or word formation, but they do not impede communication",
      ],
      col4: [
        "uses a mix of simple and complex sentence forms",
        "makes some errors in grammar and punctuation but they rarely reduce communication",
      ],
    },
    {
      band: "5",
      col1: [
        "generally addresses the task, the format may be inappropriate in places",
        "(Academic) recounts detail mechanically with no clear overview, there may be no data to support the description",
        "(General Training) may present a purpose for the letter that is unclear at times, the tone may be variable and sometimes inappropriate",
        "presents, but inadequately covers, key features/bullet points; there may be a tendency to focus on details",
      ],
      col2: [
        "presents information with some organisation but there may be a lack of overall progression",
        "makes inadequate, inaccurate or over-use of cohesive devices",
        "may be repetitive because of lack of referencing and substitution",
      ],
      col3: [
        "uses a limited range of vocabulary, but this is minimally adequate for the task",
        "may make noticeable errors in spelling and/or word formation that may cause some difficulty for the reader",
      ],
      col4: [
        "uses only a limited range of structures",
        "attempts complex sentences but these tend to be less accurate than simple sentences",
        "may make frequent grammatical errors and punctuation may be faulty, errors can cause some difficulty for the reader",
      ],
    },
    {
      band: "4",
      col1: [
        "attempts to address the task but does not cover all key features/bullet points; the format may be inappropriate",
        "(General Training) fails to clearly explain the purpose of the letter, the tone may be inappropriate",
        "may confuse key features/bullet points with detail; parts may be unclear, irrelevant, repetitive or inaccurate",
      ],
      col2: [
        "presents information and ideas but these are not arranged coherently and there is no clear progression in the response",
        "uses some basic cohesive devices but these may be inaccurate or repetitive",
      ],
      col3: [
        "uses only basic vocabulary which may be used repetitively or which may be inappropriate for the task",
        "has limited control of word formation and/or spelling, errors may cause strain for the reader",
      ],
      col4: [
        "uses only a very limited range of structures with only rare use of subordinate clauses",
        "some structures are accurate but errors predominate, and punctuation is often faulty",
      ],
    },
    {
      band: "3",
      col1: [
        "fails to address the task, which may have been completely misunderstood",
        "presents limited ideas which may be largely irrelevant/repetitive",
      ],
      col2: [
        "does not organise ideas logically",
        "may use a very limited range of cohesive devices, and those used may not indicate a logical relationship between ideas",
      ],
      col3: [
        "uses only a very limited range of words and expressions with very limited control of word formation and/or spelling",
        "errors may severely distort the message",
      ],
      col4: [
        "attempts sentence forms but errors in grammar and punctuation predominate and distort the meaning",
      ],
    },
    {
      band: "2",
      col1: ["answer is barely related to the task"],
      col2: ["has very little control of organisational features"],
      col3: [
        "uses an extremely limited range of vocabulary; essentially no control of word formation and/or spelling",
      ],
      col4: ["cannot use sentence forms except in memorised phrases"],
    },
    {
      band: "1",
      col1: ["answer is completely unrelated to the task"],
      col2: ["fails to communicate any message"],
      col3: ["can only use a few isolated words"],
      col4: ["cannot use sentence forms at all"],
    },
    {
      band: "0",
      col1: [
        "does not attend",
        "does not attempt the task in any way",
        "writes a totally memorised response",
      ],
      col2: ["does not attend"],
      col3: ["does not attend"],
      col4: ["does not attend"],
    },
  ],
};

export const SPEAKING_RUBRIC: RubricDefinition = {
  title: "Speaking Test",
  source: "",
  columns: [
    "Fluency and Coherence",
    "Lexical Resource",
    "Grammatical Range and Accuracy",
    "Pronunciation",
  ],
  rows: [
    {
      band: "9",
      col1: [
        "speaks fluently with only rare repetition or self-correction; any hesitation is content-related rather than to find words or grammar",
        "speaks coherently with fully appropriate cohesive features",
        "develops topics fully and appropriately",
      ],
      col2: [
        "uses vocabulary with full flexibility and precision in all topics",
        "uses idiomatic language naturally and accurately",
      ],
      col3: [
        "uses a full range of structures naturally and appropriately",
        "produces consistently accurate structures apart from 'slips' characteristic of native speaker speech",
      ],
      col4: [
        "uses a full range of pronunciation features with precision and subtlety",
        "sustains flexible use of features throughout",
        "is effortless to understand",
      ],
    },
    {
      band: "8",
      col1: [
        "speaks fluently with only occasional repetition or self-correction; hesitation is usually content-related and only rarely to search for language",
        "develops topics coherently and appropriately",
      ],
      col2: [
        "uses a wide vocabulary resource readily and flexibly to convey precise meaning",
        "uses less common and idiomatic vocabulary skilfully, with occasional inaccuracies",
        "uses paraphrase effectively as required",
      ],
      col3: [
        "uses a wide range of structures flexibly",
        "produces a majority of error-free sentences with only very occasional inappropriacies or basic/non-systematic errors",
      ],
      col4: [
        "uses a wide range of pronunciation features",
        "sustains flexible use of features, with only occasional lapses",
        "is easy to understand throughout; L1 accent has minimal effect on intelligibility",
      ],
    },
    {
      band: "7",
      col1: [
        "speaks at length without noticeable effort or loss of coherence",
        "may demonstrate language-related hesitation at times, or some repetition and/or self-correction",
        "uses a range of connectives and discourse markers with some flexibility",
      ],
      col2: [
        "uses vocabulary resource flexibly to discuss a variety of topics",
        "uses some less common and idiomatic vocabulary and shows some awareness of style and collocation, with some inappropriate choices",
        "uses paraphrase effectively",
      ],
      col3: [
        "uses a range of complex structures with some flexibility",
        "frequently produces error-free sentences, though some grammatical mistakes persist",
      ],
      col4: [
        "shows all the positive features of Band 6 and some, but not all, of the positive features of Band 8",
      ],
    },
    {
      band: "6",
      col1: [
        "is willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation",
        "uses a range of connectives and discourse markers but not always appropriately",
      ],
      col2: [
        "has a wide enough vocabulary to discuss topics at length and make meaning clear in spite of inappropriacies",
        "generally paraphrases successfully",
      ],
      col3: [
        "uses a mix of simple and complex structures, but with limited flexibility",
        "may make frequent mistakes with complex structures though these rarely cause comprehension problems",
      ],
      col4: [
        "uses a range of pronunciation features with mixed control",
        "shows some effective use of features but this is not sustained",
        "can generally be understood throughout, though mispronunciation of individual words or sounds reduces clarity at times",
      ],
    },
    {
      band: "5",
      col1: [
        "usually maintains flow of speech but uses repetition, self correction and/or slow speech to keep going",
        "may over-use certain connectives and discourse markers",
        "produces simple speech fluently, but more complex communication causes fluency problems",
      ],
      col2: [
        "manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility",
        "attempts to use paraphrase but with mixed success",
      ],
      col3: [
        "produces basic sentence forms with reasonable accuracy",
        "uses a limited range of more complex structures, but these usually contain errors and may cause some comprehension problems",
      ],
      col4: [
        "shows all the positive features of Band 4 and some, but not all, of the positive features of Band 6",
      ],
    },
    {
      band: "4",
      col1: [
        "cannot respond without noticeable pauses and may speak slowly, with frequent repetition and self-correction",
        "links basic sentences but with repetitious use of simple connectives and some breakdowns in coherence",
      ],
      col2: [
        "is able to talk about familiar topics but can only convey basic meaning on unfamiliar topics and makes frequent errors in word choice",
        "rarely attempts paraphrase",
      ],
      col3: [
        "produces basic sentence forms and some correct simple sentences but subordinate structures are rare",
        "errors are frequent and may lead to misunderstanding",
      ],
      col4: [
        "uses a limited range of pronunciation features",
        "attempts to control features but lapses are frequent",
        "mispronunciations are frequent and cause some difficulty for the listener",
      ],
    },
    {
      band: "3",
      col1: [
        "speaks with long pauses",
        "has limited ability to link simple sentences",
        "gives only simple responses and is frequently unable to convey basic message",
      ],
      col2: [
        "uses simple vocabulary to convey personal information",
        "has insufficient vocabulary for less familiar topics",
      ],
      col3: [
        "attempts basic sentence forms but with limited success, or relies on apparently memorised utterances",
        "makes numerous errors except in memorised expressions",
      ],
      col4: [
        "shows some of the features of Band 2 and some, but not all, of the positive features of Band 4",
      ],
    },
    {
      band: "2",
      col1: ["pauses lengthily before most words; little communication possible"],
      col2: ["only produces isolated words or memorised utterances"],
      col3: ["cannot produce basic sentence forms"],
      col4: ["speech is often unintelligible"],
    },
    {
      band: "1",
      col1: ["no communication possible"],
      col2: ["no rateable language"],
      col3: ["cannot use sentence forms"],
      col4: ["speech is unintelligible"],
    },
    {
      band: "0",
      col1: ["does not attend"],
      col2: ["does not attend"],
      col3: ["does not attend"],
      col4: ["does not attend"],
    },
  ],
};
