import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/query-provider';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'MAG System - Gestão de Locação',
  description: 'Sistema profissional de gestão de locação de veículos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
