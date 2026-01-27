'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  UserCog,
  Car,
  FileText,
  DollarSign,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Wrench,
  ClipboardCheck,
  FileSignature,
  BarChart3,
  Settings,
} from 'lucide-react';

const menuItems = [
  {
    section: 'CADASTROS',
    items: [
      { label: 'Clientes', href: '/dashboard/clientes', icon: Users },
      { label: 'Motoristas', href: '/dashboard/motoristas', icon: UserCog },
      { label: 'Veículos', href: '/dashboard/veiculos', icon: Car },
    ],
  },
  {
    section: 'OPERAÇÃO',
    items: [
      { label: 'Locações', href: '/dashboard/locacoes', icon: FileText },
      { label: 'Vistorias', href: '/dashboard/vistorias', icon: ClipboardCheck },
      { label: 'Contratos', href: '/dashboard/contratos', icon: FileSignature },
    ],
  },
  {
    section: 'FINANCEIRO',
    items: [
      { label: 'Financeiro', href: '/dashboard/financeiro', icon: DollarSign },
      { label: 'Multas', href: '/dashboard/multas', icon: AlertTriangle },
    ],
  },
  {
    section: 'GESTÃO',
    items: [
      { label: 'Seguros', href: '/dashboard/seguros', icon: Shield },
      { label: 'Sinistros', href: '/dashboard/sinistros', icon: ShieldAlert },
      { label: 'Manutenção', href: '/dashboard/manutencao', icon: Wrench },
    ],
  },
  {
    section: 'SISTEMA',
    items: [
      { label: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
      { label: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">MAG System</h1>
        <p className="text-sm text-gray-400">Gestão de Locação</p>
      </div>

      <nav className="space-y-6">
        {menuItems.map((section) => (
          <div key={section.section}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              {section.section}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={\lex items-center gap-3 px-3 py-2 rounded-lg transition-colors \\}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
