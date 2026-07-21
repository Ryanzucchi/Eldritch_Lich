import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readCollaborators, 
  writeCollaborators, 
  verifyToken 
} from '../../../../../services/auth-backend';

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

    const { inviteId } = await req.json();

    if (!inviteId) {
      return NextResponse.json({ message: 'ID do convite é obrigatório.' }, { status: 400 });
    }

    const collaborators = readCollaborators();
    const collaboratorIndex = collaborators.findIndex(c => c.id === inviteId);

    if (collaboratorIndex === -1) {
      return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
    }

    const collaborator = collaborators[collaboratorIndex];

    // Verify if the invite belongs to the logged user
    if (collaborator.userEmail.toLowerCase() !== payload.email.toLowerCase()) {
      return NextResponse.json(
        { message: 'Este convite não foi enviado para o seu endereço de e-mail.' },
        { status: 403 }
      );
    }

    // Check expiration (criterio de aceite: expira em 7 dias)
    const now = Date.now();
    if (collaborator.status === 'PENDENTE' && new Date(collaborator.expiresAt).getTime() < now) {
      // Remove expired invite
      const updated = collaborators.filter(c => c.id !== inviteId);
      writeCollaborators(updated);
      return NextResponse.json(
        { message: 'Este convite já expirou (limite de 7 dias excedido).' },
        { status: 410 }
      );
    }

    if (collaborator.status === 'ACEITO') {
      return NextResponse.json(
        { message: 'Você já aceitou este convite anteriormente.' },
        { status: 400 }
      );
    }

    // Accept invite
    collaborators[collaboratorIndex] = {
      ...collaborator,
      status: 'ACEITO',
      acceptedAt: new Date().toISOString()
    };

    writeCollaborators(collaborators);

    return NextResponse.json({
      message: 'Convite aceito com sucesso. Você agora tem acesso a este projeto.',
      collaborator: collaborators[collaboratorIndex]
    });
  } catch (err) {
    console.error('Accept invite error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
