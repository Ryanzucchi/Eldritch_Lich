'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Project } from '@eldritch/domain';
import { computeE5Embedding, extractEntitiesWithNER, ProgressPayload } from '../services/mms-ai';

interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
}

interface AppContextType {
  user: UserSession | null;
  projects: Project[];
  activeProject: Project | null;
  loadingSession: boolean;
  isAILoaded: boolean;
  isAILoading: boolean;
  aiLoadProgress: number;
  aiLoadStatus: string;
  loadAI: () => Promise<void>;
  selectProject: (project: Project) => void;
  createProject: (name: string, genre: string, visibility: 'PRIVADO' | 'COMPARTILHADO', options?: { activate?: boolean }) => Promise<Project>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hideSidebar: boolean;
  setHideSidebar: (hide: boolean) => void;
  pendingInvites: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserSession | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  // AI states
  const [isAILoaded, setIsAILoaded] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiLoadProgress, setAiLoadProgress] = useState(0);
  const [aiLoadStatus, setAiLoadStatus] = useState('');

  const refreshSession = async () => {
    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (sessionData.authenticated && sessionData.user) {
        // Fetch detailed profile to get avatar, bio, etc.
        const profileRes = await fetch('/api/auth/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData.user);
        } else {
          setUser(sessionData.user);
        }
        
        // Fetch projects
        const projRes = await fetch('/api/projects');
        const projData = await projRes.json();
        if (projData.projects) {
          setProjects(projData.projects);
          
          // Resolve active project
          const savedActiveId = localStorage.getItem('activeProjectId');
          let current = projData.projects.find((p: Project) => p.id === savedActiveId);
          
          if (!current && projData.projects.length > 0) {
            current = projData.projects[0];
            localStorage.setItem('activeProjectId', current.id);
          }
          
          if (current) {
            setActiveProject(current);
            if (current.id !== savedActiveId && typeof window !== 'undefined') {
              window.location.reload();
            }
          }
        }
        if (projData.pendingInvites) {
          setPendingInvites(projData.pendingInvites);
        } else {
          setPendingInvites([]);
        }
      } else {
        setUser(null);
        setProjects([]);
        setActiveProject(null);
        setPendingInvites([]);
      }
    } catch (err) {
      console.error('Falha ao inicializar a sessão do AppContext:', err);
      setUser(null);
      setProjects([]);
      setActiveProject(null);
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    // Only load session if we are not on the auth page or resets
    if (!pathname.startsWith('/auth')) {
      refreshSession();
    } else {
      setLoadingSession(false);
    }
  }, [pathname]);

  const selectProject = (project: Project) => {
    localStorage.setItem('activeProjectId', project.id);
    setActiveProject(project);
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/' || window.location.pathname === '/projects') {
        window.location.href = '/editor';
      } else {
        window.location.href = window.location.pathname; // Recarrega limpando parâmetros de consulta de capítulos antigos
      }
    }
  };

  const createProject = async (name: string, genre: string, visibility: 'PRIVADO' | 'COMPARTILHADO', options: { activate?: boolean } = {}) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, genre, visibility })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar projeto.');
    }

    const newProj = data.project;
    setProjects(prev => [...prev, newProj]);
    if (options.activate === false) return newProj;
    localStorage.setItem('activeProjectId', newProj.id);
    setActiveProject(newProj);
    if (typeof window !== 'undefined') {
      window.location.href = '/editor'; // Recarrega para usar o novo db namespace no editor
    }
    return newProj;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('activeProjectId');
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    router.push('/auth');
  };

  const loadAI = async () => {
    if (isAILoaded || isAILoading) return;
    
    setIsAILoading(true);
    setAiLoadProgress(10);
    setAiLoadStatus('Carregando modelos de inteligência artificial locais...');

    const progressHandler = (payload: ProgressPayload) => {
      if (payload.status === 'loading_embeddings') {
        const percentage = Math.round((payload.progress || 0) * 100);
        setAiLoadProgress(15 + Math.round(percentage * 0.4)); // 15% to 55%
        setAiLoadStatus(`Carregando embeddings: ${percentage}%`);
      } else if (payload.status === 'loading_ner') {
        const percentage = Math.round((payload.progress || 0) * 100);
        setAiLoadProgress(55 + Math.round(percentage * 0.4)); // 55% to 95%
        setAiLoadStatus(`Carregando analisador NER: ${percentage}%`);
      }
    };

    try {
      // Pré-inicialização dos modelos na memória do singleton
      await computeE5Embedding('teste', progressHandler);
      await extractEntitiesWithNER('teste', progressHandler);
      
      setIsAILoaded(true);
      setIsAILoading(false);
      setAiLoadProgress(100);
      setAiLoadStatus('Modelos locais ativos e prontos para verificação.');
    } catch (err) {
      console.error('Erro ao carregar os modelos locais:', err);
      setAiLoadStatus('Erro ao carregar os modelos locais de IA no navegador.');
      setIsAILoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        projects,
        activeProject,
        loadingSession,
        isAILoaded,
        isAILoading,
        aiLoadProgress,
        aiLoadStatus,
        loadAI,
        selectProject,
        createProject,
        logout,
        refreshSession,
        hideSidebar,
        setHideSidebar,
        pendingInvites
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}
