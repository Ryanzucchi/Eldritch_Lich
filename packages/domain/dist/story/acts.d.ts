export interface StoryAct {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    sceneIds: string[];
    sortOrder: number;
}
export interface HeroJourneyStage {
    id: string;
    projectId: string;
    characterName: string;
    stageName: string;
    sceneId?: string;
    notes?: string;
    stepNumber: number;
}
export interface CharacterArcPoint {
    id: string;
    projectId: string;
    characterName: string;
    chapterTitle: string;
    tensionLevel: number;
    emotionalState: string;
    notes?: string;
    sortOrder: number;
}
export declare const CLASSIC_HERO_JOURNEY_STAGES: string[];
export declare const DAN_HARMON_STORY_CIRCLE: string[];
/**
 * Calcula o ritmo e tensão média do enredo a partir dos pontos de arco dramático (UC-398).
 */
export declare function calculateDramaticPacing(points: CharacterArcPoint[]): {
    averageTension: number;
    peakPoint?: CharacterArcPoint;
    pacingTrend: 'CRESCENTE' | 'DECRESCENTE' | 'ESTAVEL';
};
