# Project Context: IELTSlayer666 (light)

*Last updated: 2026-10-18 11:08*

> **MANDATORY MAINTENANCE DIRECTIVE**: Update this `PROJECT_CONTEXT.md` document after EVERY code modification, feature addition, refactoring, or UI redesign. Keep architecture, component maps, design standards, and git commit history strictly current.

---

### 1. Identity & Tech Stack
- **Project Name**: `IELTSlayer666` (Browser tab title: `light`, repository root: `e:/contest`).
- **Core Purpose**: High-precision, examiner-grade diagnostic practice suite for IELTS Writing (Task 1 & 2) and Speaking (Parts 1, 2, 3) aligned strictly with official British Council, IDP, and Cambridge band descriptors.
- **Tech Stack**:
  - **Framework**: Next.js 16.3.8 (App Router, Turbopack enabled)
  - **Language**: TypeScript (strict mode, 0 build/lint errors)
  - **Styling**: Tailwind CSS (dark mode via `class` strategy)
  - **Icons**: `lucide-react`
  - **AI Engine**: Google Gemini API (`gemini-3.8-flash` primary with fallback to `gemini-2.5-flash`), plus a realistic offline mock diagnostic engine when no API key is provided.
  - **Audio/Voice**: Browser `MediaRecorder` + Web Speech API for real-time speech recognition.
  - **Exporting**: HTML5 Canvas rendering for 1080x1350 PNG scorecard generation.

---

### 2. Design System & Aesthetic Principles
- **Minimalist Studio Aesthetic (The Examiner's Workbench)**: Inspired by Linear, Raycast, and iA Writer. No marketing billboards, promotional banners, purple-blue gradients, glassmorphism cards, glowing blobs, floating dashboards, or corporate buzzwords ("unlock", "supercharge", "streamline", "seamless").
- **Memorable Minimalist Hero**:
  - High-impact headline: *"Real examiner standards. Without the AI flattery."*
  - Specific human copy articulating the value proposition: benchmarks against official Cambridge/IDP public descriptors, 50 verified human examiner Task 1 models (Simon Corcoran & Cambridge books), and 100 Task 2 prompts without artificial score inflation.
  - Clear conversion pathways: "Start Writing Session", "Simulate Speaking", direct jump links to 50 Task 1 charts and 100 Task 2 prompt categories.
  - Four hairline audit blocks detailing bank assets and privacy.
  - Built-in "Focus Mode" toggle: allows candidates to collapse/expand the hero with persistent `localStorage` preference.
- **Professional Typography Architecture**:
  - **Interface Sans (`--font-sans` / `Plus Jakarta Sans`)**: Modern, geometric, high-precision sans-serif engineered for clean interfaces and executive contrast. Replaces generic default fonts.
  - **Technical Monospace (`--font-mono` / `JetBrains Mono`)**: The industry-standard monospaced typeface for all technical stamps, timers, word counts, CEFR badges, and band metrics. Tabular numerals prevent jitter.
  - **High-Contrast Editorial Serif (`--font-serif` & `--font-display` / `Playfair Display`)**: Inspired by Paradose (Wasabib Studio) and Playfair Display (Claus Eggers Sørensen). Used across the hero headline, brand title, model essays, and scorecard titles to provide a high-end, classic British publishing aesthetic.
  - **Tailwind v4 Theme Binding**: Explicit `@theme` mapping in `globals.css` ensuring `font-sans`, `font-mono`, `font-serif`, and `font-display` utilities resolve to Google Fonts on Windows and all platforms rather than falling back to system defaults.
- **Top Navigation Layout**: Navigation tabs (`Writing`, `Speaking`, `Vocabulary`, `Rubric`) are right-aligned alongside utility actions (`AI Mode` and `ThemeToggle`), leaving the left cleanly anchored to the brand title.
- **Palette & Atmospheric Hero Gradient Theme**:
  - Pure monochrome neutral scales for core workbenches (`border-neutral-200 dark:border-neutral-800`, `bg-white dark:bg-neutral-950`, `bg-neutral-50/80 dark:bg-neutral-900/40`).
  - **Light Mode Academic Red Accents**: Retains the rich British academic red/crimson aesthetic in light mode (`bg-gradient-to-b from-red-50/35 via-white to-neutral-50/60`, red/rose ambient radial glows, `border-red-200/60` metadata pill with red/rose indicator, and dynamic text shining in `from-red-700 via-rose-700 to-red-800`).
  - **Dark Mode Cosmic Aurora Palette**: Harmonizes dark mode with an **Emerald-Teal-Cyan** gradient system (`dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400`), perfectly matching the ambient emerald (`emerald-500/15`) and cyan (`cyan-500/12`) background glows and pill dot without harsh pink dissonance.
- **Dark Mode Comfort**: High-contrast glare eliminated. Grammar mistakes use softened muted rose/red (`dark:text-rose-300/80 dark:bg-rose-950/30`), vocabulary upgrades use soft violet (`dark:text-purple-300/80 dark:bg-purple-950/30`), and replaced words use soft emerald.
- **Modals**: All modals (`ApiKeyModal`, `OxfordModal`, `ScorecardModal`, `SpeakingQuestionPickerModal`, and the Writing Popup Modal) close cleanly on outside blank-space backdrop click or `Escape` key press.

---

### 3. Core Feature Architecture

#### A. Writing Studio (`src/components/writing/WritingStudio.tsx`)
- **Task Switcher**: Clean minimalist toggle for `Task 2`, `Task 1 Academic`, and `Task 1 General`.
- **Focused Writing Popup Modal (`isWritingModalOpen`)**:
  - **Explicit Enlarge Only**: Clicking or focusing the writing paragraph box stays comfortably in standard view. Enlarging into fullscreen modal occurs **strictly when clicking the dedicated 'Enlarge' button**.
  - **Single Paste Button**: Exactly 1 visible Paste button in the popup header (duplicate button and char counter removed from footer for minimalist focus).
  - **Clean Header Controls**: Modal header contains live status badge, single word counter, timer with start/pause, 1 Paste button, 1 Save button, and 1 clean `X` close button.
  - **Simplified Placeholder**: Clean, quiet `"Start writing..."` placeholder across all textareas.
  - **Single Word Count**: Exactly 1 unified live word counter `{wordCount} / {targetWords} words` across normal and modal views.
  - **Task 1 Split Layout**: When working on Task 1, the question prompt and uploaded chart/graph image are situated on the **left side** column, while the writing textarea expands on the right column. An in-modal upload dropzone allows attaching reference graphics on the fly.
  - **Task 2 Top-Down Layout**: When working on Task 2, the essay question prompt card spans across the **top**, with an expansive full-height writing textarea directly underneath.
  - **Live Synchronized Controls**: Real-time timer with start/pause/reset, dynamic word count tracking against band target, Escape shortcut dismissal, and direct "Evaluate with Rubric" submission.
- **Online Essay & Band Score Saving (`/api/saved-essays` & `SavedEssaysModal.tsx`)**:
  - **Server-Side Persistence**: Dedicated REST API endpoint (`GET`, `POST`, `DELETE /api/saved-essays`) storing user drafts, final essays, estimated band scores, criteria breakdowns, word counts, and timestamps in server storage (`data/saved_essays.json`) alongside automatic client `localStorage` caching.
  - **1-Click Save**: Prominent "Save" button in both the editor toolbar and modal header with animated confirmation.
  - **Saved Essays Drawer/Modal**: "Saved (count)" button in the top action bar opens a clean viewer to inspect past essays, view estimated band scores, load any essay back into the studio, or delete records.
- **Question & Graph Handling**:
  - Built-in prompt bank (`src/lib/ieltsPromptBank.ts`).
  - `+ Custom topic` input mode.
  - **Task 1 Visual Graph Upload**: Users can upload `.png, .jpg, .webp` chart/graph images. Thumbnails preview directly above the text area while writing, and images are passed as base64 `inlineData` to Gemini for multimodal visual accuracy checking.
- **100 Task 2 Question Bank & Model Essays (`src/lib/task2QuestionsData.ts` & `src/lib/ieltsPromptBank.ts`)**:
  - 100 authentic IELTS Task 2 prompts covering 10 core exam themes (Technology & AI, Education, Environment & Energy, Society, Government & Public Policy, Work & Careers, Health & Lifestyle, Crime & Justice, Media & Culture, Family & Relationships).
  - Every single question includes an authentic, fully developed Band 8.5–9.0 model essay (~250–320 words) with essay type classification (`opinion`, `discussion`, `advantages_disadvantages`, `problem_solution`, `double_question`).
- **Strict Topic Relevance & Off-Topic Penalty (Cambridge Band 2.0 Descriptors)**:
  - **Relevance Evaluator (`evaluateTopicRelevance`)**: Analyzes keyword and semantic stem overlap against thematic clusters (Education, Work, Climate, Technology, Health, Family, Crime, Demographics, etc.).
  - **Off-Topic Detection & Score Cap**: If an essay is completely unrelated to the prompt (e.g. pasting an essay on modern technology for a demographics/population chart, or pasting an irrelevant pre-memorized script):
    - Task Achievement / Task Response is strictly docked to **Band 2.0** (`Band 2.0 (Completely Off-Topic / Unrelated to Task)`).
    - Coherence is capped at Band 2.5 and Lexical Resource at Band 4.0; overall score is capped at **Band 2.5 – 3.0**.
    - An in-text `task_response` critique highlights the topic divergence and instructs the candidate to address the specific question.
    - Double-guaranteed across both Live Gemini AI mode (prompt rules + server validator) and the offline heuristic engine.
- **50 Authentic Human-Examiner Task 1 Question Bank & SVGs (`src/lib/task1AcademicData.ts`, `public/task1/`, `src/lib/ieltsPromptBank.ts`)**:
  - 50 authentic IELTS Academic Task 1 prompts with **100% human-written Band 9.0 model essays** by authentic examiners: Simon Corcoran (former British Council examiner) and Cambridge University Press Official Examiner Answer Keys (Cambridge Books 3–18).
  - Covers all canonical visual types:
    1. Line Graphs (Q1–Q10): Internet usage, waste output, electricity in France, aging populations, fast food, CO2 emissions, oil production, US meat/poultry, UK car ownership, train punctuality.
    2. Bar Charts (Q11–Q20): European consumer spending, Australian exercise by gender, further education, leisure time, home ownership, telephone calls, employment sectors, university qualifications, Olympic medals, computer ownership.
    3. Pie Charts (Q21–Q28): Domestic water use, global water consumption, household expenditure (Japan/Malaysia), electricity generation (Germany/France), French energy sources, global consumer spending, student faculties, renewable capacity.
    4. Tables (Q29–Q36): Australian poverty rates, Ashdown Museum visitors/satisfaction, underground railway networks, Australian water tariffs, international tourism receipts, healthcare expenditure (% GDP), European spending, transit fleet operations.
    5. Mixed & Combined Charts (Q37–Q42): Police budgets (Table + Pie), weekly income vs spending (Bar + Line), municipal spending, cultural attraction attendance, university applications, city climates.
    6. Processes & Manufacturing (Q43–Q46): Cement and concrete production, brick manufacture, plastic bottle recycling, geothermal power generation.
    7. Natural Life Cycles (Q47–Q48): Honeybee life cycle, silkworm life cycle and silk cloth production.
    8. Maps & Urban Redevelopment (Q49–Q50): Village of Chorleywood (1868–1994), Village of Stokeford (1930 vs 2010).
  - **Custom Vector SVGs (`public/task1/task1_001.svg` to `task1_050.svg`)**: Tailored vector graphics displaying the exact numbers, categories, and labels reported in the examiner essays.
  - **Full UI Integration**: Renders visual graphics in Question Card, Browse modal thumbnails, Split Writing modal, and Model Essay tab.
- **Interactive Question Card & Question Picker Modal (`QuestionPickerModal.tsx`)**:
  - Replaced cramped native select dropdown with a sleek interactive Question Card showing topic badges, essay format pills, and Band 9.0 availability.
  - **Question Controls**: Icon-only "Random" button (`Shuffle` icon) to quickly draw prompts, and a clean "Browse" button to open the question bank.
  - **Question Picker Modal (`QuestionPickerModal.tsx`)**: Minimalist Command-Palette style popup with live search, clean popout topic dropdown menu, popout format selector, icon-only random picker, and sleek scannable question items without unnecessary footer text.
- **Model Essay Tab & Cleaned Feedback Tabs**:
  - Removed redundant "Sentence Diff Archive" tab from post-analysis feedback.
  - Post-analysis tabs streamlined to 2 core views: **Criteria Breakdown** and **Model Essay**.
  - **Model Essay Tab**: Renders authentic Band 9.0 model essay with examiner commentary, exact word count badge, and 1-click copy button.
- **Interactive In-Text Paragraph View (`AnnotatedParagraph.tsx`)**:
  - Highlights grammar errors (red wavy), vocabulary upgrades (violet dashed), and replaced words (emerald solid).
  - Clicking any underlined span displays an interactive popover with examiner rationale, 1-click **"Apply Higher-Rated Word"** or **"Revert"** button, and an **"Ignore"** button (`EyeOff` icon) to dismiss the suggestion.
  - **Edit Mode Popup Hint**: When users rapidly click or double-click on the essay text while in Annotated mode, the studio detects that they may be trying to edit the text and displays a small popover tooltip directly above the "Edit" button ("Click here to edit essay"). Clicking the tooltip or the Edit button immediately switches the view to Edit mode.
- **Criteria Breakdown & Band 8–9 Assessment Standards Redesign**:
  - Balanced lines vs. boxes: removed harsh cage-like vertical column dividers (`xl:border-r`) and header underlines, relying on generous grid spacing (`gap-6`).
  - Encapsulated actionable Recommendations and Band 7.0 vs Band 8.5+ comparison quotes in subtle muted cards (`bg-neutral-50/80 dark:bg-neutral-900/40 rounded-xl p-3`).
  - **Removed Red & Green Vertical Lines**: Replaced harsh `border-l-2` colored vertical bars on Band 7.0 / 8.5+ quotes with subtle contrast badge pills (`[Band 7.0]` and `[Band 8.5+]`) and soft hairline row dividers.
- **Theme Toggle Button (`ThemeToggle.tsx` & `animated-theme-toggler.tsx`)**:
  - Removed border around the theme switch button (`border border-black/10 dark:border-white/15` removed).
  - Increased button dimensions to `w-9 h-9 sm:w-10 sm:h-10 rounded-xl` and scaled icons to `w-4.5 h-4.5` for better proportion and hit area.
  - Ignoring a suggestion removes its underline from the paragraph and hides it from active inspector counts.
- **Inspector Panel (`DiagnosticInspector.tsx`)**:
  - Minimalist pre-submission empty state with quiet target indicator and compact color legend (no loud boxes or verbose tutorials).
  - Post-submission live criteria breakdown scores (TR/TA, CC, LR, GRA).
  - Real-time grammar & vocabulary upgrade suggestions.
  - **Ignore & Restore Capability**: Every error and vocabulary card includes an "Ignore" action. When ignored, items move to an **"Ignored ({count})"** filter pill where the user can inspect or click **"Restore"** (`RotateCcw` icon) to bring them back.
  - **Protected Batch Application**: "Apply All Upgrades" selectively skips all ignored suggestions so dismissed recommendations are never forcefully applied.
- **Scorecard Modal (`ScorecardModal.tsx`)**:
  - Generates downloadable 1080x1350 PNG report with band scores, primary bottleneck, and candidate summary branded `slayer6767`.

#### B. Speaking Studio (`src/components/speaking/SpeakingStudio.tsx` & `src/lib/speakingAuthenticData.ts`)
- **Deterministic Architecture (Strictly Zero AI Grading)**: Automated AI speech grading and synthetic band estimation eliminated in favor of active scaffolding, deterministic acoustic telemetry, and authentic human examiner comparison.
- **Authentic Human Material (48 Real Cambridge Tests)**: Every question, Band 6.0 candidate transcript, and Band 9.0 model transcript is 100% authentic human material sourced strictly from official Cambridge IELTS Practice Books (11–19), Simon Corcoran (`ielts-simon.com`), and IDP/British Council examiner sample logs with explicit `sourceBadge` attribution:
  - **16 Part 1 Real Tests**: Hometown & Living, Reading & Books, Public Transport, Daily Routine, Work & Education, Home & Accommodation, Technology & Apps, Art & Culture, Weather & Climate, Music & Performing Arts, Food & Culinary Habits, Sports & Physical Exercise, Parks & Green Spaces, Languages & Linguistics, Clothing & Fashion, Photography & Digital Media.
  - **16 Part 2 Real Cue Cards**: Influential People, Important Decisions, Travel & Journeys, Environment & Ecology, History & Heritage, Technology & Gadgets, Life Experiences & Patience, Business & Entrepreneurship, Literature & Philosophy, Ambition & Personal Goals, Interpersonal Relationships, Culture & Festivals, Education & Lifelong Learning, Urban Planning & Community, Memorable Moments, Environmental Legislation.
  - **16 Part 3 Real Discussion Tests**: Decision-Making & Society, Education & Technology, Heritage & Conservation, Careers & Workplace, History & Cultural Heritage, Technology & Society, Consumer Psychology & Speed, Commerce & Local Economy, Literature & Digital Reading, Philosophy of Success, Organizational Psychology, Globalization & Culture, Employment & Higher Education, Urban Planning & Society, Media & Journalism, Environmental Economics.
- **Top Studio Bar**:
  - Sentence-case Part Switcher (`Part 1`, `Part 2`, `Part 3`).
  - Timer Mode Toggle:
    - `Standard`: Open practice without forced cutoff.
    - `Exam`: Strict exam conditions with automatic cutoff at duration limit.
    - `4-3-2 Drill`: Fluency automaticity drill across 3 shrinking rounds (2:00 -> 1:30 -> 1:00) requiring the candidate to deliver the same cue card answer in less time, forcing condensation of hesitation, elimination of filler words, and rapid syntactic retrieval.
  - **Dynamic Micro-Explainer**: Minimalist, single-line guide situated directly beneath the mode buttons (`Standard • Open practice without forced cutoff`, `Exam • Strict test conditions with auto-cutoff at time limit`, `4-3-2 Drill • 3 shrinking rounds (2:00 → 1:30 → 1:00) for fluency`), providing instant context without taking vertical space.
  - **Command-Palette Question Browser Modal (`SpeakingQuestionPickerModal.tsx`)**:
    - Renamed launch trigger from "Browse Bank" to sleek "Browse".
    - Removed harsh outer borders/outlines on popup modals (`border border-neutral-200 dark:border-neutral-800` purged in favor of clean `rounded-2xl shadow-2xl` elevation) across Speaking Browser, Writing Question Picker, Saved Essays, API Key, Oxford Dictionary, and Scorecard modals.
    - Removed box styling around 'All Parts' and 'All Topics' filter buttons; converted them to borderless dropdown toggles.
    - Fixed dropdown clipping bug by resolving `overflow-x-auto` on the filter container.
    - Softened prompt row separators into ultra-subtle hairline dividers (`divide-neutral-200/25 dark:divide-white/5`).
    - Redesigned selected prompt styling: removed stark white outline (`border-l-2 border-neutral-100`) and replaced it with a sleek, lighter tinted background (`bg-neutral-100 dark:bg-neutral-800/80`) optimized for high-contrast readability in both light and dark modes, paired with a quiet `Selected` check indicator.
- **Active Scaffolding Strip**: Real-time target C1/C2 collocations (violet to emerald transition upon check/recognition) with manual verification toggle + grammar target formula.
- **Card-Based Minimalist Architecture (Zero Cluttered Inner Small Boxes)**:
  - **Part 2 Scratchpad**: 60-second prep countdown timer + 4 frameless keyword inputs (`1. Context`, `2. Core Detail`, `3. Impact`, `4. Outcome`) with subtle bottom border indicators (`border-b border-neutral-200 dark:border-neutral-800`).
  - **Pacing Timeline**: Frameless multi-segment progress bar with high-contrast pills (`bg-neutral-300 dark:bg-neutral-700` inactive, `bg-neutral-500` past, `bg-emerald-500` active) and clear readable timestamps (`0:00 - 0:30`, etc.) and milestone titles without washed-out opacity.
- **Recording Console & User Voice Playback**:
  - **Synthetic Audio Purged**: Removed all examiner TTS / audio playback buttons so candidates focus purely on active speaking.
  - **High-Visibility Playback Button**: Prominent "Play Voice" / "Pause Voice" button (`Play` / `Pause` icon) that appears immediately after recording, accompanied by an interactive scrub bar (scrubber slider, elapsed/total timestamps, and 1x/1.25x/1.5x speed toggle).
  - **Responsive Waveform Box**: HTML5 canvas live waveform visualization dynamically adapting to light mode (`bg-neutral-50/80` with emerald stroke `#059669`) and dark mode (`bg-neutral-950` with emerald stroke `#10b981`), eliminating harsh black rectangles in light mode.
- **Progressive Reveal Workspace**:
  - **Clean Audio Focus (Spoken Transcript Purged)**: Removed the speech-to-text candidate spoken transcript feature to keep practice clean, fast, and focused on voice recording and acoustic self-playback without distracting STT inaccuracies.
  - **Speaking Assessment Checklist**: Renamed and clarified the self-audit into an intuitive, formal 4-point checklist (evaluating direct answering, fluent pacing without pauses over 2s, natural collocation usage, and complex clause formation) without confusing acronyms or academic jargon.
  - **Authentic Examiner Model Answers**: Collapsible progressive accordion ("Reveal Models" / "Hide Models") to prevent visual clutter. Comparative grid displaying Authentic Band 6.0 Candidate Transcript vs. Authentic Band 9.0 Model with identical typography, examiner critiques, and contextual C1/C2 highlights.
- **Light Mode Contrast Optimization**:
  - Comprehensive contrast tuning: secondary labels, timestamps, placeholders, borders, and indicators elevated from washed-out gray (`text-neutral-400`) to crisp `text-neutral-600` / `text-neutral-700` (`dark:text-neutral-300` / `dark:text-neutral-400`), meeting WCAG contrast standards.

#### C. Official Public Band Descriptors Rubric (`src/components/rubric/RubricViewer.tsx` & `src/lib/officialRubricData.ts`)
- Complete official public band descriptor tables for:
  - **Writing Task 2**: Bands 9 down to 0 across TR, CC, LR, GRA.
  - **Writing Task 1**: Bands 9 down to 0 across TA, CC, LR, GRA.
  - **Speaking Test**: Bands 9 down to 0 across FC, LR, GRA, PR.
- Pure table layout without redundant subtitles, search pills, or ownership disclaimers.

#### D. Cursor Selection Toolbar & Oxford Dictionary (`src/components/SelectionToolbar.tsx` & `src/components/OxfordModal.tsx`)
- **Strict Paragraph Isolation**: The floating toolbar ONLY activates when selecting text inside a rendered essay paragraph (`[data-paragraph="true"]` / `.ielts-paragraph`). Does NOT pop up on buttons, headers, questions, or rubric text.
- **Highlighting Rules**: Users can color-highlight text with yellow, green, blue, pink, or orange. A word can only be highlighted once (clicking another color updates it; clicking the same color un-highlights it; eraser tool clears it).
- **Built-in Oxford Learner's Dictionary**: Clicking "Oxford" looks up the selected word in the local CEFR dictionary (`src/lib/oxfordDictionary.ts`), complete with definition, authentic IELTS example, collocations, and speech synthesis UK/US audio pronunciation.

#### E. Vocabulary Learning Studio (`src/components/vocabulary/VocabularyStudio.tsx` & `src/lib/oxfordVocabData.ts`)
- **Complete Oxford 3000™ & Oxford 5000™ Corpus**: 4,953 words categorized across CEFR levels (C1 Advanced: 1,311, B2 Upper-Int: 1,410, B1: 648, A2: 733, A1: 851).
- **Two Dedicated Minimalist Learning Modes**:
  1. **Flashcards**: Active recall study card with 3D flip, keyboard controls (Space to flip, arrows to navigate, M to master, S to star), UK audio pronunciation (`SpeechSynthesis`), definition, IELTS usage example, collocations, and Oxford Dictionary direct link.
  2. **Word Explorer**: Instant search, alphabetical A-Z quick jump, POS filter, paginated grid, and detailed word inspection modal.
- **Topic Selection Popout Dropdown**: Replaced horizontal overflowing button strips in Collocations with a sleek popout dropdown (`ChevronDown` toggle, outside click dismissal, item search/selection), matching the Question Picker modal style.
- **Progress Persistence**: Starred (`oxford_starred`) and Mastered (`oxford_mastered`) word state stored in `localStorage`.

---

### 4. Key Files Map
- `src/app/page.tsx`: Root page hosting tab switching (`Writing`, `Speaking`, `Vocabulary`, `Rubric`), minimalist layout, and footer.
- `src/app/layout.tsx`: Root HTML shell, dark mode theme script, metadata `title: "slayer6767"`.
- `src/components/Navbar.tsx`: Sticky minimalist navigation with `IELTSlayer666` badge, studio switcher, and AI mode status.
- `src/components/start/StartPage.tsx`: Welcome portal featuring the official Magic UI Bento Grid, BentoCard, and Marquee components with rich interactive backgrounds for Writing, Speaking, Collocations, Vocabulary, and Band Descriptors.
- `src/components/magicui/bento-grid.tsx`: Official Magic UI BentoGrid and BentoCard implementation featuring signature light depth shadows, dark inset glow, GPU hover translations, scale animations, and sliding action CTA indicators.
- `src/components/magicui/marquee.tsx`: Official Magic UI Marquee component for infinite horizontal and vertical scrolling loops with pause-on-hover and reverse support.
- `src/components/magicui/shiny-button.tsx`: Official Magic UI ShinyButton with motion-driven glossy light sweep across border and text, supporting light and dark modes.
- `src/components/magicui/shimmer-button.tsx`: Official Magic UI ShimmerButton with rotating perimeter conic gradient beam.
- `src/components/magicui/interactive-hover-button.tsx`: Official Magic UI InteractiveHoverButton with expanding background bubble and directional arrow sliding.
- `src/components/magicui/animated-shiny-text.tsx`: Official Magic UI AnimatedShinyText with specular light glare panning across text.
- `src/components/writing/WritingStudio.tsx`: Writing studio core, image upload, essay textarea, timer, save feature, and scorecards.
- `src/components/writing/SavedEssaysModal.tsx`: Minimalist modal to view, reload, and manage saved essays and estimated scores.
- `src/components/writing/AnnotatedParagraph.tsx`: Non-overlapping in-text underlines and fix applicator.
- `src/components/writing/DiagnosticInspector.tsx`: Side panel for criteria breakdown and sentence diffs.
- `src/components/speaking/SpeakingStudio.tsx`: Speaking recording workbench, adaptive waveform canvas, 75+ prompt bank, scratchpad, pacing timeline, and comparative model views.
- `src/components/speaking/SpeakingQuestionPickerModal.tsx`: Minimalist question bank browser modal with keyword search, Part & Topic filters, and random prompt drawer.
- `src/lib/speakingAuthenticData.ts`: 75+ authentic human speaking prompts (Parts 1, 2, 3), Band 6.0 audio logs, and Band 9.0 model transcripts with C1/C2 collocations.
- `src/components/vocabulary/VocabularyStudio.tsx`: Vocabulary learning studio (Flashcards, Word Explorer, and Collocation popout dropdown).
- `src/lib/oxfordVocabData.ts`: Oxford 3000/5000 metadata and lookup helpers.
- `src/lib/oxfordVocabList.json`: Pre-compiled Oxford word database.
- `src/components/rubric/RubricViewer.tsx`: Pure minimalist table for Bands 9 to 0.
- `src/lib/officialRubricData.ts`: Exact official public descriptor data for all tasks.
- `src/components/SelectionToolbar.tsx`: Cursor highlight toolbar restricted to paragraphs.
- `src/components/OxfordModal.tsx`: Oxford Learner's Dictionary popup.
- `src/lib/gemini.ts`: Multi-turn/multimodal Gemini API integration + deterministic offline fallback engine.
- `src/app/api/grade-writing/route.ts`: API endpoint for text + chart image grading.
- `src/app/api/grade-speaking/route.ts`: API endpoint for speech transcript & audio evaluation.
- `src/app/api/saved-essays/route.ts`: API endpoint for server-side persistence of essays and estimated band scores.

---

### 5. Git Status & Recent History
- **Branch**: `main`
- **Build Status**: `npm run build` passes with 0 errors on Next.js 16.3.8 (Turbopack).
- **Recent Commits**:
  - `87a16d8`: `feat(hero): use InteractiveHoverButton for Start Writing and remove border outline from 50 Task 1 Charts`
  - `b5a59c6`: `style(collocations): remove horizontal divider lines from hero, header, tabs, and quiz views`
  - `4cbf741`: `style(bento): move text and unboxed icon to bottom of bento cards with top-aligned visual previews`
  - `d9136e6`: `feat(hero): swap Simulate Speaking and 50 Task 1 Charts and integrate Magic UI ShinyButton and AnimatedShinyText`
  - `d4173c8`: `feat(ui): remake bento grid with official Magic UI BentoGrid, BentoCard, and Marquee`
  - `23b0d3f`: `feat(speaking): remove live candidate transcript and simplify assessment checklist`
  - `cd0a17d`: `style(speaking): lighten selected prompt highlight, remove white outlines, and optimize for light mode`
  - `8b5c5ab`: `feat(ui): borderless modal styling, fix filter dropdowns, rename browse button, and soften prompt dividers`
  - `0569595`: `feat(speaking): expand Speaking Studio bank to 48 authentic real tests from Cambridge 11-19 and examiner masterclasses`
  - `3982fa7`: `feat(writing): add edit mode popup hint, redesign criteria standards without vertical colored lines, and enlarge borderless theme toggle`
  - `e39bea7`: `style(hero): keep classic red accent in light mode while preserving emerald-teal-cyan in dark mode`
  - `7d49507`: `style(hero): harmonize dynamic text and ambient gradient theme to emerald-teal-cyan palette`
  - `8456c64`: `docs: update PROJECT_CONTEXT.md with Speaking Studio architecture, light mode contrast, and collocations dropdown`
  - `dfe4458`: `fix(speaking): make waveform box background adapt to light mode`
  - `631bbc5`: `fix(speaking): optimize contrast and readability for light mode`
  - `584892b`: `feat(speaking): add subtle mode micro-explainer right below mode selection tab`
  - `83eb32c`: `feat(collocations): convert horizontal topic filter into sleek popout dropdown`
  - `bf522a1`: `refactor(speaking): remove telemetry counters strip and streamline recording console`
  - `bba285f`: `fix(speaking): continuous speech recognition, voice activity sensitivity, and real-time telemetry updates`
  - `2b5a6fd`: `style(speaking): remove nested inner boxes inside scratchpad, pacing, and model cards`
  - `96ce3b8`: `style(speaking): replace naked divider lines with clean rounded cards`
  - `23291c5`: `fix(speaking): expose playback button, purge synthetic audio, unify typography, and collapse secondary sections`
  - `a4039ee`: `style(speaking): clean up top bar mode selector and integrate 4-3-2 drill progression into workbench`
  - `bb276a9`: `style(speaking): replace cluttered rounded edge boxes with clean hairline dividers and minimalist line-based layout`
  - `9bf66ea`: `style(speaking): purge font-mono in favor of clean sans-serif typography`
  - `66577cf`: `feat(speaking): rebuild Speaking Studio into deterministic practice & authentic human comparison workbench`
  - `fd89e03`: `refactor(nav): remove home icon from top dock`
  - `04a3c7a`: `style(nav): remove dock outline and blend dock container with theme background`
