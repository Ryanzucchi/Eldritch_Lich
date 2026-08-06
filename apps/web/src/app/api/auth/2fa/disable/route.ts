import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readUsers, verifyPassword, verifyToken, writeUsers } from '../../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  const { password } = await request.json();
  if (typeof password !== 'string' || !password) return NextResponse.json({ message: 'Confirme sua senha para desabilitar o 2FA.' }, { status: 400 });

  const users = readUsers();
  const index = users.findIndex(user => user.id === payload.id);
  if (index < 0) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
  if (!verifyPassword(password, users[index].passwordHash)) return NextResponse.json({ message: 'Senha incorreta.' }, { status: 400 });

  users[index].twoFactorEnabled = false;
  delete users[index].twoFactorSecretEncrypted;
  users[index].updatedAt = new Date().toISOString();
  writeUsers(users);
  return NextResponse.json({ message: 'Autenticação em duas etapas desabilitada.' });
}
