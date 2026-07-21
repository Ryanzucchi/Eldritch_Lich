import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers, readResetTokens, writeResetTokens, hashPassword, resetLoginAttempts } from '../../../../services/auth-backend';

export async function POST(req: NextRequest) {
  try {
    const { email, token, password, confirmPassword } = await req.json();

    if (!email || !token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'As senhas não coincidem.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'A nova senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const resetTokens = readResetTokens();
    const tokenRecord = resetTokens.find(
      t => t.email.toLowerCase() === email.toLowerCase() && t.token === token
    );

    if (!tokenRecord) {
      return NextResponse.json(
        { message: 'Token ou e-mail de recuperação inválido.' },
        { status: 400 }
      );
    }

    if (tokenRecord.used) {
      return NextResponse.json(
        { message: 'Este link de recuperação já foi utilizado.' },
        { status: 400 }
      );
    }

    const isExpired = new Date(tokenRecord.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json(
        { message: 'Link de recuperação expirado.' },
        { status: 400 }
      );
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'Usuário não localizado.' },
        { status: 404 }
      );
    }

    // Update password and invalidate token
    users[userIndex].passwordHash = hashPassword(password);
    users[userIndex].updatedAt = new Date().toISOString();
    writeUsers(users);

    tokenRecord.used = true;
    writeResetTokens(resetTokens);

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    resetLoginAttempts(email, ip);

    return NextResponse.json({
      message: 'Senha atualizada com sucesso! Você já pode realizar o login com sua nova senha.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
