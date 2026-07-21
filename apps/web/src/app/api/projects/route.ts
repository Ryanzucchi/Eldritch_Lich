import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  readProjects, 
  writeProjects, 
  verifyToken, 
  readCollaborators, 
  readUsers 
} from '../../../services/auth-backend';
import { Project } from '@eldritch/domain';

// Fetch user's projects (owned and shared collaborations)
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

    const projects = readProjects();
    const collaborators = readCollaborators();

    // 1. Projects owned by the user
    const userProjects = projects.filter(p => p.ownerId === payload.id);

    // 2. Shared projects where the user accepted the collaboration invite
    const acceptedShares = collaborators.filter(c => 
      c.userEmail.toLowerCase() === payload.email.toLowerCase() && 
      c.status === 'ACEITO'
    );
    const sharedProjectIds = acceptedShares.map(c => c.projectId);
    const sharedProjects = projects.filter(p => sharedProjectIds.includes(p.id));

    // Merge owned and shared projects
    const allProjects = [...userProjects, ...sharedProjects];

    // 3. Pending invitations that haven't expired (+7 days check)
    const now = Date.now();
    const pendingShares = collaborators.filter(c => 
      c.userEmail.toLowerCase() === payload.email.toLowerCase() && 
      c.status === 'PENDENTE' &&
      new Date(c.expiresAt).getTime() > now
    );

    const users = readUsers();
    const pendingInvites = pendingShares.map(share => {
      const proj = projects.find(p => p.id === share.projectId);
      const owner = users.find(u => u.id === proj?.ownerId);
      return {
        inviteId: share.id,
        projectId: share.projectId,
        projectName: proj ? proj.name : 'Projeto Desconhecido',
        projectGenre: proj ? proj.genre : 'Desconhecido',
        permission: share.permission,
        invitedBy: owner ? owner.name : 'Dono do Projeto',
        invitedAt: share.invitedAt,
        expiresAt: share.expiresAt
      };
    });

    return NextResponse.json({
      projects: allProjects,
      pendingInvites
    });
  } catch (err) {
    console.error('Fetch projects error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

// Create new project
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

    const { name, genre, visibility } = await req.json();

    if (!name || !genre) {
      return NextResponse.json(
        { message: 'O nome e o gênero do projeto são obrigatórios.' },
        { status: 400 }
      );
    }

    const projects = readProjects();

    // Check project limits if free plan (simulated: limit to 3 projects)
    const userProjectsCount = projects.filter(p => p.ownerId === payload.id).length;
    if (userProjectsCount >= 3) {
      return NextResponse.json(
        { 
          message: 'Limite de plano gratuito atingido. Você pode ter no máximo 3 projetos simultâneos. Faça upgrade para o plano Premium para criar projetos ilimitados!' 
        },
        { status: 403 }
      );
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      genre,
      visibility: visibility || 'PRIVADO',
      ownerId: payload.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    writeProjects(projects);

    return NextResponse.json(
      {
        message: 'Projeto criado com sucesso.',
        project: newProject
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create project error:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
