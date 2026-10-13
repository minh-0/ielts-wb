---
name: kokonutui
description: >-
  Use this skill whenever designing, browsing, adding, or integrating UI components from KokonutUI
  (https://kokonutui.com), including interactive buttons, AI inputs, cards, loaders, text effects,
  and navigation components built with Tailwind CSS, React, and Motion.
---

# Kokonut UI Component Library Skill

KokonutUI (https://kokonutui.com) is an open-source collection of modern, crafted UI components built with React, Next.js, Tailwind CSS (v3/v4), Motion (`motion` / `framer-motion`), and Lucide icons. Components are designed to be copy-paste ready and compatible with the shadcn registry ecosystem.

---

## 1. Installation & Registry Architecture

KokonutUI components can be added via the shadcn CLI or fetched directly from the registry:

### Registry URL
```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json"
  }
}
```

### CLI Command
```bash
npx shadcn@latest add @kokonutui/<component-name>
```

### Direct JSON Inspection
Each component source, dependencies, and helper files can be viewed and fetched directly at:
```text
https://kokonutui.com/r/<component-name>.json
```

### Core Prerequisites
- **React**: 18+ or 19+
- **Tailwind CSS**: v3 or v4
- **Animation**: `motion` (`motion/react` or `framer-motion`)
- **Icons**: `lucide-react`
- **Utility**: `cn(...)` from `clsx` and `tailwind-merge`

---

## 2. Component Catalog by Category

### A. AI & Generative Workflows
- **`ai-prompt`**: Multi-model selector prompt input with auto-resizing textarea, model badges (Gemini, Claude, GPT), attach button, and submission trigger.
- **`ai-input-search`**: Search bar with conversational AI prompt expansions and quick-suggest pills.
- **`ai-loading`**: Fluid morphing gradient loader for LLM thinking/generating states.
- **`ai-text-loading`**: Text animation simulating real-time model synthesis and token streaming.
- **`ai-voice`**: Audio waveform and reactive voice orb for speech recognition/recording interfaces.

### B. Cards & Data Presentation
- **`apple-activity-card`**: Tri-color concentric activity rings that animate on mount (ideal for progress, band score breakdowns, daily study streaks).
- **`spotlight-cards`**: Interactive card grid with cursor-following radial spotlight glow on hover.
- **`card-flip`**: Dual-sided flip card with 3D perspective rotation (perfect for vocabulary flashcards, collocation upgrades).
- **`card-stack`**: Swipeable / expandable stack of layered cards.
- **`liquid-glass-card`**: Translucent frosted glass card with subtle refraction and border shimmer.
- **`mouse-effect-card`**: Subtle 3D tilt and mouse parallax response on hover.
- **`bento-grid`**: Visual bento layout with asymmetric spans for feature portals.
- **`currency-transfer` / `metric-progress`**: Transactional / stat progression indicator with animated counts.

### C. Buttons & Micro-Interactions
- **`particle-button`**: Button that bursts floating particles on click/hover.
- **`gradient-button`**: Smooth border-beam or rotating conic gradient button.
- **`attract-button`**: Button with magnetic cursor-attraction effect.
- **`hold-button`**: Long-press confirmation button with circular progress fill (ideal for "Reset Essay" or "Delete Recording").
- **`slide-text-button`**: Button where text slides up and reveals an icon or secondary message on hover.
- **`switch-button`**: Tactile interactive toggle with spring animations.

### D. Navigation & Inputs
- **`action-search-bar`**: Command palette / search input with keyboard navigation (`↑`/`↓`/`Enter`), action grouping, and icon badges.
- **`smooth-tab`**: Pill tab bar with animated sliding layout background (`layoutId` in Motion).
- **`morphic-navbar`**: Floating glass navbar with responsive collapse.
- **`team-selector`**: Stepper counter with animated increment/decrement transitions.
- **`file-upload`**: Drag-and-drop file upload target with file preview and progress state.
- **`avatar-picker`**: Circular selector with smooth selection indicator.

### E. Typography & Text Effects
- **`shimmer-text`**: Continuous light sweep across high-contrast typography.
- **`dynamic-text`**: Rotating keyword switcher with vertical roll transitions.
- **`type-writer`**: Natural typing and deleting effect for prompts and headers.
- **`scroll-text`**: Text that reveals opacity and weight based on scroll offset.
- **`swoosh-text`**: Smooth character stagger entry.

### F. Atmospheric Backgrounds
- **`background-paths`**: Flowing SVG path animations across the hero.
- **`beams-background`**: Angled light beams radiating across dark/light mode backdrops.
- **`flow-field`**: Interactive particle canvas following cursor motion.

---

## 3. Best Practices for Integration

1. **Maintain Design Cohesion**: Keep typography within the host project's font hierarchy (`font-sans`, `font-serif`). Never inject unexpected monospace fonts unless explicitly requested.
2. **Reduced Motion Support**: Always check `useReducedMotion()` from `motion/react` or apply `motion-reduce:transform-none` for accessibility.
3. **Dark Mode Harmony**: KokonutUI components use neutral and translucent Tailwind tokens (`dark:bg-white/5`, `dark:border-white/10`) which blend with minimal themes.
