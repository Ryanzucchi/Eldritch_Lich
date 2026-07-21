import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readManuscripts, 
  writeManuscripts, 
  verifyToken,
  readProjects,
  readCollaborators
} from '../../../../services/auth-backend';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'ID inválido.' }, { status: 400 });
    }

    const manuscripts = readManuscripts();
    const manuscript = manuscripts.find(m => m.id === id);

    if (!manuscript) {
      return NextResponse.json({ message: 'Manuscrito não encontrado.' }, { status: 404 });
    }

    // Verify user access to the associated project
    const projects = readProjects();
    const project = projects.find(p => p.id === manuscript.projectId);

    if (!project) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    const collaborators = readCollaborators();
    const isOwner = project.ownerId === payload.id;
    const collaborator = collaborators.find(c => 
      c.projectId === manuscript.projectId && 
      c.userEmail.toLowerCase() === payload.email.toLowerCase() && 
      c.status === 'ACEITO'
    );

    if (!isOwner && !collaborator) {
      return NextResponse.json({ message: 'Acesso negado a este projeto.' }, { status: 403 });
    }

    // LEITOR (Read-only) cannot delete manuscripts
    if (collaborator && collaborator.permission === 'LEITOR') {
      return NextResponse.json({ message: 'Permissão insuficiente. Você tem apenas acesso de leitura neste projeto.' }, { status: 403 });
    }

    const updated = manuscripts.filter(m => m.id !== id);
    writeManuscripts(updated);

    return NextResponse.json({
      message: 'Manuscrito excluído com sucesso.'
    });
  } catch (err) {
    console.error('Delete manuscript error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
