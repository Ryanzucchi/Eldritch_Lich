import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isSessionActive, verifyToken } from '../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = verifyToken(token);

    if (!payload || (payload.sid && !isSessionActive(payload.sid, payload.id))) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: payload
    });
  } catch (err) {
    console.error('Session retrieve error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
