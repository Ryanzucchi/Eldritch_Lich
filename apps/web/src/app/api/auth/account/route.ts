import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteAccountData, readUsers, verifyPassword, verifyToken } from '../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  const { email, password, exportConfirmed } = await request.json();
  const user = readUsers().find(item => item.id === payload.id);
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
  if (email?.toLowerCase() !== user.email.toLowerCase()) return NextResponse.json({ message: 'Digite seu e-mail exatamente para confirmar a exclusão.' }, { status: 400 });
  if (!exportConfirmed) return NextResponse.json({ message: 'Baixe seus dados antes de excluir a conta.' }, { status: 400 });
  if (!verifyPassword(password || '', user.passwordHash)) return NextResponse.json({ message: 'Senha incorreta.' }, { status: 400 });

  deleteAccountData(user.id, request.headers.get('x-forwarded-for') || '127.0.0.1');
  cookies().delete('token');
  cookies().delete('twoFactorPending');
  return NextResponse.json({ message: 'Conta e dados associados foram excluídos permanentemente.' });
}
