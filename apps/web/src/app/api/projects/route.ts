import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readProjects, writeProjects, verifyToken } from '../../../services/auth-backend';
import { Project } from '@eldritch/domain';

// Fetch user's projects
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
    const userProjects = projects.filter(p => p.ownerId === payload.id);

    return NextResponse.json({
      projects: userProjects
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
