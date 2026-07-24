"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSendEmailNotification = shouldSendEmailNotification;
/**
 * Determina se uma notificação deve ser despachada por e-mail com base nas preferências do perfil do usuário (UC-220, UC-229, UC-230).
 */
function shouldSendEmailNotification(settings, type) {
    if (!settings.enableEmailNotifications || settings.emailFrequency === 'OFF') {
        return false;
    }
    if (type === 'MENTION' || type === 'COMMENT') {
        return settings.notifyOnMentions || settings.notifyOnComments;
    }
    return false;
}
