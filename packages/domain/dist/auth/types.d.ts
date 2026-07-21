export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    avatar?: string;
    bio?: string;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
}
export interface AuthSession {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
    };
}
export interface ResetToken {
    id: string;
    email: string;
    token: string;
    expiresAt: string;
    used: boolean;
}
