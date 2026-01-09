/**
 * Custom hook for voice recognition functionality.
 *
 * Provides speech-to-text capabilities for voice-to-task feature.
 */

import { useState, useEffect, useCallback } from "react";

interface VoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function useVoiceRecognition(options: VoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser");
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !SpeechRecognition) {
      setError("Speech recognition is not supported");
      return;
    }

    setError(null);
    setTranscript("");
    setIsListening(true);

    const recognition = new SpeechRecognition();
    recognition.lang = options.lang || "en-US";
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || true;
    recognition.maxAlternatives = options.maxAlternatives || 1;

    recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      const currentTranscript = result[0]?.transcript || "";
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error || "Unknown error");
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart recognition if it was interrupted (for continuous mode)
        if (options.continuous) {
          recognition.start();
        } else {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.start();
  }, [SpeechRecognition, isSupported, options]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setTranscript("");
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    reset,
  };
}