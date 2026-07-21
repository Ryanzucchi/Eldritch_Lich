import './globals.css';
import React from 'react';
import { AppProvider } from '../context/AppContext';
import { ClientLayout } from './components/ClientLayout';

export const metadata = {
  title: 'Eldritch Lich - Planejador de Metas Narrativas',
  description: 'Plataforma local-first de escrita criativa e worldbuilding com controle de consistência causal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}

