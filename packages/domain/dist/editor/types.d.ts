export interface Manuscript {
    id: string;
    title: string;
    content: string;
    status: 'RASCUNHO' | 'REVISAO' | 'FINALIZADO';
    isLocked: boolean;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
}
