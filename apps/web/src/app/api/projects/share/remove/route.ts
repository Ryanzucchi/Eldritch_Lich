import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readCollaborators, 
  writeCollaborators, 
  readProjects,
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

    const { collaboratorId } = await req.json();

    if (!collaboratorId) {
      return NextResponse.json({ message: 'ID do colaborador é obrigatório.' }, { status: 400 });
    }

    const collaborators = readCollaborators();
    const collaboratorIndex = collaborators.findIndex(c => c.id === collaboratorId);

    if (collaboratorIndex === -1) {
      return NextResponse.json({ message: 'Colaborador não encontrado.' }, { status: 404 });
    }

    const collaborator = collaborators[collaboratorIndex];

    // Verify if the active user is the owner of the project
    const projects = readProjects();
    const project = projects.find(p => p.id === collaborator.projectId);

    if (!project) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    if (project.ownerId !== payload.id) {
      return NextResponse.json(
        { message: 'Apenas o proprietário do projeto pode remover colaboradores.' },
        { status: 403 }
      );
    }

    // Remove collaborator
    const updated = collaborators.filter(c => c.id !== collaboratorId);
    writeCollaborators(updated);

    return NextResponse.json({
      message: 'Colaborador removido com sucesso do projeto.'
    });
  } catch (err) {
    console.error('Remove collaborator error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
