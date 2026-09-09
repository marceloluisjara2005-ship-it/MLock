import { CustomCategory, MLockItem } from '../types';

export const INITIAL_DEMO_CATEGORIES: CustomCategory[] = [
  {
    id: 'cat-proyectos',
    user_id: 'demo-user',
    name: 'Proyectos',
    slug: 'proyectos',
    icon: 'folder-git-2',
    color: 'emerald',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'cat-finanzas',
    user_id: 'demo-user',
    name: 'Finanzas',
    slug: 'finanzas',
    icon: 'wallet',
    color: 'amber',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const INITIAL_DEMO_ITEMS: MLockItem[] = [
  {
    id: 'item-1',
    user_id: 'demo-user',
    title: 'Cuenta AWS Cloud Prod',
    category: 'Cuenta',
    description: 'Acceso de administrador a la consola central de infraestructura.',
    metadata: {
      service: 'Amazon Web Services',
      email: 'devops.admin@mlock-vault.io',
      password: 'mLock#Aws_992!xK9',
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'item-2',
    user_id: 'demo-user',
    title: 'Credenciales GitHub Enterprise',
    category: 'Cuenta',
    description: 'Token de acceso personal y credenciales organizacionales.',
    metadata: {
      service: 'GitHub',
      email: 'lead.architect@mlock.dev',
      password: 'ghp_VaultSecurePass7791x',
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'item-3',
    user_id: 'demo-user',
    title: 'Arquitectura de Cifrado y RLS',
    category: 'Nota',
    description: 'Lineamientos de seguridad implementados para el dashboard personal.',
    metadata: {
      content: `### Principios de Seguridad MLock:
1. **Row Level Security (RLS)**: Cada consulta PostgreSQL en Supabase evalúa 'auth.uid() = user_id'.
2. **Supabase Storage**: Bucket 'mlock-files' segmentado por carpetas seguras por ID de usuario.
3. **Google OAuth**: Autenticación centralizada sin almacenar contraseñas en texto plano.
4. **Principio de Mínimo Privilegio**: Ningún cliente anónimo puede acceder a registros de otros usuarios.`,
    },
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'item-4',
    user_id: 'demo-user',
    title: 'Documentación Oficial Supabase RLS',
    category: 'Link',
    description: 'Guía oficial de Postgres Row Level Security y políticas de Storage.',
    metadata: {
      url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
    },
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'item-5',
    user_id: 'demo-user',
    title: 'Contrato_Consultoria_2026.pdf',
    category: 'PDF',
    description: 'Copia firmada del acuerdo de servicios y confidencialidad.',
    metadata: {
      fileName: 'Contrato_Consultoria_2026.pdf',
      fileSize: 1420000,
      fileUrl: '#',
      filePath: 'demo-user/Contrato_Consultoria_2026.pdf',
    },
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'item-6',
    user_id: 'demo-user',
    title: 'Roadmap MLock v2.0',
    category: 'Proyectos',
    description: 'Sprint planning para la integración de WebAuthn y hardware keys.',
    metadata: {
      customDetails: 'Objetivo Q3: Compatibilidad con FIDO2, llaves Yubikey y sincronización offline.',
    },
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];
