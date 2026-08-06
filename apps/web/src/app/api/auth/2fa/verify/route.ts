import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSession, decryptTwoFactorSecret, readUsers, signToken, verifyToken, verifyTotp, writeUsers } from '../../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

function sessionPayload(user: { id: string; name: string; email: string; emailVerified: boolean }) {
  return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified };
}

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  if (typeof code !== 'string') return NextResponse.json({ message: 'Informe o código de seis dígitos.' }, { status: 400 });

  const regularToken = cookies().get('token')?.value;
  const regularSession = regularToken && verifyToken(regularToken);
  const pendingToken = cookies().get('twoFactorPending')?.value;
  const pendingSession = pendingToken && verifyToken(pendingToken);
  const userId = regularSession?.id ?? (pendingSession?.purpose === 'two-factor-login' ? pendingSession.id : undefined);
  if (!userId) return NextResponse.json({ message: 'Sessão de verificação inválida ou expirada.' }, { status: 401 });

  const users = readUsers();
  const index = users.findIndex(user => user.id === userId);
  const user = users[index];
  if (!user?.twoFactorSecretEncrypted) return NextResponse.json({ message: 'Configure o autenticador antes de verificar o código.' }, { status: 400 });

  try {
    if (!verifyTotp(decryptTwoFactorSecret(user.twoFactorSecretEncrypted), code.trim())) {
      return NextResponse.json({ message: 'Código inválido ou expirado.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ message: 'Não foi possível validar o autenticador. Refaça a configuração.' }, { status: 400 });
  }

  users[index].twoFactorEnabled = true;
  users[index].updatedAt = new Date().toISOString();
  writeUsers(users);

  if (pendingSession) {
    const session = createSession(user.id, request.headers.get('user-agent') || 'Dispositivo desconhecido', request.headers.get('x-forwarded-for') || '127.0.0.1');
    cookies().delete('twoFactorPending');
    cookies().set('token', signToken({ ...sessionPayload(user), sid: session.id }), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 * 24, path: '/'
    });
  }
  return NextResponse.json({ message: regularSession ? 'Autenticação em duas etapas ativada.' : 'Autenticado com sucesso.' });
}
