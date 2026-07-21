import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readUsers, writeUsers, verifyToken, verifyPassword, hashPassword } from '../../../../services/auth-backend';

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const { oldPassword, newPassword, confirmNewPassword } = await req.json();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: 'As novas senhas não coincidem.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'A nova senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === payload.id);

    if (userIndex === -1) {
      return NextResponse.json({ message: 'Usuário não localizado.' }, { status: 404 });
    }

    const user = users[userIndex];

    // Verify old password
    if (!verifyPassword(oldPassword, user.passwordHash)) {
      return NextResponse.json(
        { message: 'A senha atual está incorreta.' },
        { status: 400 }
      );
    }

    // Update password
    users[userIndex].passwordHash = hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    writeUsers(users);

    return NextResponse.json({
      message: 'Senha atualizada com sucesso!'
    });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
