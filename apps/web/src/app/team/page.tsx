'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { 
  ProjectMember, 
  ProjectRole, 
  SharedDocumentLink, 
  ProjectInviteLink, 
  CollaborationAuditLog, 
  generateShareToken, 
  validateRoleChange 
} from '@eldritch/domain';

export default function TeamPage() {
  const { activeProject } = useApp();
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'documents' | 'logs'>('members');

  // Members State (UC-083)
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>('EDITOR');

  // Invites State (UC-135)
  const [invites, setInvites] = useState<ProjectInviteLink[]>([]);

  // Shared Documents State (UC-082)
  const [sharedDocs, setSharedDocs] = useState<SharedDocumentLink[]>([]);
  const [manuscriptList, setManuscriptList] = useState<{ id: string; title: string }[]>([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  // Audit Logs State (UC-136)
  const [auditLogs, setAuditLogs] = useState<CollaborationAuditLog[]>([]);

  const [success, setSuccess] = useState<string | null>(null);

  // Load All Team Data
  const loadTeamData = async () => {
    if (!activeProject) return;

    // Load Manuscripts for Doc Sharing
    const mList = await db.manuscripts.toArray();
    setManuscriptList(mList.map(m => ({ id: m.id, title: m.title })));

    // Load Members (UC-083)
    let mMembers = await db.projectMembers.where('projectId').equals(activeProject.id).toArray();
    if (mMembers.length === 0) {
      // Seed initial Owner member
      const ownerMember: ProjectMember = {
        id: `pm_${Date.now()}`,
        projectId: activeProject.id,
        userEmail: 'autor@eldritch.com',
        userName: 'Autor Principal',
        role: 'OWNER',
        joinedAt: new Date().toISOString()
      };
      await db.projectMembers.put(ownerMember);
      mMembers = [ownerMember];
    }
    setMembers(mMembers);

    // Load Invites (UC-135)
    const mInvites = await db.projectInviteLinks.where('projectId').equals(activeProject.id).toArray();
    setInvites(mInvites);

    // Load Shared Docs (UC-082)
    const mDocs = await db.sharedDocLinks.toArray();
    setSharedDocs(mDocs);

    // Load Audit Logs (UC-136)
    const mLogs = await db.collaborationAuditLogs.where('projectId').equals(activeProject.id).toArray();
    mLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAuditLogs(mLogs);
  };

  useEffect(() => {
    loadTeamData();
  }, [activeProject]);

  // Log Audit Action Helper (UC-136)
  const logAudit = async (action: string, resourceId: string, details?: string) => {
    if (!activeProject) return;
    const log: CollaborationAuditLog = {
      id: `cal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      projectId: activeProject.id,
      userId: 'user_current',
      userEmail: 'autor@eldritch.com',
      action,
      resourceId,
      timestamp: new Date().toISOString(),
      details
    };
    await db.collaborationAuditLogs.put(log);
  };

  // Add Direct Member (UC-083)
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !activeProject) return;

    const newMember: ProjectMember = {
      id: `pm_${Date.now()}`,
      projectId: activeProject.id,
      userEmail: newMemberEmail.trim(),
      userName: newMemberName.trim() || newMemberEmail.split('@')[0],
      role: newMemberRole,
      joinedAt: new Date().toISOString()
    };

    await db.projectMembers.put(newMember);
    await logAudit('MEMBER_ADDED', newMember.id, `Adicionado ${newMember.userEmail} como ${newMember.role}`);
    setNewMemberEmail('');
    setNewMemberName('');
    await loadTeamData();
    setSuccess(`Membro "${newMember.userName}" adicionado com a função ${newMember.role}!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Change Role (UC-083)
  const handleChangeRole = async (memberId: string, newRole: ProjectRole) => {
    const check = validateRoleChange(members, memberId, newRole);
    if (!check.allowed) {
      alert(check.reason);
      return;
    }

    await db.projectMembers.update(memberId, { role: newRole });
    await logAudit('MEMBER_ROLE_CHANGED', memberId, `Alterado papel para ${newRole}`);
    await loadTeamData();
    setSuccess('Permissão do colaborador atualizada!');
    setTimeout(() => setSuccess(null), 2500);
  };

  // Generate Invite Link (UC-135)
  const handleGenerateInvite = async () => {
    if (!activeProject) return;
    const token = generateShareToken();
    const newInvite: ProjectInviteLink = {
      id: `pil_${Date.now()}`,
      projectId: activeProject.id,
      token,
      role: 'EDITOR',
      isRevoked: false,
      createdAt: new Date().toISOString()
    };

    await db.projectInviteLinks.put(newInvite);
    await logAudit('INVITE_LINK_GENERATED', newInvite.id, `Gerado token ${token.substring(0, 8)}...`);
    await loadTeamData();
    setSuccess('Link de convite gerado com sucesso (UC-135)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Revoke Invite Link (UC-135)
  const handleRevokeInvite = async (inviteId: string) => {
    await db.projectInviteLinks.update(inviteId, { isRevoked: true });
    await logAudit('INVITE_LINK_REVOKED', inviteId, 'Link de convite revogado');
    await loadTeamData();
  };

  // Remove Member (UC-207)
  const handleRemoveMember = async (memberId: string, name: string) => {
    const targetMember = members.find(m => m.id === memberId);
    if (targetMember?.role === 'OWNER') {
      const ownersCount = members.filter(m => m.role === 'OWNER').length;
      if (ownersCount <= 1) {
        alert('Não é possível remover o único Dono (Owner) do projeto.');
        return;
      }
    }

    if (!confirm(`Deseja remover o colaborador "${name}" do projeto?`)) return;

    await db.projectMembers.delete(memberId);
    await logAudit('MEMBER_REMOVED', memberId, `Removido colaborador ${name}`);
    await loadTeamData();
    setSuccess(`Colaborador "${name}" removido do projeto (UC-207)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Transfer Ownership (UC-206)
  const handleTransferOwnership = async (targetMemberId: string, name: string) => {
    const currentOwner = members.find(m => m.role === 'OWNER');
    if (!currentOwner) return;

    if (!confirm(`ATENÇÃO: Deseja transferir a propriedade DEFINITIVA do projeto para "${name}"? Você se tornará Administrador.`)) {
      return;
    }

    await db.transaction('rw', db.projectMembers, db.collaborationAuditLogs, async () => {
      // Rebaixar o dono antigo para ADMIN
      await db.projectMembers.update(currentOwner.id, { role: 'ADMIN' });
      // Promover o novo membro para OWNER
      await db.projectMembers.update(targetMemberId, { role: 'OWNER' });
    });

    await logAudit('OWNERSHIP_TRANSFERRED', targetMemberId, `Propriedade transferida para ${name} (UC-206)`);
    await loadTeamData();
    setSuccess(`Propriedade do projeto transferida com sucesso para "${name}" (UC-206)!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  // Leave Project (UC-208)
  const handleLeaveProject = async () => {
    const currentMember = members[0]; // simulação do membro logado
    if (currentMember?.role === 'OWNER') {
      const ownersCount = members.filter(m => m.role === 'OWNER').length;
      if (ownersCount <= 1) {
        alert('Você é o único Dono. Transfira a propriedade antes de sair do projeto.');
        return;
      }
    }

    if (!confirm('Deseja realmente sair deste projeto colaborativo (UC-208)?')) return;

    await db.projectMembers.delete(currentMember.id);
    await logAudit('MEMBER_LEFT', currentMember.id, 'Usuário saiu do projeto (UC-208)');
    await loadTeamData();
    setSuccess('Você saiu do projeto colaborativo (UC-208).');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Share Document via Hash Link (UC-082)
  const handleShareDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) return;

    const token = generateShareToken();
    const docLink: SharedDocumentLink = {
      id: `sdl_${Date.now()}`,
      manuscriptId: selectedDocId,
      token,
      isPublic: true,
      createdAt: new Date().toISOString()
    };

    await db.sharedDocLinks.put(docLink);
    await logAudit('DOCUMENT_SHARED', selectedDocId, `Gerado link seguro de leitura (UC-082)`);
    setSelectedDocId('');
    await loadTeamData();
    setSuccess(`Link seguro de leitura gerado para o documento (UC-082)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="team-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👥 Colaboração de Equipe & Permissões (UC-082, UC-083, UC-135, UC-136)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Gerencie membros da equipe, controle permissões, crie links de acesso rápido e consulte o log de auditoria.
          </p>
        </div>

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem', borderRadius: '8px' }}>
          <button onClick={() => setActiveTab('members')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'members' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>👥 Membros (UC-083)</button>
          <button onClick={() => setActiveTab('invites')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'invites' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>🔗 Convites (UC-135)</button>
          <button onClick={() => setActiveTab('documents')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'documents' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>📄 Compartilhar (UC-082)</button>
          <button onClick={() => setActiveTab('logs')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: activeTab === 'logs' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>📜 Auditoria (UC-136)</button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Tab 1: Members & Role Management (UC-083) */}
      {activeTab === 'members' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Add Member Form */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>➕ Adicionar Colaborador ao Projeto</h3>
            <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>E-mail do Usuário:</label>
                <input 
                  type="email"
                  required
                  placeholder="colaborador@eldritch.com"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5.rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome de Exibição:</label>
                <input 
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Perfil / Função:</label>
                <select 
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value as ProjectRole)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="EDITOR">✏️ Editor</option>
                  <option value="VIEWER">👁️ Leitor</option>
                  <option value="ADMIN">🛡️ Administrador</option>
                  <option value="OWNER">👑 Dono (Owner)</option>
                </select>
              </div>

              <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Adicionar Membro
              </button>
            </form>
          </div>

          {/* Members Table */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Membro</th>
                  <th style={{ padding: '0.8rem 1rem' }}>E-mail</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Data de Entrada</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Função / Permissão (UC-083)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{m.userName}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.7 }}>{m.userEmail}</td>
                    <td style={{ padding: '0.8rem 1rem', opacity: 0.5 }}>{new Date(m.joinedAt).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <select 
                        value={m.role}
                        onChange={e => handleChangeRole(m.id, e.target.value as ProjectRole)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                      >
                        <option value="OWNER">👑 Dono (Owner)</option>
                        <option value="ADMIN">🛡️ Administrador</option>
                        <option value="EDITOR">✏️ Editor</option>
                        <option value="VIEWER">👁️ Leitor</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {m.role !== 'OWNER' && (
                          <button 
                            onClick={() => handleTransferOwnership(m.id, m.userName)}
                            style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            👑 Transferir (UC-206)
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveMember(m.id, m.userName)}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.78rem' }}
                        >
                          🗑️ Remover (UC-207)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Invites by Hash Link (UC-135) */}
      {activeTab === 'invites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <h3 style={{ margin: '0 0 0.3rem 0' }}>🔗 Links de Convite de Acesso Rápido (UC-135)</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.88rem' }}>Gere links criptografados com permissão pré-definida para convidar colaboradores.</p>
            </div>
            <button onClick={handleGenerateInvite} style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
              ⚡ Gerar Novo Link de Convite
            </button>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>URL de Convite Criptografada</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Perfil atribuído</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {invites.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', color: '#60a5fa' }}>
                      https://eldritch.app/invite?token={inv.token}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>{inv.role}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {inv.isRevoked ? <span style={{ color: '#ef4444' }}>⛔ Revogado</span> : <span style={{ color: '#10b981' }}>✅ Ativo</span>}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {!inv.isRevoked && (
                        <button onClick={() => handleRevokeInvite(inv.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Revogar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {invites.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Nenhum link de convite gerado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Shared Document Links (UC-082) */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📄 Gerar Link Seguro de Leitura de Documento (UC-082)</h3>
            <form onSubmit={handleShareDocument} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
                required
                style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              >
                <option value="">Selecione um capítulo / manuscrito para compartilhar...</option>
                {manuscriptList.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
              <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Gerar Link Seguro
              </button>
            </form>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.8rem 1rem' }}>Manuscrito</th>
                  <th style={{ padding: '0.8rem 1rem' }}>URL de Leitura Segura (Hash Criptográfico)</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Modo</th>
                </tr>
              </thead>
              <tbody>
                {sharedDocs.map(sd => {
                  const doc = manuscriptList.find(m => m.id === sd.manuscriptId);
                  return (
                    <tr key={sd.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{doc?.title || 'Documento'}</td>
                      <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', color: '#93c5fd' }}>
                        https://eldritch.app/read/{sd.token}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#10b981' }}>👁️ Somente Leitura (Edição Bloqueada)</td>
                    </tr>
                  );
                })}
                {sharedDocs.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Nenhum documento compartilhado via link.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs (UC-136) */}
      {activeTab === 'logs' && (
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📜 Log de Auditoria Imutável (UC-136)</h3>
            <p style={{ margin: '0.3rem 0 0 0', opacity: 0.7, fontSize: '0.85rem' }}>Registro de quem realizou cada alteração de permissão, convite ou compartilhamento com timestamp seguro.</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Timestamp (UTC)</th>
                <th style={{ padding: '0.8rem 1rem' }}>Usuário</th>
                <th style={{ padding: '0.8rem 1rem' }}>Ação Executada</th>
                <th style={{ padding: '0.8rem 1rem' }}>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace', opacity: 0.6 }}>{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#60a5fa' }}>{log.userEmail}</td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>{log.action}</td>
                  <td style={{ padding: '0.8rem 1rem', opacity: 0.8 }}>{log.details || '-'}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Nenhum log de auditoria registrado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
