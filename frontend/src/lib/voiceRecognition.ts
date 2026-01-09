/**
 * Voice recognition utility for TodoApp
 * TS-safe + SSR-safe + Production-ready
 */

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface VoiceRecognitionOptions {
  continuous?: boolean;
  lang?: string;
  interimResults?: boolean;
}

/**
 * TypeScript global fix for Web Speech API
 */
declare global {
  interface Window {
    SpeechRecognition: any; // TS ko bata do ye exist karta hai
    webkitSpeechRecognition: any;
  }
}

// Temporary type for recognition to avoid TS error
type BrowserSpeechRecognition = any;

export class VoiceRecognition {
  private recognition: BrowserSpeechRecognition | null = null;
  private isSupported = false;

  constructor(options: VoiceRecognitionOptions = {}) {
    // ✅ SSR SAFE
    if (typeof window === 'undefined') {
      this.isSupported = false;
      return;
    }

    // browser support check
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();

    // Default options
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.lang ?? 'en-PK';
  }

  /**
   * Check if browser supports voice recognition
   */
  isVoiceRecognitionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Start listening (must be triggered from user interaction)
   */
  startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): void {
    if (!this.isSupported || !this.recognition) {
      throw new Error('Voice recognition is not supported');
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex];
      const transcript = result?.[0]?.transcript ?? '';
      const isFinal = result?.isFinal ?? false;

      if (!transcript.trim()) return;

      onResult({ transcript, isFinal });
    };

    this.recognition.onerror = (event: any) => {
      if (onError) onError(event.error ?? 'Unknown voice error');
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch {
      // prevents DOMException if start() is called twice
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (!this.isSupported || !this.recognition) return;
    this.recognition.stop();
  }

  /**
   * Abort listening immediately
   */
  abort(): void {
    if (!this.isSupported || !this.recognition) return;
    this.recognition.abort();
  }
}

/**
 * Parse voice commands
 *
 * Supported commands:
 * - "Add task [title]"
 * - "Create task [title]"
 * - "Complete task [title]"
 * - "Mark task [title] as complete"
 * - "Delete task [title]"
 * - "Remove task [title]"
 * - "Set priority [low|medium|high] for [title]"
 */
export function parseVoiceCommand(
  transcript: string
): { action: 'add' | 'complete' | 'delete' | 'priority'; title: string; priority?: 'low' | 'medium' | 'high' } | null {
  const text = transcript.trim().toLowerCase();
  if (!text) return null;

  // ADD / CREATE
  const addMatch = text.match(/^(add|create)\s+task\s+(.+)$/);
  if (addMatch?.[2]) {
    return { action: 'add', title: addMatch[2].trim() };
  }

  // COMPLETE / MARK AS COMPLETE
  const completeMatch = text.match(
    /^(complete|mark)\s+task\s+(.+?)(\s+as\s+complete)?$/
  );
  if (completeMatch?.[2]) {
    return { action: 'complete', title: completeMatch[2].trim() };
  }

  // DELETE / REMOVE
  const deleteMatch = text.match(/^(delete|remove)\s+task\s+(.+)$/);
  if (deleteMatch?.[2]) {
    return { action: 'delete', title: deleteMatch[2].trim() };
  }

  // SET PRIORITY
  const priorityMatch = text.match(/^set\s+priority\s+(low|medium|high)\s+for\s+(.+)$/);
  if (priorityMatch?.[1] && priorityMatch?.[2]) {
    return {
      action: 'priority',
      title: priorityMatch[2].trim(),
      priority: priorityMatch[1] as 'low' | 'medium' | 'high'
    };
  }

  return null;
}
