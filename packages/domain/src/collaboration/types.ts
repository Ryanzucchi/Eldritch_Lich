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
  action: string; // e.g. "DOCUMENT_EDITED", "MEMBER_ROLE_CHANGED", "INVITE_LINK_GENERATED"
  resourceId: string;
  timestamp: string;
  details?: string;
}

/**
 * Gera um token criptográfico seguro para links públicos de documento (UC-082) ou convites de projeto (UC-135).
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Valida a permissão do usuário e impede rebaixar o único Owner do projeto (UC-083).
 */
export function validateRoleChange(
  members: ProjectMember[],
  targetMemberId: string,
  newRole: ProjectRole
): { allowed: boolean; reason?: string } {
  const targetMember = members.find(m => m.id === targetMemberId);
  if (!targetMember) return { allowed: false, reason: 'Membro não encontrado.' };

  if (targetMember.role === 'OWNER' && newRole !== 'OWNER') {
    const ownersCount = members.filter(m => m.role === 'OWNER').length;
    if (ownersCount <= 1) {
      return { allowed: false, reason: 'O projeto precisa ter pelo menos um Dono (Owner).' };
    }
  }

  return { allowed: true };
}
