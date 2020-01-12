import * as React from "react";
import useVoices from "../hooks/voices";

export type Props = {
  voice: string;
  text: string;
};

export default function Speak({ voice, text }: Props) {
  const voices = useVoices();

  React.useEffect(() => {
    const matchedVoice = voices.find(v => v.voiceURI === voice);
    if (matchedVoice !== undefined) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.voice = matchedVoice;
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
      return () => window.speechSynthesis.cancel();
    }
  }, [voices, voice, text]);

  return null;
}
