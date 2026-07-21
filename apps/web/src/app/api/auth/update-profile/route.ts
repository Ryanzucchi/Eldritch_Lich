import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readUsers, writeUsers, verifyToken, signToken } from '../../../../services/auth-backend';

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

    const { name, email, bio, timezone, avatar } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Nome e E-mail são obrigatórios.' },
        { status: 400 }
      );
    }

    const users = readUsers();
    
    // Check if email is already taken by another user
    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.id !== payload.id
    );
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este e-mail já está sendo utilizado.' },
        { status: 400 }
      );
    }

    // Find current user index
    const userIndex = users.findIndex(u => u.id === payload.id);
    if (userIndex === -1) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    // Update user record
    users[userIndex].name = name;
    users[userIndex].email = email.toLowerCase();
    users[userIndex].bio = bio || '';
    users[userIndex].timezone = timezone || 'America/Recife';
    
    if (avatar) {
      // Validate image size (must be under 2MB base64 size limit)
      // Base64 size estimation: string length * 0.75 bytes
      const estimatedSize = avatar.length * 0.75;
      if (estimatedSize > 2 * 1024 * 1024) {
        return NextResponse.json(
          { message: 'A foto de perfil excede o limite de 2MB.' },
          { status: 400 }
        );
      }
      users[userIndex].avatar = avatar;
    }

    users[userIndex].updatedAt = new Date().toISOString();
    writeUsers(users);

    // Re-sign token if name or email changed
    const newPayload = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      emailVerified: users[userIndex].emailVerified
    };

    const newToken = signToken(newPayload);

    // Set updated session cookie
    cookies().set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso.',
      user: {
        ...newPayload,
        bio: users[userIndex].bio,
        timezone: users[userIndex].timezone,
        avatar: users[userIndex].avatar
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
