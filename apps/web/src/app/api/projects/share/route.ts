import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readProjects, 
  readCollaborators, 
  writeCollaborators, 
  verifyToken, 
  readUsers 
} from '../../../../services/auth-backend';
import { ProjectCollaborator } from '@eldritch/domain';

// Regular expression for validating email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fetch collaborators for a project
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
      c.userEmail === payload.email && 
      c.status === 'ACEITO'
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: 'Acesso negado a este projeto.' }, { status: 403 });
    }

    // Clean expired invitations before returning
    const now = Date.now();
    const activeCollaborators = collaborators.filter(c => {
      if (c.projectId !== projectId) return false;
      if (c.status === 'PENDENTE' && new Date(c.expiresAt).getTime() < now) {
        return false; // Expired
      }
      return true;
    });

    return NextResponse.json({
      collaborators: activeCollaborators
    });
  } catch (err) {
    console.error('Fetch collaborators error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// Invite collaborator to project
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

    const { projectId, email, permission } = await req.json();

    if (!projectId || !email || !permission) {
      return NextResponse.json(
        { message: 'Projeto, e-mail e nível de permissão são obrigatórios.' },
        { status: 400 }
      );
    }

    // Validate email format (exceção: E-mail de destinatário inválido)
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: 'Formato de e-mail inválido.' },
        { status: 400 }
      );
    }

    const projects = readProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return NextResponse.json({ message: 'Projeto não encontrado.' }, { status: 404 });
    }

    // Verify ownership (pré-condição: usuário é o dono)
    if (project.ownerId !== payload.id) {
      return NextResponse.json(
        { message: 'Apenas o proprietário do projeto pode compartilhar.' },
        { status: 403 }
      );
    }

    // Cannot invite oneself
    if (email.toLowerCase() === payload.email.toLowerCase()) {
      return NextResponse.json(
        { message: 'Você não pode convidar a si mesmo.' },
        { status: 400 }
      );
    }

    // Verify if user is registered in the platform
    const users = readUsers();
    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      return NextResponse.json(
        { message: 'Colaborador não cadastrado no sistema.' },
        { status: 404 }
      );
    }

    const collaborators = readCollaborators();

    // Check if collaboration already exists
    const existing = collaborators.find(c => 
      c.projectId === projectId && 
      c.userEmail.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      const now = Date.now();
      if (existing.status === 'ACEITO') {
        return NextResponse.json(
          { message: 'Este usuário já é um colaborador deste projeto.' },
          { status: 400 }
        );
      } else if (new Date(existing.expiresAt).getTime() > now) {
        return NextResponse.json(
          { message: 'Já existe um convite ativo e pendente para este e-mail.' },
          { status: 400 }
        );
      } else {
        // Invite expired, remove the old one to create a new one
        const updated = collaborators.filter(c => c.id !== existing.id);
        collaborators.length = 0;
        collaborators.push(...updated);
      }
    }

    // Generate invitedAt & expiresAt (+7 days as required)
    const invitedAt = new Date();
    const expiresAt = new Date(invitedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    const newCollaborator: ProjectCollaborator = {
      id: crypto.randomUUID(),
      projectId,
      userEmail: email.toLowerCase(),
      permission: permission as 'LEITOR' | 'EDITOR' | 'ADMINISTRADOR',
      status: 'PENDENTE',
      invitedAt: invitedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    collaborators.push(newCollaborator);
    writeCollaborators(collaborators);

    // Simulated email dispatch log
    console.log(`[EMAIL SIMULATION] Convite enviado para ${email}. Link: http://localhost:3000/projects/accept?inviteId=${newCollaborator.id}`);

    return NextResponse.json(
      { 
        message: 'Convite enviado com sucesso.', 
        collaborator: newCollaborator 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Invite collaborator error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
