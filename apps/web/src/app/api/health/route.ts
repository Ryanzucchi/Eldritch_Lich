import { NextResponse } from 'next/server';

/** Sonda leve para orquestradores e verificações de disponibilidade. */
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'eldritch-lich-web', timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
