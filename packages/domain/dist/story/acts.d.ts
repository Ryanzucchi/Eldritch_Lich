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
export declare const CLASSIC_HERO_JOURNEY_STAGES: string[];
export declare const DAN_HARMON_STORY_CIRCLE: string[];
