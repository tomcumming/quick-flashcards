import { useEffect, useState } from "react";

function sortByLang(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.sort((a, b) => a.lang.localeCompare(b.lang));
}

export default function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState(window.speechSynthesis.getVoices());

  useEffect(() => {
    const handler = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
  }, []);

  return sortByLang(voices);
}
