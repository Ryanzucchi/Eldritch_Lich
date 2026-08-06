import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSessionActive, readSessions, verifyToken } from '../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id || (payload.sid && !isSessionActive(payload.sid, payload.id))) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  return NextResponse.json({
    currentSessionId: payload.sid || null,
    sessions: readSessions().filter(session => session.userId === payload.id && !session.revokedAt).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
  });
}
