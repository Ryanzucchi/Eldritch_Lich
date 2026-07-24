export type ProjectRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
export interface ProjectMember {
    id: string;
    projectId: string;
    userEmail: string;
    userName: string;
    role: ProjectRole;
    joinedAt: string;
}
export interface SharedDocumentLink {
    id: string;
    manuscriptId: string;
    token: string;
    isPublic: boolean;
    expiresAt?: string;
    createdAt: string;
}
export interface ProjectInviteLink {
    id: string;
    projectId: string;
    token: string;
    role: ProjectRole;
    expiresAt?: string;
    isRevoked: boolean;
    createdAt: string;
}
export interface CollaborationAuditLog {
    id: string;
    projectId: string;
    userId: string;
    userEmail: string;
    action: string;
    resourceId: string;
    timestamp: string;
    details?: string;
}
/**
 * Gera um token criptográfico seguro para links públicos de documento (UC-082) ou convites de projeto (UC-135).
 */
export declare function generateShareToken(): string;
/**
 * Valida a permissão do usuário e impede rebaixar o único Owner do projeto (UC-083).
 */
export declare function validateRoleChange(members: ProjectMember[], targetMemberId: string, newRole: ProjectRole): {
    allowed: boolean;
    reason?: string;
};
