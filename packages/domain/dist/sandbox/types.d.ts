export interface SandboxEnvironment {
    id: string;
    projectId: string;
    name: string;
    isPromoted: boolean;
    createdAt: string;
}
export interface SandboxChange {
    id: string;
    sandboxId: string;
    entityType: 'character' | 'location' | 'timeline' | 'scene';
    entityId: string;
    originalValue: string;
    hypotheticalValue: string;
    isMerged: boolean;
}
/**
 * Compara as alterações hipotéticas do Sandbox com os dados do universo canônico (UC-405).
 */
export declare function compareSandboxWithCanonical(changes: SandboxChange[]): {
    modifiedCount: number;
    unmergedCount: number;
    summary: string;
};
