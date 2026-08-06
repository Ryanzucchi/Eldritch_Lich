export interface ContradictionAlert {
    premise: string;
    hypothesis: string;
    confidence: number;
    explanation: string;
}
export interface CrossDocumentContradiction extends ContradictionAlert {
    sourceTitle: string;
    targetTitle: string;
}
export interface LocationContradiction extends ContradictionAlert {
    entity: string;
    locations: [string, string];
}
/** Fast local fallback: detects negated repetitions in a bounded sentence window. */
export declare function detectLocalContradictions(text: string, maxSentences?: number): ContradictionAlert[];
export declare function detectCrossDocumentContradictions(documents: Array<{
    title: string;
    content: string;
}>): CrossDocumentContradiction[];
export declare function detectLocationContradictions(text: string): LocationContradiction[];
