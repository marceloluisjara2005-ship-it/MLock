export type ItemCategoryType = 'Cuenta' | 'Nota' | 'Link' | 'PDF' | string;

export interface AccountMetadata {
  service?: string;
  email?: string;
  password?: string;
}

export interface NoteMetadata {
  content?: string;
}

export interface LinkMetadata {
  url?: string;
}

export interface PdfMetadata {
  fileName?: string;
  fileSize?: number;
  filePath?: string;
  fileUrl?: string;
}

export interface CustomMetadata {
  customDetails?: string;
  [key: string]: any;
}

export type ItemMetadata = AccountMetadata & NoteMetadata & LinkMetadata & PdfMetadata & CustomMetadata;

export interface MLockItem {
  id: string;
  user_id: string;
  title: string;
  category: ItemCategoryType;
  description?: string;
  metadata: ItemMetadata;
  created_at: string;
  updated_at?: string;
}

export interface CustomCategory {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
}
