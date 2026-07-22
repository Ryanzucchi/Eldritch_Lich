export interface SystemActivity {
  id: string;
  type: 'autosave' | 'autotitle' | 'autobackup' | 'mms_sync' | 'pin_toggle' | 'split_chapter';
  description: string;
  timestamp: string;
}

export function createAuditLog(
  type: SystemActivity['type'],
  description: string
): SystemActivity {
  return {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type,
    description,
    timestamp: new Date().toISOString()
  };
}
