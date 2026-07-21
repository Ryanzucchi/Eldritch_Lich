import { NextRequest, NextResponse } from 'next/server';
import { readUsers, readResetTokens, writeResetTokens } from '../../../../services/auth-backend';
import { ResetToken } from '@eldritch/domain';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'O e-mail é obrigatório.' },
        { status: 400 }
      );
    }

    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // For security reasons (prevention of email enumeration), always return a success response
    if (user) {
      const resetTokens = readResetTokens();
      
      const newToken: ResetToken = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        token: crypto.randomUUID(), // unique reset token
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        used: false
      };

      resetTokens.push(newToken);
      writeResetTokens(resetTokens);

      console.log(`[SIMULADO] E-mail de recuperação enviado para: ${email}`);
      console.log(`[SIMULADO] Link de recuperação: http://localhost:3000/auth/reset?token=${newToken.token}&email=${email}`);
    } else {
      console.log(`[SIMULADO] Solicitação de recuperação para e-mail inexistente: ${email}`);
    }

    return NextResponse.json({
      message: 'Se o e-mail estiver cadastrado, um link de recuperação será enviado.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
