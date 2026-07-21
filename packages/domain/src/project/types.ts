export interface Project {
  id: string;
  name: string;
  genre: string;
  visibility: 'PRIVADO' | 'COMPARTILHADO';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userEmail: string;
  permission: 'LEITOR' | 'EDITOR' | 'ADMINISTRADOR';
  status: 'PENDENTE' | 'ACEITO';
  invitedAt: string;
  acceptedAt?: string;
  expiresAt: string;
}
