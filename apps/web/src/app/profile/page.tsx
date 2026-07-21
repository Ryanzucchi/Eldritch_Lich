'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ProfileTab = 'general' | 'security';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ProfileTab>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // General profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('America/Recife');
  const [avatar, setAvatar] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Current session user for header
  const [sessionUser, setSessionUser] = useState<{ name: string; email: string } | null>(null);

  // Fetch current user details
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/profile');
        if (!res.ok) {
          router.push('/auth');
          return;
        }
        const data = await res.json();
        if (data.user) {
          setName(data.user.name);
          setEmail(data.user.email);
          setBio(data.user.bio || '');
          setTimezone(data.user.timezone || 'America/Recife');
          setAvatar(data.user.avatar || '');
          setSessionUser({ name: data.user.name, email: data.user.email });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }
    loadProfile();
  }, [router]);

  // Handle avatar upload and client-side WebP compression
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A foto de perfil deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for image resizing & compression to WebP
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions (128x128 for avatar is standard)
        canvas.width = 128;
        canvas.height = 128;

        // Draw image cropped to square
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);

        // Convert to WebP base64 format with quality 0.8
        const webpBase64 = canvas.toDataURL('image/webp', 0.8);
        setAvatar(webpBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, bio, timezone, avatar })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao atualizar perfil.');
      }

      setSuccess('Perfil atualizado com sucesso!');
      if (data.user) {
        setSessionUser({ name: data.user.name, email: data.user.email });
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao alterar a senha.');
      }

      setSuccess('Senha alterada com sucesso!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
    router.refresh();
  };

  return (
    <div className="layout-container animate-fade-in">
      {/* Top Navbar */}
      <header className="navbar glass">
        <h1 className="logo">Eldritch<span>Lich</span></h1>
        <nav className="nav-links">
          <Link href="/gmn" className="nav-item">Grafo de Metas</Link>
          <Link href="/kanban" className="nav-item">Quadro Kanban</Link>
        </nav>
        <div className="user-menu">
          {sessionUser && <span className="user-name">Olá, {sessionUser.name}</span>}
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="profile-area">
        <div className="profile-card glass">
          <div className="profile-header-section">
            <div className="avatar-container">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {name ? name.substring(0, 2).toUpperCase() : 'U'}
                </div>
              )}
              <button 
                type="button" 
                className="change-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Alterar Foto
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="profile-meta-title">
              <h2>{name || 'Nome do Usuário'}</h2>
              <p>{email || 'seu-email@provedor.com'}</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button 
              type="button" 
              className={activeTab === 'general' ? 'active' : ''}
              onClick={() => { setActiveTab('general'); setError(null); setSuccess(null); }}
            >
              Geral
            </button>
            <button 
              type="button" 
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => { setActiveTab('security'); setError(null); setSuccess(null); }}
            >
              Segurança
            </button>
          </div>

          {activeTab === 'general' ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="p-name">Nome completo</label>
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-email">Endereço de e-mail</label>
                <input
                  id="p-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-bio">Biografia / Notas</label>
                <textarea
                  id="p-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva um breve resumo sobre você ou seu estilo de escrita..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-timezone">Fuso Horário</label>
                <select
                  id="p-timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="America/Recife">Recife (GMT-3)</option>
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="UTC">UTC / GMT</option>
                </select>
              </div>

              {error && <div className="alert alert-error animate-fade-in">{error}</div>}
              {success && <div className="alert alert-success animate-fade-in">{success}</div>}

              <div className="button-group">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <Link href="/gmn" className="btn-cancel">
                  Voltar ao Painel
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="p-old-pass">Senha Atual</label>
                <input
                  id="p-old-pass"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-new-pass">Nova Senha</label>
                <input
                  id="p-new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-confirm-new-pass">Confirmar Nova Senha</label>
                <input
                  id="p-confirm-new-pass"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  placeholder="Repita a nova senha"
                />
              </div>

              {error && <div className="alert alert-error animate-fade-in">{error}</div>}
              {success && <div className="alert alert-success animate-fade-in">{success}</div>}

              <div className="button-group">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Alterando...' : 'Salvar Nova Senha'}
                </button>
                <Link href="/gmn" className="btn-cancel">
                  Voltar ao Painel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <style jsx global>{`
        .layout-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 2rem;
          height: 60px;
          z-index: 10;
        }

        .logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0;
        }

        .logo span {
          color: var(--color-andamento);
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }

        .nav-item {
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          transition: all 0.2s;
          color: var(--text-secondary);
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: var(--color-andamento);
          background: rgba(20, 184, 166, 0.08);
          font-weight: 600;
        }

        .profile-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at 50% 50%, rgba(15, 15, 23, 0.3) 0%, rgba(7, 7, 10, 0.95) 100%);
          overflow-y: auto;
        }

        .profile-card {
          width: 100%;
          max-width: 580px;
          border-radius: 20px;
          padding: 2.5rem;
        }

        .profile-header-section {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          margin-bottom: 2rem;
        }

        .avatar-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-active);
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.2);
        }

        .avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-personagem) 0%, #2563eb 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-display);
          border: 2px solid var(--border-light);
        }

        .change-avatar-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-light);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.725rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .change-avatar-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-active);
          background: rgba(20, 184, 166, 0.05);
        }

        .profile-meta-title h2 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .profile-meta-title p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 1.8rem;
          gap: 1.5rem;
        }

        .profile-tabs button {
          padding: 0.6rem 0.2rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .profile-tabs button:hover {
          color: var(--text-primary);
        }

        .profile-tabs button.active {
          color: var(--color-andamento);
          border-bottom-color: var(--color-andamento);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          color: var(--text-secondary);
          font-size: 0.825rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group textarea, .form-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-group select option {
          background: var(--bg-space);
          color: var(--text-primary);
        }

        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: var(--color-andamento);
          box-shadow: 0 0 0 1px var(--color-andamento);
          background: rgba(0, 0, 0, 0.35);
        }

        .alert {
          padding: 0.8rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-save {
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, var(--color-andamento) 0%, #0d9488 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.35);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-cancel {
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
          text-align: center;
        }

        .btn-cancel:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
