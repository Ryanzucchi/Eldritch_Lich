export interface Project {
    id: string;
    name: string;
    genre: string;
    visibility: 'PRIVADO' | 'COMPARTILHADO';
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}
