export type MoodType = 'tensao' | 'melancolia' | 'epico' | 'misterio' | 'tranquilo' | 'action';
export interface TrackItem {
    id: string;
    title: string;
    artist: string;
    mood: MoodType;
    durationSeconds: number;
    audioUrl: string;
}
export interface PlaylistResult {
    manuscriptId: string;
    detectedMood: MoodType;
    tracks: TrackItem[];
    crossfadeSeconds: number;
    generatedAt: string;
}
export declare const AMBIENT_LIBRARY: TrackItem[];
/**
 * Analisa o texto do capítulo/manuscrito para identificar o humor predominante
 * e gerar uma playlist ordenada com transições de crossfade.
 */
export declare function generateChapterPlaylist(manuscriptId: string, htmlOrText: string): PlaylistResult;
