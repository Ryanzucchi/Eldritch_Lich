"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
function createAuditLog(type, description) {
    return {
        id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type,
        description,
        timestamp: new Date().toISOString()
    };
}
