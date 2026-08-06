import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeSession, verifyToken } from '../../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  if (payload.sid === params.id) return NextResponse.json({ message: 'Use sair para encerrar a sessão atual.' }, { status: 400 });
  if (!revokeSession(params.id, payload.id)) return NextResponse.json({ message: 'Sessão não encontrada.' }, { status: 404 });
  return NextResponse.json({ message: 'Sessão encerrada.' });
}
