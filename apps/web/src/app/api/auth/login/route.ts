import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readUsers, verifyPassword, signToken, checkLoginBlock, registerFailedLogin, resetLoginAttempts, sanitizeInput } from '../../../../services/auth-backend';

export async function POST(req: NextRequest) {
  try {
    let { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    email = sanitizeInput(email);

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Check rate limit block
    const blockCheck = checkLoginBlock(email, ip);
    if (blockCheck.blocked) {
      const minutes = Math.ceil(blockCheck.remainingMs / (60 * 1000));
      return NextResponse.json(
        { message: `Limite de 5 tentativas consecutivas falhas excedido. Conta bloqueada. Tente novamente em ${minutes} minutos.` },
        { status: 429 }
      );
    }

    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !verifyPassword(password, user.passwordHash)) {
      const block = registerFailedLogin(email, ip);
      if (block.blocked) {
        return NextResponse.json(
          { message: 'Limite de 5 tentativas consecutivas falhas excedido. Conta bloqueada temporariamente por 15 minutos.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { message: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    // Success - reset attempts
    resetLoginAttempts(email, ip);

    // Generate JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified
    };

    const token = signToken(payload);

    // Set cookies securely
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return NextResponse.json({
      message: 'Autenticado com sucesso.',
      user: payload
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
