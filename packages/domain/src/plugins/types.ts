export type PluginHook = 'beforeSave' | 'afterLoad' | 'onEditorCommand';

export interface EditorPluginManifest {
  id: string;
  name: string;
  version: string;
  hooks: PluginHook[];
}

export interface PluginInvocation { hook: PluginHook; payload: unknown; }
export interface PluginResult { ok: boolean; payload?: unknown; error?: string; }
