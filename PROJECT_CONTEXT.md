# Project Context: IELTSlayer666 (slayer6767)

*Last updated: 2026-10-06 21:14*

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
- **Modals**: All modals (`ApiKeyModal`, `OxfordModal`, `ScorecardModal`) close cleanly on outside blank-space backdrop click or `Escape` key press.

---

### 3. Core Feature Architecture

#### A. Writing Studio (`src/components/writing/WritingStudio.tsx`)
- **Task Switcher**: Segmented toggle for `Task 2 (250w)`, `Task 1 Academic (150w)`, and `Task 1 General (150w)`.
- **Question & Graph Handling**:
  - Built-in prompt bank (`src/lib/ieltsPromptBank.ts`).
  - `+ Custom topic` input mode.
  - **Task 1 Visual Graph Upload**: Users can upload `.png, .jpg, .webp` chart/graph images. Thumbnails preview directly above the text area while writing, and images are passed as base64 `inlineData` to Gemini for multimodal visual accuracy checking.
- **Interactive In-Text Paragraph View (`AnnotatedParagraph.tsx`)**:
  - Highlights grammar errors (red wavy), vocabulary upgrades (violet dashed), and replaced words (emerald solid).
  - Clicking any underlined span displays an interactive popover with examiner rationale and a 1-click **"Apply Higher-Rated Word"** or **"Revert"** button.
- **Inspector Panel (`DiagnosticInspector.tsx`)**:
  - Live criteria breakdown scores (TR/TA, CC, LR, GRA).
  - Sentence-by-sentence diff viewer comparing original vs. rewritten forms.
  - Model essay display.
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

---

### 4. Key Files Map
- `src/app/page.tsx`: Root page hosting tab switching (`Writing`, `Speaking`, `Rubric`), minimalist layout, and footer.
- `src/app/layout.tsx`: Root HTML shell, dark mode theme script, metadata `title: "slayer6767"`.
- `src/components/Navbar.tsx`: Sticky minimalist navigation with `IELTSlayer666` badge, studio switcher, and AI mode status.
- `src/components/writing/WritingStudio.tsx`: Writing studio core, image upload, essay textarea, timer, and scorecards.
- `src/components/writing/AnnotatedParagraph.tsx`: Non-overlapping in-text underlines and fix applicator.
- `src/components/writing/DiagnosticInspector.tsx`: Side panel for criteria breakdown and sentence diffs.
- `src/components/speaking/SpeakingStudio.tsx`: Speaking recording, waveform, 75+ prompt bank, and evaluation cards.
- `src/components/rubric/RubricViewer.tsx`: Pure minimalist table for Bands 9 to 0.
- `src/lib/officialRubricData.ts`: Exact official public descriptor data for all tasks.
- `src/components/SelectionToolbar.tsx`: Cursor highlight toolbar restricted to paragraphs.
- `src/components/OxfordModal.tsx`: Oxford Learner's Dictionary popup.
- `src/lib/gemini.ts`: Multi-turn/multimodal Gemini API integration + deterministic offline fallback engine.
- `src/app/api/grade-writing/route.ts`: API endpoint for text + chart image grading.
- `src/app/api/grade-speaking/route.ts`: API endpoint for speech transcript & audio evaluation.

---

### 5. Git Status & Recent History
- **Branch**: `master`
- **Build Status**: `npm run build` passes with 0 errors on Next.js 16.3.8 (Turbopack).
- **Recent Commits**:
  - `feat: allow image upload for custom Task 1 questions and remove inspector pop-down subtitle`
  - `refactor(ui): purge all boilerplate disclaimers, subtitles, and fluff text for pure minimalist experience`
  - `fix: remove jump-to pills from rubric and update browser tab title to slayer6767`
  - `feat: restore IELTSlayer666 brand, isolate highlighting to paragraphs, and expand rubric to Band 9`
  - `refactor(ui): streamline studio interface with modern minimalist aesthetic`
