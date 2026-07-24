'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { CallSession, VoiceMessage, CallType, transcribeCallAudio } from '@eldritch/domain';

export default function CallsPage() {
  const { activeProject } = useApp();
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  // Audio/Video State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Voice Message State (UC-362)
  const [isRecordingVoiceMsg, setIsRecordingVoiceMsg] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Create Virtual Room Modal (UC-368)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [callType, setCallType] = useState<CallType>('VIDEO');

  const [success, setSuccess] = useState<string | null>(null);

  // Load Calls & Voice Messages
  const loadCallsAndVoice = async () => {
    if (!activeProject) return;
    const callList = await db.callSessions.where('projectId').equals(activeProject.id).toArray();
    setCalls(callList);

    const voiceList = await db.voiceMessages.toArray();
    setVoiceMessages(voiceList);
  };

  useEffect(() => {
    loadCallsAndVoice();
  }, [activeProject]);

  // Create Virtual Room / Call (UC-360, UC-363, UC-364, UC-368)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !activeProject) return;

    const newCall: CallSession = {
      id: `cs_${Date.now()}`,
      projectId: activeProject.id,
      roomName: roomName.trim(),
      type: callType,
      status: 'CONNECTED',
      hostEmail: 'autor@eldritch.com',
      participants: [
        {
          email: 'autor@eldritch.com',
          name: 'Autor Principal (Você)',
          isMuted: false,
          isVideoOff: callType === 'AUDIO',
          isScreenSharing: false
        },
        {
          email: 'coautor@eldritch.com',
          name: 'Coautor Conectado',
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false
        }
      ],
      isRecording: false,
      startedAt: new Date().toISOString()
    };

    await db.callSessions.put(newCall);
    setShowCreateRoomModal(false);
    setRoomName('');
    setActiveCall(newCall);
    await loadCallsAndVoice();
    setSuccess(`Sala virtual "${newCall.roomName}" criada e chamada estabelecida (UC-363, UC-364, UC-368)!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Toggle Mute / Video / Screen (UC-365, UC-369)
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    setSuccess(!isScreenSharing ? 'Transmissão de tela iniciada (UC-365)!' : 'Compartilhamento de tela finalizado.');
    setTimeout(() => setSuccess(null), 2500);
  };

  // Toggle Recording & Auto Transcription (UC-365, UC-367)
  const handleToggleRecording = async () => {
    if (!activeCall) return;
    const nextRec = !isRecording;
    setIsRecording(nextRec);

    let transcription = activeCall.transcriptionText;
    if (!nextRec) {
      // Automatic AI Transcription when recording stops
      transcription = transcribeCallAudio(activeCall.roomName, 12);
    }

    const updated: CallSession = {
      ...activeCall,
      isRecording: nextRec,
      transcriptionText: transcription
    };

    await db.callSessions.put(updated);
    setActiveCall(updated);
    await loadCallsAndVoice();
    setSuccess(nextRec ? 'Gravação da chamada iniciada (UC-365)!' : 'Gravação finalizada. Transcrição por IA gerada (UC-367)!');
    setTimeout(() => setSuccess(null), 3500);
  };

  // End Call
  const handleEndCall = async () => {
    if (!activeCall) return;
    const updated: CallSession = {
      ...activeCall,
      status: 'ENDED',
      endedAt: new Date().toISOString()
    };
    await db.callSessions.put(updated);
    setActiveCall(null);
    await loadCallsAndVoice();
    setSuccess('Chamada encerrada.');
    setTimeout(() => setSuccess(null), 2500);
  };

  // Send Voice Message (UC-362)
  const handleSendVoiceMessage = async () => {
    if (isRecordingVoiceMsg) {
      // Finish recording
      const newVoice: VoiceMessage = {
        id: `vm_${Date.now()}`,
        channelId: 'ch_general',
        senderEmail: 'autor@eldritch.com',
        senderName: 'Autor Principal',
        audioBlobUrl: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA',
        durationSeconds: 15,
        playbackSpeed: 1.0,
        createdAt: new Date().toISOString()
      };

      await db.voiceMessages.put(newVoice);
      setIsRecordingVoiceMsg(false);
      await loadCallsAndVoice();
      setSuccess('Mensagem de voz enviada com player e velocidade ajustável (UC-362)!');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setIsRecordingVoiceMsg(true);
    }
  };

  return (
    <div className="calls-page-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📹 Chamadas de Voz/Vídeo, Áudio & Transcrição por IA (UC-360 a UC-370)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Comunicação ao vivo via WebRTC, salas virtuais, mensagens de voz e transcrição automática por IA.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={handleSendVoiceMessage}
            style={{ background: isRecordingVoiceMsg ? '#ef4444' : '#10b981', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRecordingVoiceMsg ? '🔴 Parar e Enviar Voz (UC-362)' : '🎙️ Enviar Mensagem de Voz (UC-362)'}
          </button>

          <button 
            onClick={() => setShowCreateRoomModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Criar Sala Virtual (UC-368)
          </button>
        </div>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Call Viewport (UC-363, UC-364, UC-365) */}
        {activeCall ? (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📹 {activeCall.roomName} ({activeCall.type})</h2>
              {isRecording && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>● REC (UC-365)</span>}
            </div>

            {/* Video Streams Display */}
            <div style={{ flex: 1, background: '#000', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isScreenSharing ? (
                <div style={{ textAlign: 'center', color: '#60a5fa' }}>
                  <div style={{ fontSize: '3rem' }}>💻</div>
                  <p style={{ fontWeight: 600 }}>Compartilhando sua Tela ao Vivo (UC-365)...</p>
                </div>
              ) : isVideoOff ? (
                <div style={{ textAlign: 'center', opacity: 0.6 }}>
                  <div style={{ fontSize: '3rem' }}>🎙️</div>
                  <p>Chamada de Voz Ativa (Câmera desativada)</p>
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
                  <div style={{ background: '#1e293b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', fontWeight: 600 }}>
                    📹 Você (Autor)
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a7f3d0', fontWeight: 600 }}>
                    📹 Coautor Conectado
                  </div>
                </div>
              )}
            </div>

            {/* Call Toolbar (UC-365, UC-369) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.2rem' }}>
              <button onClick={handleToggleMute} style={{ background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                {isMuted ? '🔇 Desmutar' : '🎙️ Mutar (UC-369)'}
              </button>
              <button onClick={handleToggleVideo} style={{ background: isVideoOff ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                {isVideoOff ? '📹 Ligar Câmera' : '📷 Desligar Câmera'}
              </button>
              <button onClick={handleToggleScreenShare} style={{ background: isScreenSharing ? '#3b82f6' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                💻 {isScreenSharing ? 'Parar Tela' : 'Compartilhar Tela (UC-365)'}
              </button>
              <button onClick={handleToggleRecording} style={{ background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                ⏺️ {isRecording ? 'Parar Gravação' : 'Gravar Chamada (UC-365)'}
              </button>
              <button onClick={handleEndCall} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                📞 Desligar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
            Nenhuma chamada ativa no momento. Crie ou selecione uma sala virtual.
          </div>
        )}

        {/* Sidebar: Rooms, Transcriptions & Voice Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Virtual Rooms List (UC-368) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.05rem', color: '#94a3b8' }}>🏢 Salas Virtuais Ativas</h3>
            {calls.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCall(c)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  background: activeCall?.id === c.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid',
                  borderColor: activeCall?.id === c.id ? '#3b82f6' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ fontWeight: 600 }}>{c.roomName}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: '0.2rem' }}>{c.type} | 👥 {c.participants.length} integrantes</div>
              </button>
            ))}
          </div>

          {/* Voice Messages List (UC-362) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.05rem', color: '#10b981' }}>🎙️ Mensagens de Voz (UC-362)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {voiceMessages.map(vm => (
                <div key={vm.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.3rem' }}>{vm.senderName} (15s)</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button style={{ background: '#10b981', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>▶</button>
                    <div style={{ flex: 1, height: '4px', background: '#374151', borderRadius: '2px' }}>
                      <div style={{ width: '40%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                    </div>
                    <select 
                      value={playbackSpeed}
                      onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
                      style={{ background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      <option value={1.0}>1.0x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2.0}>2.0x</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automatic AI Transcription (UC-367) */}
          {activeCall?.transcriptionText && (
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.6rem 0', color: '#c084fc', fontSize: '1rem' }}>🤖 Transcrição Automática por IA (UC-367)</h3>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.78rem', fontFamily: 'monospace', color: '#e9d5ff', maxHeight: '180px', overflowY: 'auto' }}>
                {activeCall.transcriptionText}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal (UC-368) */}
      {showCreateRoomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🏢 Criar Sala Virtual de Reunião (UC-368)</h3>
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Sala:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Sala de Revisão do Capítulo 5"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo de Chamada:</label>
                <select 
                  value={callType}
                  onChange={e => setCallType(e.target.value as CallType)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="VIDEO">📹 Videochamada + Áudio (UC-364)</option>
                  <option value="AUDIO">🎙️ Chamada de Áudio (UC-363)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateRoomModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Entrar na Sala</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
