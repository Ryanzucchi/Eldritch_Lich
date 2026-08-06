import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeSession, verifyToken } from '../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const token = cookies().get('token')?.value;
    const payload = token && verifyToken(token);
    if (payload?.sid && payload.id) revokeSession(payload.sid, payload.id);
    cookies().delete('token');
    return NextResponse.json({ message: 'Sessão encerrada com sucesso.' });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
