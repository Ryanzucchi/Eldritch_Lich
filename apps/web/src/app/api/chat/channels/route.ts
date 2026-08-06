import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readChatChannels, readCollaborators, readProjects, verifyToken, writeChatChannels } from '../../../../services/auth-backend';

function canAccess(projectId: string, payload: any) {
  const project = readProjects().find(item => item.id === projectId);
  if (!project) return { project: null, admin: false, access: false };
  const collaborator = readCollaborators().find(item => item.projectId === projectId && item.userEmail.toLowerCase() === payload.email?.toLowerCase() && item.status === 'ACEITO');
  return { project, access: project.ownerId === payload.id || Boolean(collaborator), admin: project.ownerId === payload.id || collaborator?.permission === 'ADMINISTRADOR' };
}
export async function GET(request: NextRequest) {
  const payload = verifyToken(cookies().get('token')?.value || '');
  const projectId = new URL(request.url).searchParams.get('projectId');
  if (!payload?.id || !projectId) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  const access = canAccess(projectId, payload);
  if (!access.access) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  return NextResponse.json({ channels: readChatChannels().filter(item => item.projectId === projectId), isAdmin: access.admin });
}
export async function POST(request: NextRequest) {
  const payload = verifyToken(cookies().get('token')?.value || ''); const { channel } = await request.json();
  if (!payload?.id || !channel?.projectId || !channel?.name) return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
  const access = canAccess(channel.projectId, payload);
  if (!access.admin) return NextResponse.json({ message: 'Apenas administradores criam canais.' }, { status: 403 });
  const item = { id: crypto.randomUUID(), projectId: channel.projectId, name: String(channel.name).slice(0, 80), description: channel.description?.slice(0, 240), type: (channel.type === 'announcement' ? 'announcement' : 'chat') as 'announcement' | 'chat', isArchived: false, createdAt: new Date().toISOString() };
  const channels = readChatChannels(); channels.push(item); writeChatChannels(channels); return NextResponse.json({ channel: item }, { status: 201 });
}
