'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      setError('Parâmetros de redefinição de senha inválidos ou ausentes.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !token) {
      setError('E-mail ou token ausentes.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao redefinir a senha.');
      }

      setSuccess('Senha atualizada com sucesso! Redirecionando para login...');
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card glass">
      <div className="auth-header">
        <h1>Nova Senha</h1>
        <p className="subtitle">Defina uma nova senha para sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email-disabled">E-mail</label>
          <input
            id="email-disabled"
            type="text"
            value={email}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nova Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            disabled={!email || !token || loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
            required
            disabled={!email || !token || loading}
          />
        </div>

        {error && <div className="alert alert-error animate-fade-in">{error}</div>}
        {success && <div className="alert alert-success animate-fade-in">{success}</div>}

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading || !email || !token}
        >
          {loading ? 'Processando...' : 'Salvar Nova Senha'}
        </button>
      </form>

      <div className="auth-footer text-center">
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => router.push('/auth')}
        >
          Voltar para a página de login
        </button>
      </div>

      <style jsx>{`
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

        .form-group label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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

        .form-group input:focus:not(.input-disabled) {
          outline: none;
          border-color: var(--color-andamento);
          box-shadow: 0 0 0 1px var(--color-andamento);
          background: rgba(0, 0, 0, 0.35);
        }

        .input-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.02) !important;
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
          box-shadow: none;
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

export default function ResetPasswordPage() {
  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-background-effects">
        <div className="glow-sphere glow-1"></div>
        <div className="glow-sphere glow-2"></div>
      </div>

      <Suspense fallback={
        <div className="auth-card glass text-center">
          <p>Carregando formulário...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>

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
      `}</style>
    </div>
  );
}
