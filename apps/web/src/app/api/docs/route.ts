import { NextResponse } from 'next/server';

const jsonResponse = { '200': { description: 'Resposta bem-sucedida', content: { 'application/json': { schema: { type: 'object' } } } }, '401': { description: 'Sessão ausente ou inválida' } };
const secured = (summary: string) => ({ summary, security: [{ sessionCookie: [] }], responses: jsonResponse });

/** Especificação OpenAPI servida junto da API, sem etapa manual de publicação. */
export async function GET() {
  return NextResponse.json({
    openapi: '3.0.3',
    info: { title: 'Eldritch Lich API', version: '1.0.0', description: 'API local-first de autenticação, projetos, manuscritos e colaboração.' },
    servers: [{ url: '/api', description: 'Alias da versão estável atual' }, { url: '/api/v1', description: 'Namespace versionado v1' }],
    components: { securitySchemes: { sessionCookie: { type: 'apiKey', in: 'cookie', name: 'accessToken' } } },
    paths: {
      '/auth/register': { post: { summary: 'Criar conta', responses: jsonResponse } }, '/auth/login': { post: { summary: 'Autenticar e iniciar sessão', responses: jsonResponse } }, '/auth/logout': { post: secured('Encerrar sessão') },
      '/auth/session': { get: secured('Consultar sessão atual') }, '/auth/profile': { get: secured('Ler perfil') }, '/auth/update-profile': { post: secured('Atualizar perfil') }, '/auth/change-password': { post: secured('Alterar senha') },
      '/auth/forgot-password': { post: { summary: 'Solicitar redefinição de senha', responses: jsonResponse } }, '/auth/reset-password': { post: { summary: 'Redefinir senha', responses: jsonResponse } },
      '/auth/2fa/setup': { post: secured('Preparar 2FA') }, '/auth/2fa/verify': { post: secured('Confirmar 2FA') }, '/auth/2fa/disable': { post: secured('Desativar 2FA') }, '/auth/sessions': { get: secured('Listar sessões') }, '/auth/sessions/{id}': { delete: secured('Revogar sessão') }, '/auth/export': { get: secured('Exportar dados') }, '/auth/account': { delete: secured('Excluir conta') },
      '/projects': { get: secured('Listar projetos'), post: secured('Criar projeto') }, '/projects/share': { get: secured('Listar colaboradores'), post: secured('Convidar colaborador') }, '/projects/share/accept': { post: secured('Aceitar convite') }, '/projects/share/reject': { post: secured('Recusar convite') }, '/projects/share/remove': { post: secured('Remover colaborador') },
      '/manuscripts': { get: secured('Listar manuscritos'), post: secured('Criar manuscrito') }, '/manuscripts/{id}': { delete: secured('Excluir manuscrito') }, '/folders': { get: secured('Listar pastas'), post: secured('Criar pasta') }, '/folders/{id}': { delete: secured('Excluir pasta') },
      '/chat/channels': { get: secured('Listar canais de colaboração'), post: secured('Criar canal') }, '/chat/messages': { post: secured('Publicar mensagem no chat') }
    }
  });
}
