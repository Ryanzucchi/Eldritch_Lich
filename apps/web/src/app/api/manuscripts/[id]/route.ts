import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readManuscripts, writeManuscripts, verifyToken } from '../../../../services/auth-backend';

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
    const updated = manuscripts.filter(m => m.id !== id);

    if (manuscripts.length === updated.length) {
      return NextResponse.json({ message: 'Manuscrito não encontrado.' }, { status: 404 });
    }

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
