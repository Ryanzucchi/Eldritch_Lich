export interface SystemActivity {
    id: string;
    type: 'autosave' | 'autotitle' | 'autobackup' | 'mms_sync' | 'pin_toggle' | 'split_chapter';
    description: string;
    timestamp: string;
}
export declare function createAuditLog(type: SystemActivity['type'], description: string): SystemActivity;
