'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { ChatChannel, ChatMessage, filterChatMessages } from '@eldritch/domain';

export default function ChatPage() {
  const { activeProject } = useApp();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Search & New Message State
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  // Create Channel Modal (UC-215)
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Channels
  const loadChannels = async () => {
    if (!activeProject) return;
    let list = await db.chatChannels.where('projectId').equals(activeProject.id).toArray();
    if (list.length === 0) {
      // Seed default general channel
      const defaultChannel: ChatChannel = {
        id: `cc_general_${Date.now()}`,
        projectId: activeProject.id,
        name: 'Geral',
        description: 'Canal de discussões gerais da equipe',
        isArchived: false,
        createdAt: new Date().toISOString()
      };
      await db.chatChannels.put(defaultChannel);
      list = [defaultChannel];
    }
    setChannels(list);
    if (!activeChannel) {
      setActiveChannel(list[0]);
    }
  };

  // Load Messages for Active Channel
  const loadMessages = async () => {
    if (!activeChannel) {
      setMessages([]);
      return;
    }
    const list = await db.chatMessages.where('channelId').equals(activeChannel.id).toArray();
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMessages(list);
  };

  useEffect(() => {
    loadChannels();
  }, [activeProject]);

  useEffect(() => {
    loadMessages();
  }, [activeChannel]);

  // Create Channel (UC-215)
  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !activeProject) return;

    const newChannel: ChatChannel = {
      id: `cc_${Date.now()}`,
      projectId: activeProject.id,
      name: newChannelName.trim(),
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    await db.chatChannels.put(newChannel);
    setNewChannelName('');
    setShowCreateChannelModal(false);
    setActiveChannel(newChannel);
    await loadChannels();
    setSuccess(`Canal #${newChannel.name} criado com sucesso (UC-215)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Send Message (UC-214)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChannel) return;

    const msg: ChatMessage = {
      id: `cm_${Date.now()}`,
      channelId: activeChannel.id,
      senderEmail: 'autor@eldritch.com',
      senderName: 'Autor Principal',
      content: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    await db.chatMessages.put(msg);
    setMessageText('');
    await loadMessages();
  };

  // Archive Channel (UC-216)
  const handleToggleArchiveChannel = async () => {
    if (!activeChannel) return;
    const nextArchived = !activeChannel.isArchived;
    await db.chatChannels.update(activeChannel.id, { isArchived: nextArchived });
    await loadChannels();
    setSuccess(nextArchived ? `Canal #${activeChannel.name} arquivado (UC-216).` : `Canal #${activeChannel.name} desarquivado.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const filteredMessages = filterChatMessages(messages, searchQuery);

  return (
    <div className="chat-page-container" style={{ padding: '2rem', color: '#f3f4f6', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💬 Chat Interno de Equipe & Canais (UC-214, UC-215, UC-216)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Comunique-se em tempo real com coautores e editores divididos por assuntos ou capítulos.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateChannelModal(true)}
          style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Novo Canal (UC-215)
        </button>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {/* Chat Interface Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', minHeight: 0 }}>
        {/* Sidebar Channels List (UC-215) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.05rem', color: '#94a3b8' }}># Canais de Discussão</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch)}
                style={{
                  textAlign: 'left',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  background: activeChannel?.id === ch.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeChannel?.id === ch.id ? '#3b82f6' : 'transparent',
                  color: activeChannel?.id === ch.id ? '#60a5fa' : '#9ca3af',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span># {ch.name}</span>
                {ch.isArchived && <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>📁 Arquivado</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Main View (UC-214) */}
        {activeChannel ? (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Channel Topbar */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}># {activeChannel.name}</h3>
                {activeChannel.description && <p style={{ margin: '0.2rem 0 0 0', opacity: 0.6, fontSize: '0.82rem' }}>{activeChannel.description}</p>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="🔎 Buscar no chat..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
                />
                <button 
                  onClick={handleToggleArchiveChannel}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {activeChannel.isArchived ? '📂 Desarquivar (UC-216)' : '📁 Arquivar Canal (UC-216)'}
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                    <strong style={{ color: '#93c5fd' }}>{msg.senderName} ({msg.senderEmail})</strong>
                    <span style={{ opacity: 0.5 }}>{new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ fontSize: '0.92rem', lineHeight: '1.4' }}>{msg.content}</div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.4, margin: 'auto' }}>
                  Nenhuma mensagem enviada neste canal ainda. Digite algo abaixo!
                </div>
              )}
            </div>

            {/* Send Input Bar (UC-214) */}
            <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.8rem' }}>
              <input 
                type="text"
                disabled={activeChannel.isArchived}
                placeholder={activeChannel.isArchived ? 'Este canal está arquivado para novas mensagens.' : 'Digite sua mensagem de equipe... (Enter para enviar)'}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
              <button 
                type="submit" 
                disabled={activeChannel.isArchived || !messageText.trim()}
                style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                Enviar (UC-214)
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            Selecione ou crie um canal de chat.
          </div>
        )}
      </div>

      {/* Modal Create Channel (UC-215) */}
      {showCreateChannelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>💬 Criar Canal de Chat por Assunto (UC-215)</h3>
            <form onSubmit={handleCreateChannel}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome do Canal:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: worldbuilding, revisao-cap1"
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateChannelModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Criar Canal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
