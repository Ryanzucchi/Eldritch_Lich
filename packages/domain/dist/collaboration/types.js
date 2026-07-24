"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShareToken = generateShareToken;
exports.validateRoleChange = validateRoleChange;
/**
 * Gera um token criptográfico seguro para links públicos de documento (UC-082) ou convites de projeto (UC-135).
 */
function generateShareToken() {
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
function validateRoleChange(members, targetMemberId, newRole) {
    const targetMember = members.find(m => m.id === targetMemberId);
    if (!targetMember)
        return { allowed: false, reason: 'Membro não encontrado.' };
    if (targetMember.role === 'OWNER' && newRole !== 'OWNER') {
        const ownersCount = members.filter(m => m.role === 'OWNER').length;
        if (ownersCount <= 1) {
            return { allowed: false, reason: 'O projeto precisa ter pelo menos um Dono (Owner).' };
        }
    }
    return { allowed: true };
}
