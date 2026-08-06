import { scryptSync, randomBytes, createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';
import { User, ResetToken, Project, Manuscript, ProjectCollaborator, Folder, UserSessionRecord, ChatChannel, ChatMessage } from '@eldritch/domain';

const USERS_FILE_PATH = path.join(process.cwd(), 'src/db/users.json');
const RESET_TOKENS_FILE_PATH = path.join(process.cwd(), 'src/db/reset_tokens.json');
const PROJECTS_FILE_PATH = path.join(process.cwd(), 'src/db/projects.json');
const MANUSCRIPTS_FILE_PATH = path.join(process.cwd(), 'src/db/manuscripts.json');
const COLLABORATORS_FILE_PATH = path.join(process.cwd(), 'src/db/collaborators.json');
const FOLDERS_FILE_PATH = path.join(process.cwd(), 'src/db/folders.json');
const SESSIONS_FILE_PATH = path.join(process.cwd(), 'src/db/sessions.json');
const CONSENT_AUDIT_FILE_PATH = path.join(process.cwd(), 'src/db/consent_audit.jsonl');
const CHAT_CHANNELS_FILE_PATH = path.join(process.cwd(), 'src/db/chat_channels.json');
const CHAT_MESSAGES_FILE_PATH = path.join(process.cwd(), 'src/db/chat_messages.json');
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[SECURITY] JWT_SECRET environment variable is required in production. Set it in your .env file.');
  }
  // Development-only warning — never use in production
  console.warn('[SECURITY WARNING] JWT_SECRET not set. Using unsafe dev-only secret. Do NOT deploy this.');
}
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-insecure-secret-DO-NOT-USE-IN-PROD';
const TOTP_ISSUER = 'Eldritch Lich';

// Ensure the db folder exists
function ensureDbDir() {
  const dir = path.dirname(USERS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read users from local JSON file
export function readUsers(): User[] {
  ensureDbDir();
  if (!fs.existsSync(USERS_FILE_PATH)) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

// Write users to local JSON file
export function writeUsers(users: User[]) {
  ensureDbDir();
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
}

function readJsonList<T>(filePath: string): T[] {
  ensureDbDir();
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return []; }
}
function writeJsonList<T>(filePath: string, items: T[]) { ensureDbDir(); fs.writeFileSync(filePath, JSON.stringify(items, null, 2)); }
export const readChatChannels = () => readJsonList<ChatChannel>(CHAT_CHANNELS_FILE_PATH);
export const writeChatChannels = (items: ChatChannel[]) => writeJsonList(CHAT_CHANNELS_FILE_PATH, items);
export const readChatMessages = () => readJsonList<ChatMessage>(CHAT_MESSAGES_FILE_PATH);
export const writeChatMessages = (items: ChatMessage[]) => writeJsonList(CHAT_MESSAGES_FILE_PATH, items);

export function readSessions(): UserSessionRecord[] {
  ensureDbDir();
  if (!fs.existsSync(SESSIONS_FILE_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE_PATH, 'utf8'));
  } catch (err) {
    console.error('Error reading sessions file:', err);
    return [];
  }
}

export function writeSessions(sessions: UserSessionRecord[]) {
  ensureDbDir();
  fs.writeFileSync(SESSIONS_FILE_PATH, JSON.stringify(sessions, null, 2));
}

export function createSession(userId: string, deviceInfo: string, ip: string): UserSessionRecord {
  const now = new Date().toISOString();
  const session = { id: crypto.randomUUID(), userId, deviceInfo: deviceInfo.slice(0, 300), ip: ip.slice(0, 100), createdAt: now, lastSeenAt: now };
  const sessions = readSessions().filter(item => !item.revokedAt || Date.parse(item.revokedAt) > Date.now() - 30 * 24 * 60 * 60 * 1000);
  sessions.push(session);
  writeSessions(sessions);
  return session;
}

export function isSessionActive(sessionId: unknown, userId: unknown): boolean {
  if (typeof sessionId !== 'string' || typeof userId !== 'string') return false;
  const sessions = readSessions();
  const session = sessions.find(item => item.id === sessionId && item.userId === userId && !item.revokedAt);
  if (!session) return false;
  session.lastSeenAt = new Date().toISOString();
  writeSessions(sessions);
  return true;
}

export function revokeSession(sessionId: string, userId: string): boolean {
  const sessions = readSessions();
  const session = sessions.find(item => item.id === sessionId && item.userId === userId && !item.revokedAt);
  if (!session) return false;
  session.revokedAt = new Date().toISOString();
  writeSessions(sessions);
  return true;
}

/** Append-only audit trail for privacy actions. This module intentionally exposes no update/delete API. */
export function appendConsentAudit(action: string, subjectId: string, ip: string) {
  ensureDbDir();
  fs.appendFileSync(CONSENT_AUDIT_FILE_PATH, `${JSON.stringify({ action, subjectId, ip: ip.slice(0, 100), timestamp: new Date().toISOString() })}\n`);
}

export function exportAccountData(userId: string) {
  const projects = readProjects().filter(project => project.ownerId === userId);
  const projectIds = new Set(projects.map(project => project.id));
  return {
    exportedAt: new Date().toISOString(),
    format: 'eldritch-lich.account-export.v1',
    user: readUsers().find(user => user.id === userId),
    projects,
    manuscripts: readManuscripts().filter(manuscript => manuscript.projectId && projectIds.has(manuscript.projectId)),
    folders: readFolders().filter(folder => projectIds.has(folder.projectId)),
    collaborators: readCollaborators().filter(item => projectIds.has(item.projectId)),
  };
}

/** Permanently removes all server-side JSON records owned by the account. */
export function deleteAccountData(userId: string, ip: string) {
  const user = readUsers().find(item => item.id === userId);
  const userEmail = user?.email.toLowerCase();
  const projects = readProjects();
  const ownedProjectIds = new Set(projects.filter(project => project.ownerId === userId).map(project => project.id));
  writeProjects(projects.filter(project => !ownedProjectIds.has(project.id)));
  writeManuscripts(readManuscripts().filter(manuscript => !manuscript.projectId || !ownedProjectIds.has(manuscript.projectId)));
  writeFolders(readFolders().filter(folder => !ownedProjectIds.has(folder.projectId)));
  writeCollaborators(readCollaborators().filter(item => !ownedProjectIds.has(item.projectId) && item.userEmail.toLowerCase() !== userEmail));
  writeResetTokens(readResetTokens().filter(token => token.email.toLowerCase() !== userEmail));
  writeSessions(readSessions().filter(session => session.userId !== userId));
  writeUsers(readUsers().filter(user => user.id !== userId));
  appendConsentAudit('DATA_DELETION_COMPLETED', 'DELETED', ip);
}

// Read reset tokens from local JSON file
export function readResetTokens(): ResetToken[] {
  ensureDbDir();
  if (!fs.existsSync(RESET_TOKENS_FILE_PATH)) {
    fs.writeFileSync(RESET_TOKENS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(RESET_TOKENS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading reset tokens file:', err);
    return [];
  }
}

// Write reset tokens to local JSON file
export function writeResetTokens(tokens: ResetToken[]) {
  ensureDbDir();
  fs.writeFileSync(RESET_TOKENS_FILE_PATH, JSON.stringify(tokens, null, 2));
}

// Read projects from local JSON file
export function readProjects(): Project[] {
  ensureDbDir();
  if (!fs.existsSync(PROJECTS_FILE_PATH)) {
    fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(PROJECTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading projects file:', err);
    return [];
  }
}

// Write projects to local JSON file
export function writeProjects(projects: Project[]) {
  ensureDbDir();
  fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(projects, null, 2));
}

// Read manuscripts from local JSON file
export function readManuscripts(): Manuscript[] {
  ensureDbDir();
  if (!fs.existsSync(MANUSCRIPTS_FILE_PATH)) {
    fs.writeFileSync(MANUSCRIPTS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(MANUSCRIPTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading manuscripts file:', err);
    return [];
  }
}

// Write manuscripts to local JSON file
export function writeManuscripts(manuscripts: Manuscript[]) {
  ensureDbDir();
  fs.writeFileSync(MANUSCRIPTS_FILE_PATH, JSON.stringify(manuscripts, null, 2));
}

// Read project collaborators from local JSON file
export function readCollaborators(): ProjectCollaborator[] {
  ensureDbDir();
  if (!fs.existsSync(COLLABORATORS_FILE_PATH)) {
    fs.writeFileSync(COLLABORATORS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(COLLABORATORS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading collaborators file:', err);
    return [];
  }
}

// Write project collaborators to local JSON file
export function writeCollaborators(collaborators: ProjectCollaborator[]) {
  ensureDbDir();
  fs.writeFileSync(COLLABORATORS_FILE_PATH, JSON.stringify(collaborators, null, 2));
}

// Read folders from local JSON file
export function readFolders(): Folder[] {
  ensureDbDir();
  if (!fs.existsSync(FOLDERS_FILE_PATH)) {
    fs.writeFileSync(FOLDERS_FILE_PATH, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(FOLDERS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading folders file:', err);
    return [];
  }
}

// Write folders to local JSON file
export function writeFolders(folders: Folder[]) {
  ensureDbDir();
  fs.writeFileSync(FOLDERS_FILE_PATH, JSON.stringify(folders, null, 2));
}

// Hash password using Node scrypt
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verifyHash = scryptSync(password, salt, 64).toString('hex');
  return verifyHash === hash;
}

// Generate JWT token (expires in 1 day)
export function signToken(payload: Record<string, unknown>, ttlSeconds = 24 * 60 * 60): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const fullPayload = { ...payload, exp };
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const hmac = createHmac('sha256', JWT_SECRET);
  hmac.update(`${base64Header}.${base64Payload}`);
  const signature = hmac.digest('base64url');
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

// Verify JWT token
export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    
    const hmac = createHmac('sha256', JWT_SECRET);
    hmac.update(`${headerB64}.${payloadB64}`);
    const expectedSignature = hmac.digest('base64url');
    
    if (signatureB64 !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    // Tokens issued before session tracking do not have a sid and remain valid until expiry.
    // Every newer token is checked against the revocation list on the server.
    if (payload.sid && !isSessionActive(payload.sid, payload.id)) return null;
    return payload;
  } catch {
    return null;
  }
}

function base32Encode(bytes: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let output = '';
  let value = 0;
  let bits = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += alphabet[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(value: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let current = 0;
  let bits = 0;
  const output: number[] = [];
  for (const character of value.toUpperCase().replace(/[=\s-]/g, '')) {
    const index = alphabet.indexOf(character);
    if (index < 0) throw new Error('Segredo TOTP inválido.');
    current = (current << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((current >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function totpForCounter(secret: string, counter: number): string {
  const counterBytes = Buffer.alloc(8);
  counterBytes.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac('sha1', base32Decode(secret)).update(counterBytes).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const number = ((digest[offset] & 0x7f) << 24)
    | (digest[offset + 1] << 16)
    | (digest[offset + 2] << 8)
    | digest[offset + 3];
  return String(number % 1_000_000).padStart(6, '0');
}

/** Generates a RFC 6238-compatible seed and provisioning URI for authenticator apps. */
export function createTotpSetup(email: string) {
  const secret = base32Encode(randomBytes(20));
  const label = `${TOTP_ISSUER}:${email}`;
  const uri = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(TOTP_ISSUER)}&algorithm=SHA1&digits=6&period=30`;
  return { secret, uri };
}

/** Allows one adjacent 30-second interval for minor device clock drift. */
export function verifyTotp(secret: string, code: string, now = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const counter = Math.floor(now / 30_000);
  return [-1, 0, 1].some(offset => {
    const expected = Buffer.from(totpForCounter(secret, counter + offset));
    const received = Buffer.from(code);
    return expected.length === received.length && timingSafeEqual(expected, received);
  });
}

function twoFactorKey(): Buffer {
  return createHmac('sha256', JWT_SECRET).update('eldritch-lich:two-factor-secret:v1').digest();
}

/** Protect the seed at rest even while the development JSON persistence is in use. */
export function encryptTwoFactorSecret(secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', twoFactorKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${ciphertext.toString('base64url')}`;
}

export function decryptTwoFactorSecret(value: string): string {
  const [ivValue, tagValue, ciphertextValue] = value.split('.');
  if (!ivValue || !tagValue || !ciphertextValue) throw new Error('Segredo 2FA corrompido.');
  const decipher = createDecipheriv('aes-256-gcm', twoFactorKey(), Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextValue, 'base64url')), decipher.final()]).toString('utf8');
}

// Sanitization of inputs to prevent XSS
export function sanitizeInput(text: string): string {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

interface AttemptRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number;
}

const loginAttemptsMap = new Map<string, AttemptRecord>();

export function checkLoginBlock(email: string, ip: string): { blocked: boolean; remainingMs: number } {
  const key = `${email.toLowerCase()}_${ip}`;
  const record = loginAttemptsMap.get(key);
  if (!record) return { blocked: false, remainingMs: 0 };

  const now = Date.now();
  if (record.blockedUntil > now) {
    return { blocked: true, remainingMs: record.blockedUntil - now };
  }

  // If block expired or 5 minutes passed since first attempt, we reset/cleanup
  if (now - record.firstAttempt > 5 * 60 * 1000) {
    loginAttemptsMap.delete(key);
  }

  return { blocked: false, remainingMs: 0 };
}

export function registerFailedLogin(email: string, ip: string): { blocked: boolean; attempts: number } {
  const key = `${email.toLowerCase()}_${ip}`;
  const record = loginAttemptsMap.get(key);
  const now = Date.now();

  if (!record) {
    loginAttemptsMap.set(key, { attempts: 1, firstAttempt: now, blockedUntil: 0 });
    return { blocked: false, attempts: 1 };
  }

  if (record.blockedUntil > now) {
    return { blocked: true, attempts: record.attempts };
  }

  if (now - record.firstAttempt > 5 * 60 * 1000) {
    record.attempts = 1;
    record.firstAttempt = now;
    record.blockedUntil = 0;
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= 5) {
    record.blockedUntil = now + 15 * 60 * 1000; // block for 15 minutes
    return { blocked: true, attempts: record.attempts };
  }

  return { blocked: false, attempts: record.attempts };
}

export function resetLoginAttempts(email: string, ip: string) {
  const key = `${email.toLowerCase()}_${ip}`;
  loginAttemptsMap.delete(key);
}
