import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readFolders, 
  writeFolders, 
  readProjects, 
  readCollaborators, 
  verifyToken 
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
      return NextResponse.json({ message: 'ID de pasta inválido.' }, { status: 400 });
    }

    const folders = readFolders();
    const folder = folders.find(f => f.id === id);

    if (!folder) {
      return NextResponse.json({ message: 'Pasta não encontrada.' }, { status: 404 });
    }

    const projects = readProjects();
    const project = projects.find(p => p.id === folder.projectId);

    if (!project) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    // Verify access
    const collaborators = readCollaborators();
    const isOwner = project.ownerId === payload.id;
    const collaborator = collaborators.find(c => 
      c.projectId === folder.projectId && 
      c.userEmail.toLowerCase() === payload.email.toLowerCase() && 
      c.status === 'ACEITO'
    );

    if (!isOwner && !collaborator) {
      return NextResponse.json({ message: 'Acesso negado a este projeto.' }, { status: 403 });
    }

    // LEITOR (Read-only) cannot delete folders
    if (collaborator && collaborator.permission === 'LEITOR') {
      return NextResponse.json({ message: 'Permissão insuficiente. Apenas leitores não podem excluir pastas.' }, { status: 403 });
    }

    // Remove the folder
    const updatedFolders = folders.filter(f => f.id !== id);
    
    // Safety check: disconnect children of this folder (prevent orphaned nodes or loops)
    const disconnectedFolders = updatedFolders.map(f => 
      f.parentFolderId === id ? { ...f, parentFolderId: undefined, updatedAt: new Date().toISOString() } : f
    );

    writeFolders(disconnectedFolders);

    return NextResponse.json({
      message: 'Pasta excluída com sucesso.'
    });
  } catch (err) {
    console.error('Delete folder error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
