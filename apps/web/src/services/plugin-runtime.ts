'use client';

import type { EditorPluginManifest, PluginInvocation, PluginResult } from '@eldritch/domain';

/** Executa plugins remotos em Worker isolado: não há acesso ao DOM, cookies ou IndexedDB do app. */
export async function invokeRemotePlugin(manifest: EditorPluginManifest, moduleUrl: string, invocation: PluginInvocation): Promise<PluginResult> {
  if (!manifest.hooks.includes(invocation.hook)) return { ok: true, payload: invocation.payload };
  if (typeof Worker === 'undefined') return { ok: false, error: 'Plugins remotos exigem ambiente de navegador.' };
  const workerSource = `self.onmessage = async ({ data }) => { try { const plugin = await import(data.moduleUrl); const fn = plugin[data.hook]; if (typeof fn !== 'function') throw new Error('Hook não exportado'); const payload = await fn(data.payload); self.postMessage({ ok: true, payload }); } catch (error) { self.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error) }); } };`;
  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })); const worker = new Worker(workerUrl, { type: 'module', name: `eldritch-plugin-${manifest.id}` });
  try {
    return await new Promise<PluginResult>((resolve) => { const timeout = window.setTimeout(() => { worker.terminate(); resolve({ ok: false, error: 'Plugin excedeu 5 segundos.' }); }, 5000); worker.onmessage = event => { window.clearTimeout(timeout); resolve(event.data as PluginResult); }; worker.onerror = () => { window.clearTimeout(timeout); resolve({ ok: false, error: 'Falha ao executar plugin.' }); }; worker.postMessage({ moduleUrl, hook: invocation.hook, payload: invocation.payload }); });
  } finally { worker.terminate(); URL.revokeObjectURL(workerUrl); }
}
