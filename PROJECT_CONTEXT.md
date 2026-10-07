# Project Context: IELTSlayer666 (slayer6767)

*Last updated: 2026-10-07 12:26*

---

### 1. Identity & Tech Stack
- **Project Name**: `IELTSlayer666` (Browser tab title: `slayer6767`, repository root: `e:/contest`).
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
- **Minimalist Studio Aesthetic**: Inspired by Linear, Raycast, and iA Writer. No marketing billboards, promotional banners, duplicate headers, or boilerplate disclaimers.
- **Palette**: Pure monochrome neutral scales (`border-neutral-200 dark:border-neutral-800`, `bg-white dark:bg-neutral-950`, `bg-neutral-50/50 dark:bg-neutral-900/30`).
- **Dark Mode Comfort**: High-contrast glare eliminated. Grammar mistakes use softened muted rose/red (`dark:text-rose-300/80 dark:bg-rose-950/30`), vocabulary upgrades use soft violet (`dark:text-purple-300/80 dark:bg-purple-950/30`), and replaced words use soft emerald.
- **Modals**: All modals (`ApiKeyModal`, `OxfordModal`, `ScorecardModal`, and the Writing Popup Modal) close cleanly on outside blank-space backdrop click or `Escape` key press.

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
- **Interactive Question Card & Question Picker Modal (`QuestionPickerModal.tsx`)**:
  - Replaced cramped native select dropdown with a sleek interactive Question Card showing topic badges, essay format pills, and Band 9.0 availability.
  - **Random Question Picker**: Dedicated "Random" button (`Shuffle` icon) to instantly rotate through the question bank.
  - **Question Picker Modal (`QuestionPickerModal.tsx`)**: High-performance popup with live search, topic category pills, format pills, random button, question cards with active indicators, and Esc/backdrop dismiss.
- **Model Essay Tab & Cleaned Feedback Tabs**:
  - Removed redundant "Sentence Diff Archive" tab from post-analysis feedback.
  - Post-analysis tabs streamlined to 2 core views: **Criteria Breakdown** and **Model Essay**.
  - **Model Essay Tab**: Renders authentic Band 9.0 model essay with examiner commentary, exact word count badge, and 1-click copy button.
- **Interactive In-Text Paragraph View (`AnnotatedParagraph.tsx`)**:
  - Highlights grammar errors (red wavy), vocabulary upgrades (violet dashed), and replaced words (emerald solid).
  - Clicking any underlined span displays an interactive popover with examiner rationale, 1-click **"Apply Higher-Rated Word"** or **"Revert"** button, and an **"Ignore"** button (`EyeOff` icon) to dismiss the suggestion.
  - Ignoring a suggestion removes its underline from the paragraph and hides it from active inspector counts.
- **Inspector Panel (`DiagnosticInspector.tsx`)**:
  - Minimalist pre-submission empty state with quiet target indicator and compact color legend (no loud boxes or verbose tutorials).
  - Post-submission live criteria breakdown scores (TR/TA, CC, LR, GRA).
  - Real-time grammar & vocabulary upgrade suggestions.
  - **Ignore & Restore Capability**: Every error and vocabulary card includes an "Ignore" action. When ignored, items move to an **"Ignored ({count})"** filter pill where the user can inspect or click **"Restore"** (`RotateCcw` icon) to bring them back.
  - **Protected Batch Application**: "Apply All Upgrades" selectively skips all ignored suggestions so dismissed recommendations are never forcefully applied.
- **Scorecard Modal (`ScorecardModal.tsx`)**:
  - Generates downloadable 1080x1350 PNG report with band scores, primary bottleneck, and candidate summary branded `slayer6767`.

#### B. Speaking Studio (`src/components/speaking/SpeakingStudio.tsx`)
- **Part Navigation**: Part 1 (Introduction & Interview), Part 2 (Cue Card with 1-min prep countdown), Part 3 (Two-way Discussion).
- **Mode Switcher**: `Practice` mode (flexible timer) vs `Exam` mode (strict test timer).
- **75+ Question Bank**: Comprehensive collection of authentic IELTS Online Tests (IOT) prompts across Parts 1-3 with a question navigator and shuffle button.
- **Live Recording & Transcription**:
  - Real-time audio waveform visualizer and live timer.
  - Microphone recording via `MediaRecorder` + live STT transcription via Web Speech recognition.
  - Audio playback bar to listen back to the candidate's speech.
  - Pacing metrics: Word count, duration, and calculated words per minute (WPM).
- **Strict Examiner Anti-Cheating Protocol**:
  - Short/trivial speech inputs (e.g., saying only "hello", < 12 words) trigger an **Insufficient Language Sample** penalty (Band 2.0-2.5) with empty error arrays. It will never hallucinate fake speeches or invent imaginary errors.

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
- **Progress Persistence**: Starred (`oxford_starred`) and Mastered (`oxford_mastered`) word state stored in `localStorage`.

---

### 4. Key Files Map
- `src/app/page.tsx`: Root page hosting tab switching (`Writing`, `Speaking`, `Vocabulary`, `Rubric`), minimalist layout, and footer.
- `src/app/layout.tsx`: Root HTML shell, dark mode theme script, metadata `title: "slayer6767"`.
- `src/components/Navbar.tsx`: Sticky minimalist navigation with `IELTSlayer666` badge, studio switcher, and AI mode status.
- `src/components/writing/WritingStudio.tsx`: Writing studio core, image upload, essay textarea, timer, save feature, and scorecards.
- `src/components/writing/SavedEssaysModal.tsx`: Minimalist modal to view, reload, and manage saved essays and estimated scores.
- `src/components/writing/AnnotatedParagraph.tsx`: Non-overlapping in-text underlines and fix applicator.
- `src/components/writing/DiagnosticInspector.tsx`: Side panel for criteria breakdown and sentence diffs.
- `src/components/speaking/SpeakingStudio.tsx`: Speaking recording, waveform, 75+ prompt bank, and evaluation cards.
- `src/components/vocabulary/VocabularyStudio.tsx`: Vocabulary learning studio (Flashcards & Word Explorer).
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
- **Branch**: `master`
- **Build Status**: `npm run build` passes with 0 errors on Next.js 16.3.8 (Turbopack).
- **Recent Commits**:
  - `feat(writing): add ignore button to dismiss suggestions in-text and in inspector with restore capability`
  - `refactor(ui): update footer watermark to 'rkrh • light' and add 'Le Tuan Minh K67 FDA NEU'`
  - `feat(writing): restrict enlarge to button click and add online essay & estimated band score saving with API persistence`
  - `refactor(writing): remove duplicate paste button, minimize button, redundant word counts, and simplify placeholder to 'Start writing...'`
  - `feat(writing): add enlarged popup writing studio with Task 1 side layout, Task 2 top layout, and visible paste button`
  - `refactor(ui): minimalist redesign of vocabulary studio with compact toolbar and quiet cards`
  - `refactor(vocab): remove quick quiz mode to keep vocabulary studio clean and focused on flashcards and word explorer`
  - `feat(vocab): add dedicated Oxford 3000 & 5000 vocabulary learning studio with flashcards, explorer, and quiz modes`
  - `refactor(ui): streamline inspector empty state with minimal placeholder and compact legend`
  - `feat: allow image upload for custom Task 1 questions and remove inspector pop-down subtitle`
  - `refactor(ui): purge all boilerplate disclaimers, subtitles, and fluff text for pure minimalist experience`
  - `fix: remove jump-to pills from rubric and update browser tab title to slayer6767`
  - `feat: restore IELTSlayer666 brand, isolate highlighting to paragraphs, and expand rubric to Band 9`
  - `refactor(ui): streamline studio interface with modern minimalist aesthetic`
