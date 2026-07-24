export interface Folder {
    id: string;
    name: string;
    projectId: string;
    parentFolderId?: string;
    createdAt: string;
    updatedAt: string;
    coverUrl?: string;
}
export interface Manuscript {
    id: string;
    title: string;
    content: string;
    status: 'RASCUNHO' | 'REVISAO' | 'FINALIZADO';
    isLocked: boolean;
    projectId?: string;
    folderId?: string;
    createdAt: string;
    updatedAt: string;
    inTrash?: boolean;
    deletedAt?: string;
    tags?: string[];
    category?: string;
    isArchived?: boolean;
    coverUrl?: string;
}
