"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Clock,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Shuffle,
  ChevronRight,
  ChevronDown,
  Layers,
  Zap,
  BookOpen,
  Copy,
  Check,
  Info,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Compass,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { SPEAKING_PROMPTS, SpeakingPrompt } from "@/lib/ieltsPromptBank";
import {
  TOPIC_LEXICAL_PACKS,
  getLexicalPackForTopic,
  SHADOWING_MODELS,
  ShadowingModel,
  AREA_DRILLS,
  AreaDrillQuestion,
  BUYING_TIME_FILLERS,
  BuyingTimeFiller,
  COLLOCATION_FLASHCARDS,
  CollocationFlashcard,
} from "@/lib/speakingPracticeData";

interface SpeakingStudioProps {
  apiKey?: string;
  onOpenApiKeyModal?: () => void;
}

type StudioTab = "cue_card_scaffolder" | "shadowing_intonation" | "fluency_gym";
type FrameworkType = "four_wh" | "ppf" | "story_arc";
type GymDrill = "area_builder" | "buying_time_fillers" | "collocation_flashcards";

export function SpeakingStudio({ apiKey, onOpenApiKeyModal }: SpeakingStudioProps) {
  // Main Studio Navigation Tab
  const [activeTab, setActiveTab] = useState<StudioTab>("cue_card_scaffolder");

  // ==========================================
  // MODULE 1: CUE CARD SCAFFOLDER STATE
  // ==========================================
  const cueCardPrompts = SPEAKING_PROMPTS.filter((p) => p.part === "part2_cuecard");
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(cueCardPrompts[0]);
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [activeFramework, setActiveFramework] = useState<FrameworkType>("four_wh");

  // 1-Minute Prep Timer
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);
  const [prepNotes, setPrepNotes] = useState<string>("");
  const prepIntervalRef = useRef<any>(null);

  // 2-Minute Speaking Delivery Timer & Local Self-Recording
  const [isSpeakingDelivery, setIsSpeakingDelivery] = useState<boolean>(false);
  const [deliverySeconds, setDeliverySeconds] = useState<number>(0);
  const deliveryIntervalRef = useRef<any>(null);

  const [deliveryAudioUrl, setDeliveryAudioUrl] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Topic Lexical Pack for the active prompt
  const activeLexicalPack = getLexicalPackForTopic(
    useCustomPrompt ? customQuestion : selectedPrompt.topic + " " + selectedPrompt.question
  );

  // ==========================================
  // MODULE 2: BAND 9 SHADOWING & INTONATION STATE
  // ==========================================
  const [selectedModel, setSelectedModel] = useState<ShadowingModel>(SHADOWING_MODELS[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [isPlayingFullAudio, setIsPlayingFullAudio] = useState<boolean>(false);
  const [isPlayingSentenceAudio, setIsPlayingSentenceAudio] = useState<boolean>(false);

  // Sentence-level recording for self-mirroring
  const [shadowAudioUrl, setShadowAudioUrl] = useState<string | null>(null);
  const [isShadowRecording, setIsShadowRecording] = useState<boolean>(false);
  const shadowMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const shadowAudioChunksRef = useRef<Blob[]>([]);

  // ==========================================
  // MODULE 3: FLUENCY & REFLEX GYM STATE
  // ==========================================
  const [activeGymDrill, setActiveGymDrill] = useState<GymDrill>("area_builder");

  // Drill A: A.R.E.A. Formula Builder
  const [activeAreaIndex, setActiveAreaIndex] = useState<number>(0);
  const activeAreaQuestion = AREA_DRILLS[activeAreaIndex] || AREA_DRILLS[0];
  const [areaAnswerText, setAreaAnswerText] = useState<string>("");
  const [areaReasonText, setAreaReasonText] = useState<string>("");
  const [areaExampleText, setAreaExampleText] = useState<string>("");
  const [areaAltText, setAreaAltText] = useState<string>("");
  const [showAreaModel, setShowAreaModel] = useState<boolean>(false);

  // Drill B: Buying-Time Fillers
  const [activeFillerIndex, setActiveFillerIndex] = useState<number>(0);
  const activeFiller = BUYING_TIME_FILLERS[activeFillerIndex] || BUYING_TIME_FILLERS[0];
  const [trickyPromptIndex, setTrickyPromptIndex] = useState<number>(0);

  const TRICKY_PROMPTS = [
    "Do you think artificial intelligence will make human artists completely obsolete in 50 years?",
    "Why do some people enjoy looking at mirrors while others feel self-conscious?",
    "Is it better for children to grow up in a multi-generational home with their grandparents?",
    "Do you think future cities will ban private automobiles entirely?",
    "Should governments spend funds on preserving minority languages that have fewer than 100 speakers?",
  ];

  // Drill C: Collocation Flashcards
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  // Copy helper with feedback
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Browser Speech Synthesis (Natural TTS with Speed Control)
  const speakText = (text: string, rate: number = 1.0, onEndCallback?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural English voice
    const enVoice = voices.find(
      (v) =>
        v.lang.startsWith("en-GB") ||
        v.lang.startsWith("en-US") ||
        v.lang.startsWith("en")
    );
    if (enVoice) utterance.voice = enVoice;

    if (onEndCallback) {
      utterance.onend = () => onEndCallback();
      utterance.onerror = () => onEndCallback();
    }
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingFullAudio(false);
      setIsPlayingSentenceAudio(false);
    }
  };

  // 1-Minute Prep Countdown Timer
  useEffect(() => {
    if (isPrepping && prepSecondsRemaining > 0) {
      prepIntervalRef.current = setInterval(() => {
        setPrepSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (prepSecondsRemaining === 0) {
      setIsPrepping(false);
      if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    }
    return () => {
      if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    };
  }, [isPrepping, prepSecondsRemaining]);

  // 2-Minute Speaking Delivery Timer
  useEffect(() => {
    if (isSpeakingDelivery && deliverySeconds < 120) {
      deliveryIntervalRef.current = setInterval(() => {
        setDeliverySeconds((prev) => prev + 1);
      }, 1000);
    } else if (deliverySeconds >= 120) {
      stopDeliveryRecording();
    }
    return () => {
      if (deliveryIntervalRef.current) clearInterval(deliveryIntervalRef.current);
    };
  }, [isSpeakingDelivery, deliverySeconds]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Cue card switcher
  const handleShufflePrompt = () => {
    let randIdx = Math.floor(Math.random() * cueCardPrompts.length);
    setSelectedPrompt(cueCardPrompts[randIdx]);
    setUseCustomPrompt(false);
    resetPrepAndDelivery();
  };

  const handleNextPrompt = () => {
    const currentIdx = cueCardPrompts.findIndex((p) => p.id === selectedPrompt.id);
    const nextIdx = (currentIdx + 1) % cueCardPrompts.length;
    setSelectedPrompt(cueCardPrompts[nextIdx]);
    setUseCustomPrompt(false);
    resetPrepAndDelivery();
  };

  const resetPrepAndDelivery = () => {
    setIsPrepping(false);
    setPrepSecondsRemaining(60);
    setIsSpeakingDelivery(false);
    setDeliverySeconds(0);
    setDeliveryAudioUrl(null);
    setIsRecordingAudio(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Insert Framework Outline into Scratchpad
  const handleInsertFrameworkOutline = () => {
    let outline = "";
    if (activeFramework === "four_wh") {
      outline = `[1. WHO / WHAT]\n- Key context: \n\n[2. WHEN / WHERE]\n- Setting & backdrop: \n\n[3. WHY IMPORTANT]\n- Defining reason: \n\n[4. HOW I FELT / REFLECTION]\n- Lasting personal impact: `;
    } else if (activeFramework === "ppf") {
      outline = `[PAST BACKGROUND]\n- How it started: \n\n[PRESENT SIGNIFICANCE]\n- Why it matters today: \n\n[FUTURE OUTLOOK]\n- Long-term aspiration / prediction: `;
    } else {
      outline = `[SETUP]\n- The objective: \n\n[OBSTACLE / CONFLICT]\n- The unexpected hurdle: \n\n[RESOLUTION & TAKEAWAY]\n- Overcoming it & the lesson: `;
    }
    setPrepNotes((prev) => (prev ? prev + "\n\n" + outline : outline));
  };

  // Start 2-Minute Speaking Delivery Recording (Pure Local Browser Audio)
  const startDeliveryRecording = async () => {
    try {
      setDeliveryAudioUrl(null);
      setDeliverySeconds(0);
      setIsSpeakingDelivery(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setDeliveryAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecordingAudio(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.warn("Local mic access denied; running delivery timer only", err);
      setIsSpeakingDelivery(true);
      setIsRecordingAudio(false);
    }
  };

  const stopDeliveryRecording = () => {
    setIsSpeakingDelivery(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingAudio(false);
  };

  // Shadowing sentence self-recording
  const startShadowRecording = async () => {
    try {
      setShadowAudioUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      shadowAudioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) shadowAudioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(shadowAudioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setShadowAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setIsShadowRecording(false);
      };

      shadowMediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsShadowRecording(true);
    } catch (err) {
      console.warn("Mic error for shadow recorder", err);
    }
  };

  const stopShadowRecording = () => {
    if (shadowMediaRecorderRef.current && shadowMediaRecorderRef.current.state !== "inactive") {
      shadowMediaRecorderRef.current.stop();
    }
    setIsShadowRecording(false);
  };

  const activeSentence = selectedModel.sentences[activeSentenceIndex] || selectedModel.sentences[0];

  return (
    <div className="space-y-8">
      {/* Pillar Navigation Tabs: Clean underline style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("cue_card_scaffolder");
              stopSpeaking();
            }}
            className={`py-1 text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "cue_card_scaffolder"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Part 2 Scaffolder</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("shadowing_intonation");
              stopSpeaking();
            }}
            className={`py-1 text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "shadowing_intonation"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Band 9 Shadowing & Intonation</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("fluency_gym");
              stopSpeaking();
            }}
            className={`py-1 text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "fluency_gym"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fluency & Reflex Gym</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>IELTS Fluency & Coaching Mode</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PART 2 CUE CARD SCAFFOLDER & 2-MINUTE PACER      */}
      {/* ======================================================== */}
      {activeTab === "cue_card_scaffolder" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Cue Card Selection Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Cue Card Bank
              </span>
              <span className="text-neutral-400">
                ({cueCardPrompts.findIndex((p) => p.id === selectedPrompt.id) + 1} of{" "}
                {cueCardPrompts.length} authentic cue cards)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
              >
                {useCustomPrompt ? "Choose from bank" : "+ Custom cue card"}
              </button>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <button
                onClick={handleShufflePrompt}
                className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
              >
                <Shuffle className="w-3 h-3" />
                <span>Random</span>
              </button>
              <button
                onClick={handleNextPrompt}
                className="flex items-center gap-1 px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300"
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Cue Card Dropdown or Custom Question */}
          {!useCustomPrompt ? (
            <div className="relative">
              <select
                value={selectedPrompt.id}
                onChange={(e) => {
                  const found = cueCardPrompts.find((p) => p.id === e.target.value);
                  if (found) {
                    setSelectedPrompt(found);
                    resetPrepAndDelivery();
                  }
                }}
                className="w-full p-2.5 pr-8 text-xs border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 appearance-none cursor-pointer focus:outline-none hover:border-neutral-300 dark:hover:border-neutral-700 font-medium"
              >
                {cueCardPrompts.map((p, idx) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900">
                    #{idx + 1}: [{p.topic}] {p.question}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          ) : (
            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Paste or type your custom cue card prompt here..."
              rows={2}
              className="w-full p-2.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          )}

          {/* Authentic Cue Card Display Box: Unboxed editorial card */}
          <div className="py-5 border-y border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {useCustomPrompt ? "Custom Topic" : selectedPrompt.topic}
              </span>
              <span className="text-neutral-400 text-xs">Target Duration: 2 full minutes</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 dark:text-neutral-100 leading-snug">
              {useCustomPrompt
                ? customQuestion.trim() || "Your Custom Cue Card Prompt"
                : selectedPrompt.question}
            </h3>

            {!useCustomPrompt && selectedPrompt.bulletPoints && (
              <div className="pt-3 text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
                  You should say:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPrompt.bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="flex items-baseline gap-2 text-neutral-600 dark:text-neutral-400">
                      <span className="text-neutral-400 dark:text-neutral-600 font-mono text-[10px]">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scaffolding Framework Selector: Clean 3-column hairline grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-neutral-500" />
                Select Story Scaffolding Framework
              </span>
              <span className="text-neutral-400 text-[11px]">Choose narrative structure</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
              <button
                onClick={() => setActiveFramework("four_wh")}
                className={`p-4 text-left cursor-pointer transition-colors ${
                  activeFramework === "four_wh"
                    ? "bg-neutral-100/70 dark:bg-neutral-900/60"
                    : "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                }`}
              >
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                  <span>1. The 4-Wh Framework</span>
                  {activeFramework === "four_wh" && <span className="text-[10px] font-mono text-neutral-500">Selected</span>}
                </div>
                <div className="text-[11px] text-neutral-500 leading-relaxed">
                  Who/What &rarr; When/Where &rarr; Why Important &rarr; How It Felt. Best for general cue cards and memory recall.
                </div>
              </button>

              <button
                onClick={() => setActiveFramework("ppf")}
                className={`p-4 text-left cursor-pointer transition-colors ${
                  activeFramework === "ppf"
                    ? "bg-neutral-100/70 dark:bg-neutral-900/60"
                    : "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                }`}
              >
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                  <span>2. P.P.F. (Past - Present - Future)</span>
                  {activeFramework === "ppf" && <span className="text-[10px] font-mono text-neutral-500">Selected</span>}
                </div>
                <div className="text-[11px] text-neutral-500 leading-relaxed">
                  How it started in past &rarr; Current significance &rarr; Future aspirations. Showcases diverse grammatical tenses.
                </div>
              </button>

              <button
                onClick={() => setActiveFramework("story_arc")}
                className={`p-4 text-left cursor-pointer transition-colors ${
                  activeFramework === "story_arc"
                    ? "bg-neutral-100/70 dark:bg-neutral-900/60"
                    : "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/30"
                }`}
              >
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                  <span>3. Story Arc & Obstacle</span>
                  {activeFramework === "story_arc" && <span className="text-[10px] font-mono text-neutral-500">Selected</span>}
                </div>
                <div className="text-[11px] text-neutral-500 leading-relaxed">
                  The goal &rarr; Unexpected complication &rarr; Resolution & takeaway. Creates gripping listener engagement.
                </div>
              </button>
            </div>
          </div>

          {/* 1-Minute Prep Planner & Scratchpad: Unboxed hairline section */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  1-Minute Preparation Assistant
                </span>
                <span className="text-neutral-400">
                  (Official exam allows 60s note-taking)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatTime(prepSecondsRemaining)}
                </div>

                {!isPrepping && prepSecondsRemaining === 60 ? (
                  <button
                    onClick={() => setIsPrepping(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Start 60s Timer</span>
                  </button>
                ) : isPrepping ? (
                  <button
                    onClick={() => setIsPrepping(false)}
                    className="flex items-center gap-1.5 px-3 py-1 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer"
                  >
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsPrepping(false);
                      setPrepSecondsRemaining(60);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 text-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Framework Guidance Hint: Unboxed editorial callout */}
            <div className="p-3.5 border-l-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50/50 dark:bg-neutral-900/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Framework Blueprint for: {activeLexicalPack.topicName}
                </span>
                <button
                  onClick={handleInsertFrameworkOutline}
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Insert Outline into Scratchpad</span>
                </button>
              </div>

              <div className="text-[11px] text-neutral-600 dark:text-neutral-400 grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {activeFramework === "four_wh" && (
                  <>
                    <div><strong>Who/What:</strong> {activeLexicalPack.frameworkHints.fourWh.whoWhat}</div>
                    <div><strong>When/Where:</strong> {activeLexicalPack.frameworkHints.fourWh.whenWhere}</div>
                    <div><strong>Why:</strong> {activeLexicalPack.frameworkHints.fourWh.why}</div>
                    <div><strong>How Felt:</strong> {activeLexicalPack.frameworkHints.fourWh.howFelt}</div>
                  </>
                )}
                {activeFramework === "ppf" && (
                  <>
                    <div><strong>Past:</strong> {activeLexicalPack.frameworkHints.ppf.past}</div>
                    <div><strong>Present:</strong> {activeLexicalPack.frameworkHints.ppf.present}</div>
                    <div className="md:col-span-2"><strong>Future:</strong> {activeLexicalPack.frameworkHints.ppf.future}</div>
                  </>
                )}
                {activeFramework === "story_arc" && (
                  <>
                    <div><strong>Setup:</strong> {activeLexicalPack.frameworkHints.storyArc.setup}</div>
                    <div><strong>Conflict:</strong> {activeLexicalPack.frameworkHints.storyArc.conflict}</div>
                    <div className="md:col-span-2"><strong>Resolution:</strong> {activeLexicalPack.frameworkHints.storyArc.resolution}</div>
                  </>
                )}
              </div>
            </div>

            {/* Candidate Scratchpad */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Your 1-Minute Prep Scratchpad (Keywords & Triggers):
              </label>
              <textarea
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                placeholder="Jot down quick abbreviations, transition keywords, and story triggers..."
                rows={4}
                className="w-full p-3 text-xs border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
          </div>

          {/* Target Lexical Pack: Unboxed hairline divided grid */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Target Lexical Pack: Band 8+ Collocations for this Cue Card
                </span>
              </div>
              <span className="text-neutral-400 text-[11px]">
                Aim to integrate at least 2 target collocations naturally
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
              {activeLexicalPack.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.phrase}
                    </span>
                    <button
                      onClick={() => handleCopyText(item.phrase, `lex-${idx}`)}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer text-[11px] flex items-center gap-1"
                      title="Copy to clipboard"
                    >
                      {copiedKey === `lex-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-mono">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {item.meaning}
                  </p>
                  <div className="border-l-2 border-emerald-500/60 dark:border-emerald-400/60 pl-2.5 py-0.5 text-[11px] italic text-neutral-700 dark:text-neutral-300">
                    &ldquo;{item.example}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Minute Speaking Delivery Pacer: Unboxed hairline section */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-5 text-center">
            <div className="space-y-1">
              <div className="text-4xl font-mono font-medium text-neutral-900 dark:text-neutral-100">
                {formatTime(deliverySeconds)} / 02:00
              </div>
              <span className="text-xs text-neutral-500">
                {isSpeakingDelivery
                  ? "Speaking time active — aim to reach 01:50 to 02:00!"
                  : deliverySeconds > 0
                  ? "Delivery finished"
                  : "Click Start Practice to speak continuously for 2 minutes"}
              </span>
            </div>

            {/* Checkpoint Timeline: Connected 4-segment hairline strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-neutral-200 dark:border-neutral-800 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800 text-left">
              <div
                className={`p-3 transition-colors text-xs ${
                  deliverySeconds >= 0 && deliverySeconds < 30 && isSpeakingDelivery
                    ? "bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : deliverySeconds >= 30
                    ? "opacity-60"
                    : "text-neutral-400"
                }`}
              >
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider mb-0.5">
                  0:00 - 0:30
                </div>
                <div className="font-medium text-[11px]">1. Scene & Setup</div>
                <div className="text-[10px] text-neutral-500">Context & initial impression</div>
              </div>

              <div
                className={`p-3 transition-colors text-xs ${
                  deliverySeconds >= 30 && deliverySeconds < 60 && isSpeakingDelivery
                    ? "bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : deliverySeconds >= 60
                    ? "opacity-60"
                    : "text-neutral-400"
                }`}
              >
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider mb-0.5">
                  0:30 - 1:00
                </div>
                <div className="font-medium text-[11px]">2. Narrative Details</div>
                <div className="text-[10px] text-neutral-500">Specific actions & people</div>
              </div>

              <div
                className={`p-3 transition-colors text-xs ${
                  deliverySeconds >= 60 && deliverySeconds < 90 && isSpeakingDelivery
                    ? "bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : deliverySeconds >= 90
                    ? "opacity-60"
                    : "text-neutral-400"
                }`}
              >
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider mb-0.5">
                  1:00 - 1:30
                </div>
                <div className="font-medium text-[11px]">3. Key Moment</div>
                <div className="text-[10px] text-neutral-500">Turning point / core reason</div>
              </div>

              <div
                className={`p-3 transition-colors text-xs ${
                  deliverySeconds >= 90 && isSpeakingDelivery
                    ? "bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "text-neutral-400"
                }`}
              >
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider mb-0.5">
                  1:30 - 2:00
                </div>
                <div className="font-medium text-[11px]">4. Reflection</div>
                <div className="text-[10px] text-neutral-500">Lasting feelings & future</div>
              </div>
            </div>

            {/* Speaking Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isSpeakingDelivery ? (
                <button
                  onClick={startDeliveryRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Mic className="w-4 h-4 text-red-400" />
                  <span>Start 2-Minute Practice (Record Voice)</span>
                </button>
              ) : (
                <button
                  onClick={stopDeliveryRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-medium text-xs cursor-pointer hover:bg-red-700 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Practice</span>
                </button>
              )}

              {deliverySeconds > 0 && !isSpeakingDelivery && (
                <button
                  onClick={() => {
                    setDeliverySeconds(0);
                    setDeliveryAudioUrl(null);
                  }}
                  className="p-2 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  title="Retake delivery"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Local Voice Playback */}
            {deliveryAudioUrl && (
              <div className="max-w-md mx-auto pt-3 border-t border-neutral-200 dark:border-neutral-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
                    Listen Back to Your 2-Minute Delivery
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Delivered: {formatTime(deliverySeconds)}
                  </span>
                </div>
                <audio src={deliveryAudioUrl} controls className="w-full h-8" />
                <p className="text-[11px] text-neutral-500">
                  Self-Check: Did you maintain steady pacing without awkward silence? Did you include at least 2 target collocations?
                </p>
              </div>
            )}
          </div>

          {/* Official Cambridge Examiner Pro-Tips: Unboxed 3-column hairline section */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xs text-neutral-900 dark:text-neutral-100">
              <Info className="w-4 h-4 text-neutral-500" />
              <span>Examiner Pro-Tips for Part 2 Mastery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
              <div className="p-4">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  1. Tell a Story, Not a List
                </strong>
                Examiners penalize answers that sound like reading grocery lists ("First bullet is... second is..."). Connect points naturally with temporal transitions.
              </div>
              <div className="p-4">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  2. Never Stop Early
                </strong>
                If you stop before 1:40, the examiner will wait in silence or prompt you. Keep expanding on personal feelings and reflections until they interrupt you.
              </div>
              <div className="p-4">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  3. Use Temporal Signposts
                </strong>
                Elevate grammar by switching timeframes ("Initially, I assumed...", "Looking back with hindsight...", "Nowadays, I appreciate...").
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BAND 9 SHADOWING & INTONATION MIRROR             */}
      {/* ======================================================== */}
      {activeTab === "shadowing_intonation" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Model Answer Selector & Speed Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Band 9 Audio Shadowing Models
              </span>
              <span className="text-neutral-400">
                (Native intonation & rhythm playback)
              </span>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Speed:</span>
              <div className="inline-flex border border-neutral-200 dark:border-neutral-800 divide-x divide-neutral-200 dark:divide-neutral-800">
                {[0.85, 1.0, 1.15].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeechSpeed(speed)}
                    className={`px-2.5 py-0.5 text-[11px] font-mono cursor-pointer transition-colors ${
                      speechSpeed === speed
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model Switcher Tabs: Clean horizontal line */}
          <div className="flex items-center gap-6 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
            {SHADOWING_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setActiveSentenceIndex(0);
                  stopSpeaking();
                  setShadowAudioUrl(null);
                }}
                className={`py-1 whitespace-nowrap cursor-pointer transition-colors ${
                  selectedModel.id === model.id
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                }`}
              >
                {model.topic}
              </button>
            ))}
          </div>

          {/* Selected Model Question Banner: Unboxed editorial prompt */}
          <div className="py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Exam Prompt ({selectedModel.part.toUpperCase()}):
            </span>
            <div className="font-serif text-lg font-normal text-neutral-900 dark:text-neutral-100">
              &ldquo;{selectedModel.question}&rdquo;
            </div>
            <p className="text-[11px] text-neutral-500 pt-0.5">
              {selectedModel.contextSummary}
            </p>
          </div>

          {/* Full Model Answer Audio Control */}
          <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-neutral-500" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Full Response Audio Overview
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isPlayingFullAudio ? (
                <button
                  onClick={() => {
                    setIsPlayingFullAudio(true);
                    speakText(selectedModel.fullModelAnswer, speechSpeed, () =>
                      setIsPlayingFullAudio(false)
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Play Full Model ({speechSpeed}x)</span>
                </button>
              ) : (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium cursor-pointer"
                >
                  <Square className="w-3 h-3 text-red-500" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Sentence-by-Sentence Shadowing Studio: Unboxed hairline layout */}
          <div className="space-y-4 pt-2">
            {/* Sentence Header & Progress */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Sentence {activeSentenceIndex + 1} of {selectedModel.sentences.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveSentenceIndex((prev) => Math.max(0, prev - 1));
                    stopSpeaking();
                    setShadowAudioUrl(null);
                  }}
                  disabled={activeSentenceIndex === 0}
                  className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 cursor-pointer font-medium"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    setActiveSentenceIndex((prev) =>
                      Math.min(selectedModel.sentences.length - 1, prev + 1)
                    );
                    stopSpeaking();
                    setShadowAudioUrl(null);
                  }}
                  disabled={activeSentenceIndex === selectedModel.sentences.length - 1}
                  className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 cursor-pointer font-medium"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Visual Intonation & Stress Display */}
            <div className="py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="text-[11px] font-mono text-neutral-400">
                Rhythm & Pitch Contour: (Bold = Stressed • ↗ Rising Pitch • ↘ Falling Pitch)
              </div>
              <div
                className="text-base sm:text-lg font-serif text-neutral-900 dark:text-neutral-100 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeSentence.annotatedText }}
              />
            </div>

            {/* Intonation Explanation & Stressed Words: Clean 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 text-xs">
              <div className="p-4 space-y-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                  Intonation Logic:
                </span>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {activeSentence.intonationExplanation}
                </p>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Key Collocations & Fillers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSentence.keyCollocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentence Listen & Self-Shadowing Recorder */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                {!isPlayingSentenceAudio ? (
                  <button
                    onClick={() => {
                      setIsPlayingSentenceAudio(true);
                      speakText(activeSentence.text, speechSpeed, () =>
                        setIsPlayingSentenceAudio(false)
                      );
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear Native Sentence ({speechSpeed}x)</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 text-red-500" />
                    <span>Stop Audio</span>
                  </button>
                )}
              </div>

              {/* Self-Mirroring Mic Controls */}
              <div className="flex items-center gap-2">
                {!isShadowRecording ? (
                  <button
                    onClick={startShadowRecording}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-500" />
                    <span>Record My Shadowing</span>
                  </button>
                ) : (
                  <button
                    onClick={stopShadowRecording}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 text-white text-xs font-medium cursor-pointer animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Shadowing</span>
                  </button>
                )}
              </div>
            </div>

            {/* Shadow Audio Playback */}
            {shadowAudioUrl && (
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Compare Your Rhythm Against the Native Model:
                </span>
                <audio src={shadowAudioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Pronunciation & Connected Speech Coaching Guide: Clean 2 columns */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Band 9 Pronunciation & Connected Speech Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
              <div className="p-4">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  Liaison (Consonant-to-Vowel Linking)
                </strong>
                Native speakers never pause between words. &ldquo;Turn it off&rdquo; is pronounced smoothly as <em>/tur-ni-toff/</em>. Link final consonants directly to following vowels.
              </div>
              <div className="p-4">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  Intonation & Pitch Variety
                </strong>
                Monotone English sounds robotic and triggers Band 5.0 in Pronunciation. Use rising pitch ↗ on clauses to signal continuation, and downward pitch ↘ on final thoughts.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FLUENCY & REFLEX GYM (A.R.E.A., FILLERS, FLASHCARDS) */}
      {/* ======================================================== */}
      {activeTab === "fluency_gym" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sub-drill Switcher: Clean horizontal underline tabs */}
          <div className="flex items-center gap-6 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
            <button
              onClick={() => {
                setActiveGymDrill("area_builder");
                stopSpeaking();
              }}
              className={`py-1 cursor-pointer transition-colors ${
                activeGymDrill === "area_builder"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              1. The A.R.E.A. Formula Builder
            </button>

            <button
              onClick={() => {
                setActiveGymDrill("buying_time_fillers");
                stopSpeaking();
              }}
              className={`py-1 cursor-pointer transition-colors ${
                activeGymDrill === "buying_time_fillers"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              2. &ldquo;Stall & Buy-Time&rdquo; Fillers Trainer
            </button>

            <button
              onClick={() => {
                setActiveGymDrill("collocation_flashcards");
                stopSpeaking();
              }}
              className={`py-1 cursor-pointer transition-colors ${
                activeGymDrill === "collocation_flashcards"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              3. Spoken Collocation Upgrade Cards
            </button>
          </div>

          {/* DRILL A: A.R.E.A. FORMULA BUILDER */}
          {activeGymDrill === "area_builder" && (
            <div className="space-y-6">
              {/* Question Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  A.R.E.A. Answering Formula (Answer &rarr; Reason &rarr; Example &rarr; Alternative)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Drill {activeAreaIndex + 1} of {AREA_DRILLS.length}</span>
                  <button
                    onClick={() => {
                      setActiveAreaIndex((prev) => (prev + 1) % AREA_DRILLS.length);
                      setShowAreaModel(false);
                      setAreaAnswerText("");
                      setAreaReasonText("");
                      setAreaExampleText("");
                      setAreaAltText("");
                    }}
                    className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                  >
                    Next Prompt
                  </button>
                </div>
              </div>

              {/* Discussion Prompt */}
              <div className="py-4 border-b border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  Discussion Prompt ({activeAreaQuestion.category}):
                </span>
                <div className="text-base font-serif font-normal text-neutral-900 dark:text-neutral-100">
                  &ldquo;{activeAreaQuestion.question}&rdquo;
                </div>
              </div>

              {/* 4 Interactive Steps: Clean 4-quadrant hairline grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
                {/* Step 1: A - Direct Answer */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">[A]</span>
                      Direct Answer
                    </span>
                    <button
                      onClick={() => setAreaAnswerText(activeAreaQuestion.guidedAnswer.answer.stem)}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                    >
                      Use Stem
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">{activeAreaQuestion.guidedAnswer.answer.tip}</p>
                  <textarea
                    value={areaAnswerText}
                    onChange={(e) => setAreaAnswerText(e.target.value)}
                    placeholder={activeAreaQuestion.guidedAnswer.answer.sample}
                    rows={2}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-sans"
                  />
                </div>

                {/* Step 2: R - Core Reason */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">[R]</span>
                      Underlying Reason
                    </span>
                    <button
                      onClick={() => setAreaReasonText(activeAreaQuestion.guidedAnswer.reason.stem)}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                    >
                      Use Stem
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">{activeAreaQuestion.guidedAnswer.reason.tip}</p>
                  <textarea
                    value={areaReasonText}
                    onChange={(e) => setAreaReasonText(e.target.value)}
                    placeholder={activeAreaQuestion.guidedAnswer.reason.sample}
                    rows={2}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-sans"
                  />
                </div>

                {/* Step 3: E - Concrete Example */}
                <div className="p-4 space-y-2 text-xs border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">[E]</span>
                      Concrete Example
                    </span>
                    <button
                      onClick={() => setAreaExampleText(activeAreaQuestion.guidedAnswer.example.stem)}
                      className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
                    >
                      Use Stem
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">{activeAreaQuestion.guidedAnswer.example.tip}</p>
                  <textarea
                    value={areaExampleText}
                    onChange={(e) => setAreaExampleText(e.target.value)}
                    placeholder={activeAreaQuestion.guidedAnswer.example.sample}
                    rows={2}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-sans"
                  />
                </div>

                {/* Step 4: A - Alternative Perspective */}
                <div className="p-4 space-y-2 text-xs border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">[A]</span>
                      Alternative / Nuance
                    </span>
                    <button
                      onClick={() => setAreaAltText(activeAreaQuestion.guidedAnswer.alternative.stem)}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium"
                    >
                      Use Stem
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">{activeAreaQuestion.guidedAnswer.alternative.tip}</p>
                  <textarea
                    value={areaAltText}
                    onChange={(e) => setAreaAltText(e.target.value)}
                    placeholder={activeAreaQuestion.guidedAnswer.alternative.sample}
                    rows={2}
                    className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-sans"
                  />
                </div>
              </div>

              {/* Assembled Response Preview: Unboxed editorial presentation */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Assembled Fluent Response
                  </span>
                  <button
                    onClick={() => setShowAreaModel(!showAreaModel)}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer underline"
                  >
                    {showAreaModel ? "Hide Band 9 Model" : "View Band 9 Model Response"}
                  </button>
                </div>

                <div className="p-4 border-l-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs text-neutral-800 dark:text-neutral-200 font-serif leading-relaxed">
                  {showAreaModel ? (
                    <span>
                      <strong className="text-blue-600 dark:text-blue-400 font-sans font-semibold">[Answer]</strong>{" "}
                      {activeAreaQuestion.guidedAnswer.answer.sample}{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold">[Reason]</strong>{" "}
                      {activeAreaQuestion.guidedAnswer.reason.sample}{" "}
                      <strong className="text-amber-600 dark:text-amber-400 font-sans font-semibold">[Example]</strong>{" "}
                      {activeAreaQuestion.guidedAnswer.example.sample}{" "}
                      <strong className="text-purple-600 dark:text-purple-400 font-sans font-semibold">[Alternative]</strong>{" "}
                      {activeAreaQuestion.guidedAnswer.alternative.sample}
                    </span>
                  ) : (
                    <span>
                      {areaAnswerText || "(Fill in Answer above)"} {areaReasonText || "(Fill in Reason above)"}{" "}
                      {areaExampleText || "(Fill in Example above)"} {areaAltText || "(Fill in Alternative above)"}
                    </span>
                  )}
                </div>

                {showAreaModel && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() =>
                        speakText(
                          `${activeAreaQuestion.guidedAnswer.answer.sample} ${activeAreaQuestion.guidedAnswer.reason.sample} ${activeAreaQuestion.guidedAnswer.example.sample} ${activeAreaQuestion.guidedAnswer.alternative.sample}`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-medium cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen to Assembled Model</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DRILL B: BUYING-TIME NATURAL FILLERS */}
          {activeGymDrill === "buying_time_fillers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  &ldquo;Stall & Buy-Time&rdquo; Natural Hesitation Fillers (Eliminate &ldquo;Umm / Uhh&rdquo;)
                </span>
                <span className="text-neutral-400">
                  Card {activeFillerIndex + 1} of {BUYING_TIME_FILLERS.length}
                </span>
              </div>

              {/* Filler Category Navigation: Clean horizontal line */}
              <div className="flex items-center gap-4 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
                {BUYING_TIME_FILLERS.map((filler, idx) => (
                  <button
                    key={filler.id}
                    onClick={() => {
                      setActiveFillerIndex(idx);
                      stopSpeaking();
                    }}
                    className={`py-1 whitespace-nowrap cursor-pointer transition-colors ${
                      activeFillerIndex === idx
                        ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                    }`}
                  >
                    {filler.category}
                  </button>
                ))}
              </div>

              {/* Active Filler Display Card: Unboxed editorial presentation */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    {activeFiller.category} Strategy
                  </span>
                  <button
                    onClick={() => speakText(activeFiller.phrase)}
                    className="flex items-center gap-1.5 px-3 py-1 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Hear Pronunciation</span>
                  </button>
                </div>

                <div className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 dark:text-neutral-100 leading-snug py-3">
                  &ldquo;{activeFiller.phrase}&rdquo;
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border border-neutral-200 dark:border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 text-xs">
                  <div className="p-4 space-y-1">
                    <strong className="text-neutral-900 dark:text-neutral-100 block">
                      Why Examiners Reward This:
                    </strong>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {activeFiller.whyExaminersLoveIt}
                    </p>
                  </div>

                  <div className="p-4 space-y-1">
                    <strong className="text-neutral-900 dark:text-neutral-100 block">
                      When to Deploy:
                    </strong>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {activeFiller.usageContext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Practice Prompt: Deploy this filler! */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Reflex Challenge: Launch your answer using this filler!
                  </span>
                  <button
                    onClick={() =>
                      setTrickyPromptIndex((prev) => (prev + 1) % TRICKY_PROMPTS.length)
                    }
                    className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Try Different Tricky Question</span>
                  </button>
                </div>

                <div className="p-4 border-l-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50/50 dark:bg-neutral-900/30 font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  &ldquo;{TRICKY_PROMPTS[trickyPromptIndex]}&rdquo;
                </div>

                <p className="text-[11px] text-neutral-500 italic">
                  Say aloud right now: <strong>&ldquo;{activeFiller.phrase}&rdquo;</strong> followed by your spontaneous point!
                </p>
              </div>
            </div>
          )}

          {/* DRILL C: SPOKEN COLLOCATION FLASHCARDS */}
          {activeGymDrill === "collocation_flashcards" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Spoken Collocation Upgrade Flashcards
                  </span>
                  <span className="text-neutral-400">
                    ({masteredCards.size} of {COLLOCATION_FLASHCARDS.length} mastered)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFlashcardIndex((prev) =>
                        (prev - 1 + COLLOCATION_FLASHCARDS.length) % COLLOCATION_FLASHCARDS.length
                      );
                      setIsCardFlipped(false);
                    }}
                    className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => {
                      setFlashcardIndex((prev) => (prev + 1) % COLLOCATION_FLASHCARDS.length);
                      setIsCardFlipped(false);
                    }}
                    className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Flashcard Main Box: Sleek hairline card */}
              {(() => {
                const currentCard = COLLOCATION_FLASHCARDS[flashcardIndex] || COLLOCATION_FLASHCARDS[0];
                const isMastered = masteredCards.has(currentCard.id);

                return (
                  <div className="max-w-xl mx-auto space-y-4">
                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className={`min-h-[220px] p-6 sm:p-8 border transition-colors cursor-pointer flex flex-col justify-between select-none ${
                        isCardFlipped
                          ? "border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/20"
                          : "border-neutral-200 dark:border-neutral-800 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                          {currentCard.category}
                        </span>
                        <span>Click card to {isCardFlipped ? "see basic phrase" : "reveal Band 8+ upgrade"}</span>
                      </div>

                      <div className="text-center py-6 space-y-2">
                        {!isCardFlipped ? (
                          <>
                            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                              Common Candidate Cliché:
                            </span>
                            <div className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 dark:text-neutral-100">
                              &ldquo;{currentCard.basicPhrase}&rdquo;
                            </div>
                            <span className="text-xs text-neutral-400 block pt-1">
                              (Tap to reveal high-band collocation)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                              {currentCard.registerLevel} Spoken Upgrade:
                            </span>
                            <div className="text-xl sm:text-2xl font-serif font-normal text-emerald-700 dark:text-emerald-300">
                              &ldquo;{currentCard.upgradedCollocation}&rdquo;
                            </div>
                            <p className="text-xs text-neutral-500 pt-1">{currentCard.definition}</p>
                            <p className="text-xs italic text-neutral-700 dark:text-neutral-300 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                              &ldquo;{currentCard.exampleIeltsSentence}&rdquo;
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <span className="font-mono">Card {flashcardIndex + 1} of {COLLOCATION_FLASHCARDS.length}</span>
                        {isCardFlipped && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(currentCard.exampleIeltsSentence);
                            }}
                            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Hear in Sentence</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mastered & Navigation Controls */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          const nextSet = new Set(masteredCards);
                          if (isMastered) nextSet.delete(currentCard.id);
                          else nextSet.add(currentCard.id);
                          setMasteredCards(nextSet);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer border transition-colors ${
                          isMastered
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-700 dark:text-emerald-300"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isMastered ? "Mastered" : "Mark as Mastered"}</span>
                      </button>

                      <button
                        onClick={() => {
                          const rand = Math.floor(Math.random() * COLLOCATION_FLASHCARDS.length);
                          setFlashcardIndex(rand);
                          setIsCardFlipped(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-xs font-medium cursor-pointer"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
