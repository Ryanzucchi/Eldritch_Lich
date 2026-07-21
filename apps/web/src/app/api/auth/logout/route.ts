import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().delete('token');
    return NextResponse.json({ message: 'Sessão encerrada com sucesso.' });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
