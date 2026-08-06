import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createTotpSetup, encryptTwoFactorSecret, readUsers, verifyToken, writeUsers } from '../../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function POST() {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });

  const users = readUsers();
  const index = users.findIndex(user => user.id === payload.id);
  if (index < 0) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

  const setup = createTotpSetup(users[index].email);
  users[index].twoFactorSecretEncrypted = encryptTwoFactorSecret(setup.secret);
  users[index].twoFactorEnabled = false;
  users[index].updatedAt = new Date().toISOString();
  writeUsers(users);

  // The seed is returned exactly once, before activation; it is never exposed by profile/session APIs.
  return NextResponse.json({ secret: setup.secret, otpauthUri: setup.uri });
}
