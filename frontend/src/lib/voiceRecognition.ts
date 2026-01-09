/**
 * Voice recognition utility for TodoApp.
 *
 * Provides speech recognition functionality for voice commands.
 */

interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface VoiceRecognitionOptions {
  continuous?: boolean;
  lang?: string;
  interimResults?: boolean;
}

export class VoiceRecognition {
  private recognition: any;
  private isSupported: boolean;

  constructor(options: VoiceRecognitionOptions = {}) {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();

    // Set default options
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.lang = options.lang ?? 'en-US';
    this.recognition.interimResults = options.interimResults ?? false;
  }

  /**
   * Check if voice recognition is supported in the current browser
   */
  isVoiceRecognitionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Start listening for voice input
   */
  startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): void {
    if (!this.isSupported) {
      throw new Error('Voice recognition is not supported in this browser');
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

      onResult({
        transcript: transcript,
        isFinal
      });
    };

    this.recognition.onerror = (event: any) => {
      if (onError) {
        onError(event.error);
      }
    };

    this.recognition.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };

    this.recognition.start();
  }

  /**
   * Stop listening for voice input
   */
  stopListening(): void {
    if (!this.isSupported || !this.recognition) {
      return;
    }

    this.recognition.stop();
  }

  /**
   * Abort the current recognition and stop listening
   */
  abort(): void {
    if (!this.isSupported || !this.recognition) {
      return;
    }

    this.recognition.abort();
  }
}

/**
 * Parse voice command to extract action and task title
 * Supported commands:
 * - "Add task [title]"
 * - "Create task [title]"
 * - "Complete task [title]"
 * - "Mark task [title] as complete"
 */
export function parseVoiceCommand(transcript: string): { action: 'add' | 'complete', title: string } | null {
  const trimmedTranscript = transcript.trim().toLowerCase();

  // Match "add task [title]" or "create task [title]"
  const addMatch = trimmedTranscript.match(/^(add|create)\s+task\s+(.+)$/);
  if (addMatch) {
    return {
      action: 'add',
      title: addMatch[2].trim()
    };
  }

  // Match "complete task [title]" or "mark task [title] as complete"
  const completeMatch = trimmedTranscript.match(/^(complete|mark)\s+task\s+(.+?)(\s+as\s+complete)?$/);
  if (completeMatch) {
    return {
      action: 'complete',
      title: completeMatch[2].trim()
    };
  }

  return null;
}