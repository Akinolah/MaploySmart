import { useRef, useState, useCallback, useEffect } from "react";

export interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
}

type PermissionStatus = "unknown" | "prompt" | "granted" | "denied";

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [permission, setPermission] = useState<PermissionStatus>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef<number | null>(null);

  const startWatch = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setPermission("denied");
      return;
    }

    setError(null);

    // Try to check permission status first
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setPermission(result.state as PermissionStatus);
          result.onchange = () => {
            setPermission(result.state as PermissionStatus);
            if (result.state === "denied") {
              stopWatch();
              setError("Location permission denied. You can manually select a starting point instead.");
            }
          };
        })
        .catch(() => {});
    }

    setWatching(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setPermission("granted");
        setError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermission("denied");
          setError("Location permission denied. You can manually select a starting point instead.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Your location is currently unavailable. Try again or select a starting point manually.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Try again or select a starting point manually.");
        }
        setWatching(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );
  }, []);

  const stopWatch = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setWatching(false);
  }, []);

  const requestOnce = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setPermission("denied");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setPermission("granted");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermission("denied");
          setError("Location permission denied. You can manually select a starting point instead.");
        } else {
          setError("Could not get your location. Try again or select a starting point manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  useEffect(() => {
    return () => stopWatch();
  }, [stopWatch]);

  return { location, permission, error, watching, startWatch, stopWatch, requestOnce };
}

// Web Speech API types
interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      length: number;
      [index: number]: { transcript: string; confidence: number };
      isFinal: boolean;
    };
  };
  resultIndex: number;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useVoiceRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setSupported(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResultRef.current(transcript);
    };

    recognition.onerror = (event: { error: string }) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone permission denied. Please allow microphone access to use voice search.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try speaking again.");
      } else {
        setError("Voice recognition error. Please try again.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  return { listening, supported, error, start, stop };
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      const enVoice = voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices],
  );

  const speakSequence = useCallback(
    (texts: string[]) => {
      if (!("speechSynthesis" in window) || texts.length === 0) return;
      window.speechSynthesis.cancel();
      let index = 0;

      const speakNext = () => {
        if (index >= texts.length) {
          setSpeaking(false);
          return;
        }
        const utterance = new SpeechSynthesisUtterance(texts[index]);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        const enVoice = voices.find((v) => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;
        utterance.onend = () => {
          index++;
          speakNext();
        };
        utterance.onerror = () => {
          index++;
          speakNext();
        };
        window.speechSynthesis.speak(utterance);
      };

      setSpeaking(true);
      speakNext();
    },
    [voices],
  );

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speaking, supported, speak, speakSequence, stop };
}
