import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readProjects, 
  readCollaborators, 
  verifyToken, 
  readFolders, 
  writeFolders 
} from '../../../services/auth-backend';
import { Folder } from '@eldritch/domain';

// Helper to detect loops in hierarchical subfolders (UC-011 Exception Flow)
function wouldCreateCycle(folderId: string, parentFolderId: string | undefined, allFolders: Folder[]): boolean {
  if (!parentFolderId) return false;
  if (folderId === parentFolderId) return true;
  let currentParentId: string | undefined = parentFolderId;
  
  // Max depth check to prevent infinite loops in bad state
  let depth = 0;
  while (currentParentId && depth < 100) {
    const parent = allFolders.find(f => f.id === currentParentId);
    if (!parent) break;
    if (parent.id === folderId) return true; // Cycle detected
    currentParentId = parent.parentFolderId;
    depth++;
  }
  return false;
}

// Fetch folders for a project
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

    // Verify access
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

    const folders = readFolders();
    const projectFolders = folders.filter(f => f.projectId === projectId);

    return NextResponse.json({
      folders: projectFolders
    });
  } catch (err) {
    console.error('Fetch folders error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// Create or update folder
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

    const { folder } = await req.json();

    if (!folder || !folder.id || !folder.name || !folder.projectId) {
      return NextResponse.json(
        { message: 'Dados inválidos da pasta.' },
        { status: 400 }
      );
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

    // LEITOR (Read-only) cannot create or modify folders
    if (collaborator && collaborator.permission === 'LEITOR') {
      return NextResponse.json({ message: 'Permissão insuficiente. Apenas leitores não podem criar pastas.' }, { status: 403 });
    }

    const folders = readFolders();

    // Check for loops/cycles if parentFolderId is provided
    if (folder.parentFolderId) {
      if (wouldCreateCycle(folder.id, folder.parentFolderId, folders)) {
        return NextResponse.json(
          { message: 'Ação inválida: pasta pai não pode ser filha de si mesma.' },
          { status: 400 }
        );
      }
    }

    const index = folders.findIndex(f => f.id === folder.id);

    const updatedFolder: Folder = {
      id: folder.id,
      name: folder.name,
      projectId: folder.projectId,
      parentFolderId: folder.parentFolderId || undefined,
      createdAt: folder.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (index === -1) {
      folders.push(updatedFolder);
    } else {
      folders[index] = updatedFolder;
    }

    writeFolders(folders);

    return NextResponse.json({
      message: 'Pasta salva com sucesso.',
      folder: updatedFolder
    });
  } catch (err) {
    console.error('Save folder error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
