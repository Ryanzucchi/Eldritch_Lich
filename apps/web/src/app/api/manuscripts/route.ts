import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readManuscripts, 
  writeManuscripts, 
  verifyToken, 
  sanitizeInput, 
  readProjects, 
  readCollaborators,
  readFolders
} from '../../../services/auth-backend';
import { Manuscript } from '@eldritch/domain';

// Fetch manuscripts for a project
export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ message: 'O ID do projeto é obrigatório.' }, { status: 400 });
    }

    const projects = readProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    // Verify if the user is the owner or an active collaborator
    const collaborators = readCollaborators();
    const isOwner = project.ownerId === payload.id;
    const isCollaborator = collaborators.some(c => 
      c.projectId === projectId && 
      c.userEmail.toLowerCase() === payload.email.toLowerCase() && 
      c.status === 'ACEITO'
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: 'Acesso negado a este projeto.' }, { status: 403 });
    }

    const manuscripts = readManuscripts();
    const projectManuscripts = manuscripts.filter(m => m.projectId === projectId);

    return NextResponse.json({
      manuscripts: projectManuscripts
    });
  } catch (err) {
    console.error('Fetch manuscripts error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// Bulk sync or single update/save
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

    const { manuscript } = await req.json();

    if (!manuscript || !manuscript.id || !manuscript.projectId) {
      return NextResponse.json(
        { message: 'Dados inválidos do manuscrito.' },
        { status: 400 }
      );
    }

    // Verify project access and collaborator permission
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

    // LEITOR (Read-only) cannot modify manuscripts
    if (collaborator && collaborator.permission === 'LEITOR') {
      return NextResponse.json({ message: 'Permissão insuficiente. Você tem apenas acesso de leitura neste projeto.' }, { status: 403 });
    }

    const parentFolder = manuscript.folderId ? readFolders().find(folder => folder.id === manuscript.folderId && folder.projectId === manuscript.projectId) : undefined;
    if (parentFolder?.writePermission === 'owner' && !isOwner) {
      return NextResponse.json({ message: 'Esta pasta só pode ser alterada pelo proprietário do projeto.' }, { status: 403 });
    }

    // Sanitization of title and content to prevent XSS
    const sanitizedTitle = sanitizeInput(manuscript.title);
    const sanitizedContent = sanitizeInput(manuscript.content);

    const manuscripts = readManuscripts();
    const index = manuscripts.findIndex(m => m.id === manuscript.id);

    // Keep every field that the local-first editor manages. Previously this
    // endpoint rebuilt only the basic fields, so moving a chapter to a folder,
    // archiving it, or sending it to the trash was silently lost on refresh.
    const updatedManuscript: Manuscript = {
      id: manuscript.id,
      title: sanitizedTitle,
      content: sanitizedContent,
      status: manuscript.status || 'RASCUNHO',
      isLocked: !!manuscript.isLocked,
      projectId: manuscript.projectId,
      folderId: typeof manuscript.folderId === 'string' ? manuscript.folderId : undefined,
      createdAt: manuscript.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inTrash: !!manuscript.inTrash,
      deletedAt: typeof manuscript.deletedAt === 'string' ? manuscript.deletedAt : undefined,
      tags: Array.isArray(manuscript.tags) ? manuscript.tags.filter((tag: unknown) => typeof tag === 'string').slice(0, 30) : undefined,
      category: typeof manuscript.category === 'string' ? manuscript.category : undefined,
      isArchived: !!manuscript.isArchived,
      coverUrl: typeof manuscript.coverUrl === 'string' ? manuscript.coverUrl : undefined,
    };

    if (index === -1) {
      manuscripts.push(updatedManuscript);
    } else {
      manuscripts[index] = updatedManuscript;
    }

    writeManuscripts(manuscripts);

    return NextResponse.json({
      message: 'Manuscrito salvo com sucesso no servidor.',
      manuscript: updatedManuscript
    });
  } catch (err) {
    console.error('Save manuscript error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
