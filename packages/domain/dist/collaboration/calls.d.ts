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
    playbackSpeed: number;
    createdAt: string;
}
export interface CallSession {
    id: string;
    projectId: string;
    roomName: string;
    type: CallType;
    status: CallStatus;
    hostEmail: string;
    participants: CallParticipant[];
    isRecording: boolean;
    recordingUrl?: string;
    transcriptionText?: string;
    startedAt?: string;
    endedAt?: string;
}
/**
 * Simula a transcrição por IA de uma chamada gravada com marcas de tempo e diarização (UC-367).
 */
export declare function transcribeCallAudio(callTitle: string, durationMinutes: number): string;
