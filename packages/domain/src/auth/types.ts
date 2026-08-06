export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  avatar?: string;
  bio?: string;
  timezone?: string;
  /** AES-GCM ciphertext of the user's TOTP seed; never return this to clients. */
  twoFactorSecretEncrypted?: string;
  twoFactorEnabled?: boolean;
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

export interface UserSessionRecord {
  id: string;
  userId: string;
  deviceInfo: string;
  ip: string;
  createdAt: string;
  lastSeenAt: string;
  revokedAt?: string;
}

export interface ResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
}
