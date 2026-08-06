import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appendConsentAudit, exportAccountData, verifyToken } from '../../../../services/auth-backend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = cookies().get('token')?.value;
  const payload = token && verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  appendConsentAudit('DATA_EXPORT_REQUESTED', payload.id, '127.0.0.1');
  return NextResponse.json(exportAccountData(payload.id), { headers: { 'Content-Disposition': 'attachment; filename="eldritch-lich-dados.json"' } });
}
