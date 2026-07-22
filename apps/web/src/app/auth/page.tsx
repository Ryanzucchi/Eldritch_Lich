'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated) {
          router.push('/');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let endpoint = '/api/auth/login';
      let body: any = { email };

      if (mode === 'login') {
        endpoint = '/api/auth/login';
        body = { email, password };
      } else if (mode === 'register') {
        endpoint = '/api/auth/register';
        body = { name, email, password, confirmPassword };
      } else if (mode === 'forgot') {
        endpoint = '/api/auth/forgot-password';
        body = { email };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Ocorreu um erro no processamento.');
      }

      if (mode === 'login') {
        setSuccess('Autenticado com sucesso! Redirecionando...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 800);
      } else if (mode === 'register') {
        setSuccess('Cadastro realizado com sucesso! E-mail de ativação enviado (simulado). Redirecionando para login...');
        setName('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setMode('login');
          setSuccess(null);
        }, 2000);
      } else if (mode === 'forgot') {
        setSuccess('Se o e-mail estiver cadastrado, um link de recuperação contendo as instruções de redefinição de senha foi enviado.');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-background-effects">
        <div className="glow-sphere glow-1"></div>
        <div className="glow-sphere glow-2"></div>
      </div>

      <div className="auth-card glass">
        <div className="auth-header">
          <h1>Eldritch Lich</h1>
          <p className="subtitle">Seu assistente local-first de escrita criativa e worldbuilding</p>
        </div>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button 
              type="button"
              className={mode === 'login' ? 'active' : ''} 
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
            >
              Entrar
            </button>
            <button 
              type="button"
              className={mode === 'register' ? 'active' : ''} 
              onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
            >
              Cadastrar
            </button>
          </div>
        )}

        {mode === 'forgot' && (
          <div className="forgot-header text-center">
            <h3>Recuperar Senha</h3>
            <p>Digite seu e-mail para receber as instruções de recuperação</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Thiago Rodrigues"
                required={mode === 'register'}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Endereço de e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@provedor.com"
              required
              autoComplete="email"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Senha de acesso</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    className="forgot-password-link"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha digitada"
                required={mode === 'register'}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="alert alert-error animate-fade-in">{error}</div>}
          {success && <div className="alert alert-success animate-fade-in">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processando...' : 
             mode === 'login' ? 'Entrar no Painel' : 
             mode === 'register' ? 'Criar minha conta' : 'Enviar link de recuperação'}
          </button>
        </form>

        <div className="auth-footer text-center">
          {mode === 'forgot' ? (
            <button 
              type="button" 
              className="footer-link-btn"
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
            >
              Voltar para o login
            </button>
          ) : mode === 'login' ? (
            <button 
              type="button" 
              className="footer-link-btn"
              onClick={() => setMode('register')}
            >
              Não tem uma conta? Cadastre-se gratuitamente
            </button>
          ) : (
            <button 
              type="button" 
              className="footer-link-btn"
              onClick={() => setMode('login')}
            >
              Já possui registro? Faça login aqui
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          background-color: var(--bg-space);
          z-index: 1;
        }

        .auth-background-effects {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .glow-1 {
          width: 400px;
          height: 400px;
          background: var(--color-andamento);
          top: 10%;
          left: 15%;
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          background: var(--color-personagem);
          bottom: 10%;
          right: 15%;
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          padding: 2.5rem 2rem;
          border-radius: 24px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 0.925rem;
          line-height: 1.4;
        }

        .forgot-header {
          margin-bottom: 1.5rem;
        }

        .forgot-header h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .forgot-header p {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 1.8rem;
        }

        .auth-tabs button {
          flex: 1;
          padding: 0.8rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .auth-tabs button:hover {
          color: var(--text-primary);
        }

        .auth-tabs button.active {
          color: var(--color-andamento);
          border-bottom-color: var(--color-andamento);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-group label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .forgot-password-link {
          background: none;
          border: none;
          color: var(--color-andamento);
          font-size: 0.775rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
          padding: 0;
        }

        .forgot-password-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
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

        .submit-btn {
          margin-top: 0.6rem;
          padding: 0.85rem;
          background: linear-gradient(135deg, var(--color-andamento) 0%, #0d9488 100%);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(20, 184, 166, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(20, 184, 166, 0.35);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .footer-link-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.825rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-link-btn:hover {
          color: var(--color-andamento);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
