import {
  Users,
  UserCog,
  Car,
  FileText,
  ClipboardCheck,
  FileSignature,
  DollarSign,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Wrench,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface ModuleItem {
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  description: string;
}

export interface ModuleSection {
  section: string;
  items: ModuleItem[];
}

export const moduleSections: ModuleSection[] = [
  {
    section: 'CADASTROS',
    items: [
      {
        title: 'Clientes',
        icon: Users,
        href: '/clientes',
        description: 'Gerenciar clientes',
      },
      {
        title: 'Motoristas',
        icon: UserCog,
        href: '/motoristas',
        description: 'Gerenciar motoristas',
      },
      {
        title: 'Veículos',
        icon: Car,
        href: '/veiculos',
        description: 'Gerenciar frota',
      },
    ],
  },
  {
    section: 'OPERAÇÃO',
    items: [
      {
        title: 'Locações',
        icon: FileText,
        href: '/locacoes',
        badge: 'Ativo',
        description: 'Controle de locações',
      },
      {
        title: 'Vistorias',
        icon: ClipboardCheck,
        href: '/vistorias',
        description: 'Vistorias de veículos',
      },
      {
        title: 'Contratos',
        icon: FileSignature,
        href: '/contratos',
        description: 'Gestão de contratos',
      },
    ],
  },
  {
    section: 'FINANCEIRO',
    items: [
      {
        title: 'Financeiro',
        icon: DollarSign,
        href: '/financeiro',
        description: 'Gestão financeira',
      },
      {
        title: 'Multas',
        icon: AlertTriangle,
        href: '/multas',
        description: 'Gestão de multas',
      },
    ],
  },
  {
    section: 'GESTÃO',
    items: [
      {
        title: 'Seguros',
        icon: Shield,
        href: '/seguros',
        description: 'Gestão de seguros',
      },
      {
        title: 'Sinistros',
        icon: ShieldAlert,
        href: '/sinistros',
        description: 'Gestão de sinistros',
      },
      {
        title: 'Manutenção',
        icon: Wrench,
        href: '/manutencao',
        description: 'Manutenção de veículos',
      },
    ],
  },
  {
    section: 'SISTEMA',
    items: [
      {
        title: 'Relatórios',
        icon: BarChart3,
        href: '/relatorios',
        description: 'Relatórios e dashboards',
      },
      {
        title: 'Configurações',
        icon: Settings,
        href: '/configuracoes',
        description: 'Configurações do sistema',
      },
    ],
  },
];
