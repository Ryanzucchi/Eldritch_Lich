import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers, hashPassword } from '../../../../services/auth-backend';
import { User } from '@eldritch/domain';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
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
        { message: 'A senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const users = readUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este e-mail já está cadastrado.' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    return NextResponse.json(
      {
        message: 'Usuário registrado com sucesso. E-mail de ativação enviado (simulado).',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
