'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../db/schema';
import { NotificationSettings, EmailFrequency } from '@eldritch/domain';

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>('default');
  const [success, setSuccess] = useState<string | null>(null);

  // Load Preferences
  const loadSettings = async () => {
    let current = await db.notificationSettings.where('userId').equals('user_current').first();
    if (!current) {
      current = {
        id: `ns_${Date.now()}`,
        userId: 'user_current',
        emailFrequency: 'DAILY',
        enableEmailNotifications: true,
        enablePushNotifications: false,
        notifyOnMentions: true,
        notifyOnComments: true,
        notifyOnChatMessages: true,
        updatedAt: new Date().toISOString()
      };
      await db.notificationSettings.put(current);
    }
    setSettings(current);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    const updated: NotificationSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };

    await db.notificationSettings.put(updated);
    setSuccess('Preferências de notificação salvas com sucesso (UC-220, UC-230)!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Request Push Permission (UC-221)
  const handleRequestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Este navegador não suporta a Web Push API de Notificações.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPushPermissionStatus(perm);

      if (perm === 'granted') {
        if (settings) {
          const updated = { ...settings, enablePushNotifications: true };
          await db.notificationSettings.put(updated);
          setSettings(updated);
        }
        setSuccess('Notificações Push no navegador ativadas com sucesso (UC-221)!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        alert('Permissão de notificações de sistema negada pelo usuário.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!settings) return <div style={{ padding: '2rem', color: 'white' }}>Carregando configurações...</div>;

  return (
    <div className="notifications-settings-container" style={{ padding: '2rem', color: '#f3f4f6', maxWidth: '720px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔔 Configurações de Notificações (UC-219, UC-220, UC-221, UC-229, UC-230)
        </h1>
        <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
          Defina como e quando você deseja receber relatórios por e-mail, menções e alertas push.
        </p>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Email Notifications Toggle (UC-230) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>📧 Notificações por E-mail (UC-230)</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', marginBottom: '1rem' }}>
            <input 
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={e => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 600 }}>Ativar notificações e resumos por e-mail (UC-230)</span>
          </label>

          {/* Email Frequency Selector (UC-220) */}
          <div style={{ opacity: settings.enableEmailNotifications ? 1 : 0.4, pointerEvents: settings.enableEmailNotifications ? 'auto' : 'none' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', marginBottom: '0.4rem' }}>Frequência de E-mails de Resumo (UC-220):</label>
            <select 
              value={settings.emailFrequency}
              onChange={e => setSettings({ ...settings, emailFrequency: e.target.value as EmailFrequency })}
              style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            >
              <option value="IMMEDIATE">⚡ Imediato (A cada menção ou comentário)</option>
              <option value="DAILY">📅 Resumo Diário (Único e-mail diário agrupado)</option>
              <option value="WEEKLY">📆 Resumo Semanal (Consolidado por semana)</option>
              <option value="OFF">⛔ Desativado (Sem resumos por e-mail)</option>
            </select>
          </div>
        </div>

        {/* Browser Push Notifications (UC-221) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>📱 Notificações Push do Sistema (UC-221)</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Status do Navegador:</p>
              <span style={{ fontSize: '0.85rem', color: pushPermissionStatus === 'granted' ? '#10b981' : '#f59e0b' }}>
                {pushPermissionStatus === 'granted' ? '✅ Notificações Push Permitidas' : '⚠️ Permissão Pendente ou Não Configurada'}
              </span>
            </div>

            <button 
              type="button"
              onClick={handleRequestPushPermission}
              style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              {pushPermissionStatus === 'granted' ? 'Reconfigurar Push' : 'Ativar Push no Navegador (UC-221)'}
            </button>
          </div>
        </div>

        {/* Triggers preferences (UC-219, UC-229) */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>🎯 Eventos e Alertas</h3>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={settings.notifyOnMentions}
              onChange={e => setSettings({ ...settings, notifyOnMentions: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <span>Notificar ao ser mencionado em comentários (@autor) (UC-229)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={settings.notifyOnChatMessages}
              onChange={e => setSettings({ ...settings, notifyOnChatMessages: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <span>Notificar sobre novas mensagens nos canais de chat da equipe (UC-219)</span>
          </label>
        </div>

        <button 
          type="submit"
          style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
        >
          💾 Salvar Configurações de Notificação
        </button>
      </form>
    </div>
  );
}
