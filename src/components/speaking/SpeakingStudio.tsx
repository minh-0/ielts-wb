"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { SPEAKING_PROMPTS, SpeakingPrompt } from "@/lib/ieltsPromptBank";
import {
  getLexicalPackForTopic,
  SHADOWING_MODELS,
  ShadowingModel,
  AREA_DRILLS,
  BUYING_TIME_FILLERS,
  COLLOCATION_FLASHCARDS,
} from "@/lib/speakingPracticeData";
import { CardFlip, ParticleButton } from "@/components/kokonutui";

interface SpeakingStudioProps {
  apiKey?: string;
  onOpenApiKeyModal?: () => void;
}

type StudioTab = "cue_card_scaffolder" | "shadowing_intonation" | "fluency_gym";
type FrameworkType = "four_wh" | "ppf" | "story_arc";
type GymDrill = "area_builder" | "buying_time_fillers" | "collocation_flashcards";

export function SpeakingStudio({}: SpeakingStudioProps) {
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

  const activeLexicalPack = getLexicalPackForTopic(
    useCustomPrompt ? customQuestion : selectedPrompt.topic + " " + selectedPrompt.question
  );

  // ==========================================
  // MODULE 2: SHADOWING & INTONATION STATE
  // ==========================================
  const [selectedModel, setSelectedModel] = useState<ShadowingModel>(SHADOWING_MODELS[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [isPlayingFullAudio, setIsPlayingFullAudio] = useState<boolean>(false);
  const [isPlayingSentenceAudio, setIsPlayingSentenceAudio] = useState<boolean>(false);

  const [shadowAudioUrl, setShadowAudioUrl] = useState<string | null>(null);
  const [isShadowRecording, setIsShadowRecording] = useState<boolean>(false);
  const shadowMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const shadowAudioChunksRef = useRef<Blob[]>([]);

  // ==========================================
  // MODULE 3: FLUENCY DRILLS STATE
  // ==========================================
  const [activeGymDrill, setActiveGymDrill] = useState<GymDrill>("area_builder");

  // Drill A: A.R.E.A. Builder
  const [activeAreaIndex, setActiveAreaIndex] = useState<number>(0);
  const activeAreaQuestion = AREA_DRILLS[activeAreaIndex] || AREA_DRILLS[0];
  const [areaAnswerText, setAreaAnswerText] = useState<string>("");
  const [areaReasonText, setAreaReasonText] = useState<string>("");
  const [areaExampleText, setAreaExampleText] = useState<string>("");
  const [areaAltText, setAreaAltText] = useState<string>("");
  const [showAreaModel, setShowAreaModel] = useState<boolean>(false);

  // Drill B: Discourse Fillers
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

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const speakText = (text: string, rate: number = 1.0, onEndCallback?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
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

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleShufflePrompt = () => {
    const randIdx = Math.floor(Math.random() * cueCardPrompts.length);
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

  const handleInsertFrameworkOutline = () => {
    let outline = "";
    if (activeFramework === "four_wh") {
      outline = `1. Who / What:\n- \n\n2. When / Where:\n- \n\n3. Why Important:\n- \n\n4. Reflection:\n- `;
    } else if (activeFramework === "ppf") {
      outline = `1. Past Background:\n- \n\n2. Present Significance:\n- \n\n3. Future Outlook:\n- `;
    } else {
      outline = `1. Setup:\n- \n\n2. Obstacle:\n- \n\n3. Resolution & Takeaway:\n- `;
    }
    setPrepNotes((prev) => (prev ? prev + "\n\n" + outline : outline));
  };

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
    <div className="space-y-6 font-sans">
      {/* Top Bar: Minimalist horizontal tabs + contextual controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-5 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("cue_card_scaffolder");
              stopSpeaking();
            }}
            className={`py-1 transition-colors cursor-pointer ${
              activeTab === "cue_card_scaffolder"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Part 2 Cue Card
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("shadowing_intonation");
              stopSpeaking();
            }}
            className={`py-1 transition-colors cursor-pointer ${
              activeTab === "shadowing_intonation"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Shadowing
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("fluency_gym");
              stopSpeaking();
            }}
            className={`py-1 transition-colors cursor-pointer ${
              activeTab === "fluency_gym"
                ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            Fluency Drills
          </button>
        </div>

        {/* Right-side contextual controls for the active tab */}
        {activeTab === "cue_card_scaffolder" && (
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setUseCustomPrompt(!useCustomPrompt)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
            >
              {useCustomPrompt ? "Choose from bank" : "+ Custom topic"}
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <button
              type="button"
              onClick={handleShufflePrompt}
              className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <button
              type="button"
              onClick={handleNextPrompt}
              className="inline-flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTab === "shadowing_intonation" && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400">Speed</span>
            <div className="flex items-center gap-1.5">
              {[0.85, 1.0, 1.15].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setSpeechSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-xs tabular-nums cursor-pointer transition-colors ${
                    speechSpeed === speed
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "fluency_gym" && (
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveGymDrill("area_builder");
                stopSpeaking();
              }}
              className={`cursor-pointer transition-colors ${
                activeGymDrill === "area_builder"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              A.R.E.A. Builder
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <button
              type="button"
              onClick={() => {
                setActiveGymDrill("buying_time_fillers");
                stopSpeaking();
              }}
              className={`cursor-pointer transition-colors ${
                activeGymDrill === "buying_time_fillers"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Discourse Fillers
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <button
              type="button"
              onClick={() => {
                setActiveGymDrill("collocation_flashcards");
                stopSpeaking();
              }}
              className={`cursor-pointer transition-colors ${
                activeGymDrill === "collocation_flashcards"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Collocations
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PART 2 CUE CARD                                   */}
      {/* ======================================================== */}
      {activeTab === "cue_card_scaffolder" && (
        <div className="space-y-6">
          {/* Prompt Section */}
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-2.5">
            {useCustomPrompt ? (
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter custom Part 2 cue card prompt..."
                rows={2}
                className="w-full p-3 text-xs sm:text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {selectedPrompt.topic}
                  </span>

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
                      className="py-1 pl-2.5 pr-7 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-700 dark:text-neutral-300 appearance-none cursor-pointer focus:outline-none hover:border-neutral-300 dark:hover:border-neutral-700 font-medium max-w-[260px] sm:max-w-xs truncate"
                    >
                      {cueCardPrompts.map((p, idx) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900">
                          {idx + 1}. {p.topic} — {p.question.slice(0, 48)}...
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {selectedPrompt.question}
                </h3>

                {selectedPrompt.bulletPoints && (
                  <div className="pt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      You should say:
                    </span>
                    {selectedPrompt.bulletPoints.map((bullet, idx) => (
                      <span key={idx} className="inline-flex items-baseline gap-1.5">
                        <span className="text-neutral-300 dark:text-neutral-700">•</span>
                        <span>{bullet}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Split View: Preparation & Speaking on Left (7 cols), Collocations on Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Preparation Notes & Recording Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Structure & 1-Minute Timer Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-3">
                    {(
                      [
                        { id: "four_wh", label: "4-Wh" },
                        { id: "ppf", label: "Past–Present–Future" },
                        { id: "story_arc", label: "Story Arc" },
                      ] as const
                    ).map((fw) => (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => setActiveFramework(fw.id)}
                        className={`py-0.5 cursor-pointer transition-colors ${
                          activeFramework === fw.id
                            ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                        }`}
                      >
                        {fw.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <button
                    type="button"
                    onClick={handleInsertFrameworkOutline}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
                  >
                    Insert outline
                  </button>
                </div>

                {/* 1-Minute Prep Timer */}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Prep</span>
                  <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                    {formatTime(prepSecondsRemaining)}
                  </span>
                  {!isPrepping && prepSecondsRemaining === 60 ? (
                    <button
                      type="button"
                      onClick={() => setIsPrepping(true)}
                      className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer transition-colors"
                    >
                      Start
                    </button>
                  ) : isPrepping ? (
                    <button
                      type="button"
                      onClick={() => setIsPrepping(false)}
                      className="px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPrepping(false);
                        setPrepSecondsRemaining(60);
                      }}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                      title="Reset prep timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Clean Sans-Serif Notes Area */}
              <textarea
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                placeholder="Write brief preparation keywords and notes..."
                rows={7}
                className="w-full p-3.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans leading-relaxed"
              />

              {/* Compact Structure Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                {activeFramework === "four_wh" && (
                  <>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Who / What: </span>
                      {activeLexicalPack.frameworkHints.fourWh.whoWhat}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">When / Where: </span>
                      {activeLexicalPack.frameworkHints.fourWh.whenWhere}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Why: </span>
                      {activeLexicalPack.frameworkHints.fourWh.why}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Reflection: </span>
                      {activeLexicalPack.frameworkHints.fourWh.howFelt}
                    </div>
                  </>
                )}
                {activeFramework === "ppf" && (
                  <>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Past: </span>
                      {activeLexicalPack.frameworkHints.ppf.past}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Present: </span>
                      {activeLexicalPack.frameworkHints.ppf.present}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Future: </span>
                      {activeLexicalPack.frameworkHints.ppf.future}
                    </div>
                  </>
                )}
                {activeFramework === "story_arc" && (
                  <>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Setup: </span>
                      {activeLexicalPack.frameworkHints.storyArc.setup}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Conflict: </span>
                      {activeLexicalPack.frameworkHints.storyArc.conflict}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">Resolution: </span>
                      {activeLexicalPack.frameworkHints.storyArc.resolution}
                    </div>
                  </>
                )}
              </div>

              {/* 2-Minute Speaking Timer & Voice Recorder */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                      {formatTime(deliverySeconds)}
                      <span className="text-sm font-normal text-neutral-400"> / 02:00</span>
                    </span>

                    {/* Minimal inline pacing milestones */}
                    <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                      <span
                        className={
                          isSpeakingDelivery && deliverySeconds < 30
                            ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                            : ""
                        }
                      >
                        Setup
                      </span>
                      <span>·</span>
                      <span
                        className={
                          isSpeakingDelivery && deliverySeconds >= 30 && deliverySeconds < 60
                            ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                            : ""
                        }
                      >
                        Details
                      </span>
                      <span>·</span>
                      <span
                        className={
                          isSpeakingDelivery && deliverySeconds >= 60 && deliverySeconds < 90
                            ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                            : ""
                        }
                      >
                        Key Moment
                      </span>
                      <span>·</span>
                      <span
                        className={
                          isSpeakingDelivery && deliverySeconds >= 90
                            ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                            : ""
                        }
                      >
                        Reflection
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isSpeakingDelivery ? (
                      <button
                        type="button"
                        onClick={startDeliveryRecording}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium text-xs cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Mic className="w-3.5 h-3.5 text-red-400 dark:text-red-500" />
                        <span>Record (2 min)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopDeliveryRecording}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-xs cursor-pointer hover:bg-red-700 transition-colors"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>Stop</span>
                      </button>
                    )}

                    {deliverySeconds > 0 && !isSpeakingDelivery && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeliverySeconds(0);
                          setDeliveryAudioUrl(null);
                        }}
                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors"
                        title="Reset timer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {deliveryAudioUrl && (
                  <div className="pt-2">
                    <audio src={deliveryAudioUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Key Collocations */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Key Collocations
                </span>
                <span className="text-neutral-400">{activeLexicalPack.topicName}</span>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {activeLexicalPack.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.phrase}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(item.phrase, `lex-${idx}`)}
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer text-[11px] inline-flex items-center gap-1 transition-colors"
                        title="Copy collocation"
                      >
                        {copiedKey === `lex-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {item.meaning}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 italic font-serif pt-0.5">
                      &ldquo;{item.example}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SHADOWING                                         */}
      {/* ======================================================== */}
      {activeTab === "shadowing_intonation" && (
        <div className="space-y-6">
          {/* Topic Selector & Prompt Header */}
          <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-5 overflow-x-auto">
                {SHADOWING_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(model);
                      setActiveSentenceIndex(0);
                      stopSpeaking();
                      setShadowAudioUrl(null);
                    }}
                    className={`py-0.5 whitespace-nowrap cursor-pointer transition-colors ${
                      selectedModel.id === model.id
                        ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                    }`}
                  >
                    {model.topic}
                  </button>
                ))}
              </div>

              {!isPlayingFullAudio ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingFullAudio(true);
                    speakText(selectedModel.fullModelAnswer, speechSpeed, () =>
                      setIsPlayingFullAudio(false)
                    );
                  }}
                  className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play full model</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-serif font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
              {selectedModel.question}
            </h3>
          </div>

          {/* Split View: Active Sentence Practice on Left (7 cols), Full Transcript on Right (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Active Sentence Shadowing */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-500 dark:text-neutral-400">
                  Sentence {activeSentenceIndex + 1} of {selectedModel.sentences.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSentenceIndex((prev) => Math.max(0, prev - 1));
                      stopSpeaking();
                      setShadowAudioUrl(null);
                    }}
                    disabled={activeSentenceIndex === 0}
                    className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 cursor-pointer font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSentenceIndex((prev) =>
                        Math.min(selectedModel.sentences.length - 1, prev + 1)
                      );
                      stopSpeaking();
                      setShadowAudioUrl(null);
                    }}
                    disabled={activeSentenceIndex === selectedModel.sentences.length - 1}
                    className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 cursor-pointer font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Annotated Sentence */}
              <div
                className="text-lg sm:text-xl font-serif text-neutral-900 dark:text-neutral-100 leading-relaxed py-2"
                dangerouslySetInnerHTML={{ __html: activeSentence.annotatedText }}
              />

              {/* Concise Intonation & Collocation Notes */}
              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <p className="leading-relaxed">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Intonation: </span>
                  {activeSentence.intonationExplanation}
                </p>
                {activeSentence.keyCollocations.length > 0 && (
                  <p className="leading-relaxed">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Collocations: </span>
                    {activeSentence.keyCollocations.join(" · ")}
                  </p>
                )}
              </div>

              {/* Audio & Recording Controls */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {!isPlayingSentenceAudio ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingSentenceAudio(true);
                      speakText(activeSentence.text, speechSpeed, () =>
                        setIsPlayingSentenceAudio(false)
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen ({speechSpeed}x)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 text-red-500" />
                    <span>Stop</span>
                  </button>
                )}

                {!isShadowRecording ? (
                  <button
                    type="button"
                    onClick={startShadowRecording}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-500" />
                    <span>Record</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopShadowRecording}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 text-white text-xs font-medium cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </button>
                )}
              </div>

              {shadowAudioUrl && (
                <div className="pt-2">
                  <audio src={shadowAudioUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Full Interactive Model Transcript */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Full Response Transcript
                </span>
                <span className="text-neutral-400">Select sentence</span>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {selectedModel.sentences.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveSentenceIndex(idx);
                      stopSpeaking();
                      setShadowAudioUrl(null);
                    }}
                    className={`w-full text-left py-2.5 px-2 rounded transition-colors cursor-pointer text-xs font-serif leading-relaxed ${
                      activeSentenceIndex === idx
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FLUENCY DRILLS                                    */}
      {/* ======================================================== */}
      {activeTab === "fluency_gym" && (
        <div className="space-y-6">
          {/* DRILL A: A.R.E.A. BUILDER */}
          {activeGymDrill === "area_builder" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">
                    {activeAreaQuestion.category} · Question {activeAreaIndex + 1} of {AREA_DRILLS.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAreaIndex((prev) => (prev + 1) % AREA_DRILLS.length);
                      setShowAreaModel(false);
                      setAreaAnswerText("");
                      setAreaReasonText("");
                      setAreaExampleText("");
                      setAreaAltText("");
                    }}
                    className="inline-flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer transition-colors"
                  >
                    <span>Next question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {activeAreaQuestion.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: 4-Step Input Fields */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        1. Answer
                      </span>
                      <button
                        type="button"
                        onClick={() => setAreaAnswerText(activeAreaQuestion.guidedAnswer.answer.stem)}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
                      >
                        Insert stem
                      </button>
                    </div>
                    <textarea
                      value={areaAnswerText}
                      onChange={(e) => setAreaAnswerText(e.target.value)}
                      placeholder={activeAreaQuestion.guidedAnswer.answer.sample}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        2. Reason
                      </span>
                      <button
                        type="button"
                        onClick={() => setAreaReasonText(activeAreaQuestion.guidedAnswer.reason.stem)}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
                      >
                        Insert stem
                      </button>
                    </div>
                    <textarea
                      value={areaReasonText}
                      onChange={(e) => setAreaReasonText(e.target.value)}
                      placeholder={activeAreaQuestion.guidedAnswer.reason.sample}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        3. Example
                      </span>
                      <button
                        type="button"
                        onClick={() => setAreaExampleText(activeAreaQuestion.guidedAnswer.example.stem)}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
                      >
                        Insert stem
                      </button>
                    </div>
                    <textarea
                      value={areaExampleText}
                      onChange={(e) => setAreaExampleText(e.target.value)}
                      placeholder={activeAreaQuestion.guidedAnswer.example.sample}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        4. Alternative
                      </span>
                      <button
                        type="button"
                        onClick={() => setAreaAltText(activeAreaQuestion.guidedAnswer.alternative.stem)}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
                      >
                        Insert stem
                      </button>
                    </div>
                    <textarea
                      value={areaAltText}
                      onChange={(e) => setAreaAltText(e.target.value)}
                      placeholder={activeAreaQuestion.guidedAnswer.alternative.sample}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans leading-relaxed"
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Assembled Response & Model */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {showAreaModel ? "Band 9 Model Response" : "Your Assembled Response"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAreaModel(!showAreaModel)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
                    >
                      {showAreaModel ? "Show my draft" : "Show model"}
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-serif leading-relaxed space-y-2">
                    {showAreaModel ? (
                      <p>
                        {activeAreaQuestion.guidedAnswer.answer.sample}{" "}
                        {activeAreaQuestion.guidedAnswer.reason.sample}{" "}
                        {activeAreaQuestion.guidedAnswer.example.sample}{" "}
                        {activeAreaQuestion.guidedAnswer.alternative.sample}
                      </p>
                    ) : (
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {[areaAnswerText, areaReasonText, areaExampleText, areaAltText]
                          .filter(Boolean)
                          .join(" ") || "Complete the four steps on the left to assemble your Part 3 response."}
                      </p>
                    )}
                  </div>

                  {showAreaModel && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          speakText(
                            `${activeAreaQuestion.guidedAnswer.answer.sample} ${activeAreaQuestion.guidedAnswer.reason.sample} ${activeAreaQuestion.guidedAnswer.example.sample} ${activeAreaQuestion.guidedAnswer.alternative.sample}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-medium cursor-pointer transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DRILL B: DISCOURSE FILLERS */}
          {activeGymDrill === "buying_time_fillers" && (
            <div className="space-y-6">
              <div className="flex items-center gap-5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                {BUYING_TIME_FILLERS.map((filler, idx) => (
                  <button
                    key={filler.id}
                    type="button"
                    onClick={() => {
                      setActiveFillerIndex(idx);
                      stopSpeaking();
                    }}
                    className={`py-0.5 whitespace-nowrap cursor-pointer transition-colors ${
                      activeFillerIndex === idx
                        ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100 -mb-2 pb-2"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                    }`}
                  >
                    {filler.category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                      {activeFiller.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(activeFiller.phrase)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Listen</span>
                    </button>
                  </div>

                  <div className="text-xl sm:text-2xl font-serif text-neutral-900 dark:text-neutral-100 leading-snug">
                    &ldquo;{activeFiller.phrase}&rdquo;
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="leading-relaxed">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Assessment value: </span>
                      {activeFiller.whyExaminersLoveIt}
                    </p>
                    <p className="leading-relaxed">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Usage context: </span>
                      {activeFiller.usageContext}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Practice Prompt
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTrickyPromptIndex((prev) => (prev + 1) % TRICKY_PROMPTS.length)
                      }
                      className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Next prompt</span>
                    </button>
                  </div>

                  <p className="font-serif text-sm sm:text-base text-neutral-900 dark:text-neutral-100 leading-relaxed">
                    &ldquo;{TRICKY_PROMPTS[trickyPromptIndex]}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DRILL C: COLLOCATION FLASHCARDS */}
          {activeGymDrill === "collocation_flashcards" && (
            <div className="max-w-xl mx-auto space-y-4 pt-2">
              {(() => {
                const currentCard =
                  COLLOCATION_FLASHCARDS[flashcardIndex] || COLLOCATION_FLASHCARDS[0];
                const isMastered = masteredCards.has(currentCard.id);

                return (
                  <>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        Card {flashcardIndex + 1} of {COLLOCATION_FLASHCARDS.length} ·{" "}
                        {masteredCards.size} mastered
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFlashcardIndex((prev) =>
                              (prev - 1 + COLLOCATION_FLASHCARDS.length) %
                              COLLOCATION_FLASHCARDS.length
                            );
                            setIsCardFlipped(false);
                          }}
                          className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFlashcardIndex(
                              (prev) => (prev + 1) % COLLOCATION_FLASHCARDS.length
                            );
                            setIsCardFlipped(false);
                          }}
                          className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <CardFlip
                      key={currentCard.id}
                      category={currentCard.category}
                      basicPhrase={currentCard.basicPhrase}
                      upgradedCollocation={currentCard.upgradedCollocation}
                      registerLevel={currentCard.registerLevel}
                      definition={currentCard.definition}
                      exampleSentence={currentCard.exampleIeltsSentence}
                      onPlayAudio={() => speakText(currentCard.exampleIeltsSentence)}
                    />

                    <div className="flex items-center justify-between text-xs pt-1">
                      <ParticleButton
                        onClick={() => {
                          const nextSet = new Set(masteredCards);
                          if (isMastered) nextSet.delete(currentCard.id);
                          else nextSet.add(currentCard.id);
                          setMasteredCards(nextSet);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isMastered
                            ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isMastered ? "Mastered" : "Mark mastered"}</span>
                      </ParticleButton>

                      <button
                        type="button"
                        onClick={() => {
                          const rand = Math.floor(
                            Math.random() * COLLOCATION_FLASHCARDS.length
                          );
                          setFlashcardIndex(rand);
                        }}
                        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium cursor-pointer transition-colors"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
