import { scryptSync, randomBytes, createHmac } from 'crypto';
import fs from 'fs';
import path from 'path';
import { User, ResetToken, Project, Manuscript, ProjectCollaborator } from '@eldritch/domain';

const USERS_FILE_PATH = path.join(process.cwd(), 'src/db/users.json');
const RESET_TOKENS_FILE_PATH = path.join(process.cwd(), 'src/db/reset_tokens.json');
const PROJECTS_FILE_PATH = path.join(process.cwd(), 'src/db/projects.json');
const MANUSCRIPTS_FILE_PATH = path.join(process.cwd(), 'src/db/manuscripts.json');
const COLLABORATORS_FILE_PATH = path.join(process.cwd(), 'src/db/collaborators.json');
const JWT_SECRET = process.env.JWT_SECRET || 'eldritch-super-secret-key-12345';

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
export function signToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day
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
    return payload;
  } catch {
    return null;
  }
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
