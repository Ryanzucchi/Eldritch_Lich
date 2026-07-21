import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readManuscripts, writeManuscripts, verifyToken, sanitizeInput } from '../../../services/auth-backend';
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

    // Sanitization of title and content to prevent XSS
    const sanitizedTitle = sanitizeInput(manuscript.title);
    const sanitizedContent = sanitizeInput(manuscript.content);

    const manuscripts = readManuscripts();
    const index = manuscripts.findIndex(m => m.id === manuscript.id);

    const updatedManuscript: Manuscript = {
      id: manuscript.id,
      title: sanitizedTitle,
      content: sanitizedContent,
      status: manuscript.status || 'RASCUNHO',
      isLocked: !!manuscript.isLocked,
      projectId: manuscript.projectId,
      createdAt: manuscript.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
