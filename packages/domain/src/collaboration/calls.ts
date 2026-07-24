export type CallType = 'AUDIO' | 'VIDEO';
export type CallStatus = 'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED';

export interface CallParticipant {
  email: string;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

export interface VoiceMessage {
  id: string;
  channelId: string;
  senderEmail: string;
  senderName: string;
  audioBlobUrl: string;
  durationSeconds: number;
  playbackSpeed: number; // e.g. 1.0, 1.5, 2.0 (UC-362)
  createdAt: string;
}

export interface CallSession {
  id: string;
  projectId: string;
  roomName: string;
  type: CallType;
  status: CallStatus;
  hostEmail: string;
  participants: CallParticipant[]; // UC-368, UC-369
  isRecording: boolean; // UC-365 (Gravação)
  recordingUrl?: string;
  transcriptionText?: string; // UC-367 (Transcrição automática por IA)
  startedAt?: string;
  endedAt?: string;
}

/**
 * Simula a transcrição por IA de uma chamada gravada com marcas de tempo e diarização (UC-367).
 */
export function transcribeCallAudio(callTitle: string, durationMinutes: number): string {
  return `[TRANSCRIÇÃO AUTOMÁTICA POR IA - ${callTitle}]
Duração: ${durationMinutes} min | Acurácia estimada: 96% (WER < 12%)

[00:00:05] Autor Principal: "Pessoal, vamos iniciar o alinhamento da história do capítulo 3."
[00:00:45] Coautor / Editor: "Perfeito, analisei os arcos dramáticos e sugiro elevar a tensão no climax."
[00:02:10] Autor Principal: "Concordo totalmente! Vou ajustar a cena da taverna."
[00:05:00] [Fim da Transcrição Automática]`;
}
