import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readChatChannels, readChatMessages, readCollaborators, readProjects, verifyToken, writeChatMessages } from '../../../../services/auth-backend';

export async function POST(request: NextRequest) {
  const payload = verifyToken(cookies().get('token')?.value || ''); const { channelId, content, systemEvent } = await request.json();
  const channel = readChatChannels().find(item => item.id === channelId); if (!payload?.id || !channel || typeof content !== 'string' || !content.trim()) return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  const project = readProjects().find(item => item.id === channel.projectId); const collaborator = readCollaborators().find(item => item.projectId === channel.projectId && item.userEmail.toLowerCase() === payload.email?.toLowerCase() && item.status === 'ACEITO');
  const admin = project?.ownerId === payload.id || collaborator?.permission === 'ADMINISTRADOR';
  if ((!project || (project.ownerId !== payload.id && !collaborator)) || (channel.type === 'announcement' && !admin)) return NextResponse.json({ message: 'Apenas administradores podem publicar neste canal de anúncio.' }, { status: 403 });
  const message = { id: crypto.randomUUID(), channelId, senderEmail: systemEvent ? 'sistema@eldritch.local' : payload.email, senderName: systemEvent ? 'Sistema' : payload.name, content: content.trim().slice(0, 8000), createdAt: new Date().toISOString() };
  const messages = readChatMessages(); messages.push(message); writeChatMessages(messages); return NextResponse.json({ message }, { status: 201 });
}
