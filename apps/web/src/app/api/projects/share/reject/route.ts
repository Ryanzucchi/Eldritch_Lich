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
    const collaborator = collaborators.find(c => c.id === inviteId);

    if (!collaborator) {
      return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
    }

    // Verify if the invite belongs to the logged user (or if they are the owner of the project)
    // Actually, only the recipient of the invite can reject it.
    if (collaborator.userEmail.toLowerCase() !== payload.email.toLowerCase()) {
      return NextResponse.json(
        { message: 'Você não tem permissão para rejeitar este convite.' },
        { status: 403 }
      );
    }

    // Reject (delete the invite record)
    const updated = collaborators.filter(c => c.id !== inviteId);
    writeCollaborators(updated);

    return NextResponse.json({
      message: 'Convite recusado com sucesso.'
    });
  } catch (err) {
    console.error('Reject invite error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
