/**
 * Voice Input component for TodoApp.
 *
 * Provides a microphone button to start voice input for tasks.
 */

import { motion } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceInputProps {
  onTaskAdded: (task: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTaskAdded, disabled = false }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    reset,
  } = useVoiceRecognition({
    continuous: false,
    interimResults: true,
  });

  const handleStart = () => {
    reset();
    startListening();
  };

  const handleStop = () => {
    stopListening();
    if (transcript.trim()) {
      onTaskAdded(transcript.trim());
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-red-600">
        Voice recognition is not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          scale: isListening ? 1.1 : 1,
          rotate: isListening ? [0, -5, 5, -5, 5, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: isListening ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        <Button
          variant={isListening ? "danger" : "secondary"}
          size="icon"
          onClick={isListening ? handleStop : handleStart}
          disabled={disabled}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </motion.div>

      {(isListening || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 w-full"
        >
          <div className="rounded-lg bg-gray-100 p-3 text-center dark:bg-gray-800">
            {isListening ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Listening...
                </span>
              </div>
            ) : transcript ? (
              <p className="text-sm text-gray-800 dark:text-gray-200">{transcript}</p>
            ) : null}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-red-600"
        >
          Error: {error}
        </motion.div>
      )}
    </div>
  );
}