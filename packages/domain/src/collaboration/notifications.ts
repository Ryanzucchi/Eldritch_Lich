export type EmailFrequency = 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'OFF';

export interface NotificationSettings {
  id: string;
  userId: string;
  emailFrequency: EmailFrequency; // UC-220
  enableEmailNotifications: boolean; // UC-230
  enablePushNotifications: boolean; // UC-221
  notifyOnMentions: boolean; // UC-229
  notifyOnComments: boolean;
  notifyOnChatMessages: boolean; // UC-219
  updatedAt: string;
}

/**
 * Determina se uma notificação deve ser despachada por e-mail com base nas preferências do perfil do usuário (UC-220, UC-229, UC-230).
 */
export function shouldSendEmailNotification(
  settings: NotificationSettings,
  type: 'MENTION' | 'COMMENT' | 'CHAT'
): boolean {
  if (!settings.enableEmailNotifications || settings.emailFrequency === 'OFF') {
    return false;
  }

  if (type === 'MENTION' || type === 'COMMENT') {
    return settings.notifyOnMentions || settings.notifyOnComments;
  }

  return false;
}
