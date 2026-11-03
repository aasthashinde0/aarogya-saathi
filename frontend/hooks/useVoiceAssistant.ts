// Aarogya Saathi - Voice Assistant Hook

import { useState, useRef } from 'react';
import { VoiceState, SupportedLanguage, InterfaceMode, VoiceAssistantResponse } from '../types';
import { AarogyaAPI } from '../services/api';

export function useVoiceAssistant(language: SupportedLanguage = 'hi-IN', mode: InterfaceMode = 'simple') {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [lastResponse, setLastResponse] = useState<VoiceAssistantResponse | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const playBase64Audio = (base64Audio: string, speed = audioSpeed) => {
    if (!base64Audio) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    audio.playbackRate = speed;
    currentAudioRef.current = audio;
    
    setVoiceState('speaking');
    audio.onended = () => setVoiceState('idle');
    audio.onerror = () => setVoiceState('idle');
    audio.play();
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setVoiceState('idle');
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setVoiceState('processing');
        try {
          const resp = await AarogyaAPI.processVoiceOrText(undefined, blob, language, mode);
          setLastResponse(resp);
          if (resp.audio_base64) {
            playBase64Audio(resp.audio_base64);
          } else {
            setVoiceState('idle');
          }
        } catch {
          setVoiceState('error');
        }
      };

      recorder.start();
      setVoiceState('listening');
    } catch {
      setVoiceState('error');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && voiceState === 'listening') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setVoiceState('processing');
    try {
      const resp = await AarogyaAPI.processVoiceOrText(queryText, undefined, language, mode);
      setLastResponse(resp);
      if (resp.audio_base64) {
        playBase64Audio(resp.audio_base64);
      } else {
        setVoiceState('idle');
      }
    } catch {
      setVoiceState('error');
    }
  };

  return {
    voiceState,
    lastResponse,
    audioSpeed,
    setAudioSpeed,
    startListening,
    stopListening,
    sendQuery,
    playBase64Audio,
    stopAudio,
  };
}
