export type EmailFrequency = 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'OFF';
export interface NotificationSettings {
    id: string;
    userId: string;
    emailFrequency: EmailFrequency;
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    notifyOnMentions: boolean;
    notifyOnComments: boolean;
    notifyOnChatMessages: boolean;
    updatedAt: string;
}
/**
 * Determina se uma notificação deve ser despachada por e-mail com base nas preferências do perfil do usuário (UC-220, UC-229, UC-230).
 */
export declare function shouldSendEmailNotification(settings: NotificationSettings, type: 'MENTION' | 'COMMENT' | 'CHAT'): boolean;
