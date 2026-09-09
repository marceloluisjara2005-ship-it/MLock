import React, { useState } from 'react';
import { 
  KeyRound, 
  FileText, 
  Link2, 
  FileCheck2, 
  Folder, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Trash2, 
  Clock, 
  FileUp,
  MoreVertical
} from 'lucide-react';
import { MLockItem } from '../types';

interface ItemCardProps {
  item: MLockItem;
  onDelete: (id: string) => void;
  onViewDetails: (item: MLockItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete, onViewDetails }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Cuenta':
        return {
          icon: KeyRound,
          badgeBg: 'bg-violet-950/60',
          badgeText: 'text-violet-300',
          badgeBorder: 'border-violet-800/40',
          accent: 'hover:border-violet-500/40',
        };
      case 'Nota':
        return {
          icon: FileText,
          badgeBg: 'bg-amber-950/50',
          badgeText: 'text-amber-300',
          badgeBorder: 'border-amber-800/40',
          accent: 'hover:border-amber-500/40',
        };
      case 'Link':
        return {
          icon: Link2,
          badgeBg: 'bg-cyan-950/50',
          badgeText: 'text-cyan-300',
          badgeBorder: 'border-cyan-800/40',
          accent: 'hover:border-cyan-500/40',
        };
      case 'PDF':
        return {
          icon: FileCheck2,
          badgeBg: 'bg-rose-950/50',
          badgeText: 'text-rose-300',
          badgeBorder: 'border-rose-800/40',
          accent: 'hover:border-rose-500/40',
        };
      default:
        return {
          icon: Folder,
          badgeBg: 'bg-emerald-950/50',
          badgeText: 'text-emerald-300',
          badgeBorder: 'border-emerald-800/40',
          accent: 'hover:border-emerald-500/40',
        };
    }
  };

  const theme = getCategoryTheme(item.category);
  const CategoryIcon = theme.icon;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      id={`item-card-${item.id}`}
      onClick={() => onViewDetails(item)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/70 ${theme.accent} shadow-lg shadow-black/40 hover:shadow-violet-950/20 transition-all duration-200 cursor-pointer`}
    >
      {/* Top Bar: Category badge & Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{item.category}</span>
          </span>

          {item.metadata?.service && item.category === 'Cuenta' && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300">
              {item.metadata.service}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            id={`delete-btn-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`¿Seguro que deseas eliminar "${item.title}"?`)) {
                setIsDeleting(true);
                onDelete(item.id);
              }
            }}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            title="Eliminar elemento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-2 mb-4">
        <h3 className="text-base font-bold text-zinc-100 leading-snug group-hover:text-violet-200 transition-colors line-clamp-2">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Dynamic Category-Specific Body Preview */}

        {/* 1. CUENTA */}
        {item.category === 'Cuenta' && (
          <div className="pt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
            {item.metadata?.email && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs font-mono">
                <span className="text-zinc-400 truncate select-all">{item.metadata.email}</span>
                <button
                  onClick={(e) => handleCopy(item.metadata.email!, 'email', e)}
                  className="p-1 text-zinc-400 hover:text-violet-300 transition-colors flex-shrink-0"
                  title="Copiar correo"
                >
                  {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {item.metadata?.password && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs font-mono">
                <span className="text-zinc-200 tracking-wider truncate">
                  {showPassword ? item.metadata.password : '••••••••••••'}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleCopy(item.metadata.password!, 'pass', e)}
                    className="p-1 text-zinc-400 hover:text-violet-300 transition-colors"
                    title="Copiar contraseña"
                  >
                    {copiedKey === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. NOTA */}
        {item.category === 'Nota' && item.metadata?.content && (
          <div className="pt-2">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70 text-xs text-zinc-300 font-sans leading-relaxed line-clamp-3">
              {item.metadata.content}
            </div>
          </div>
        )}

        {/* 3. LINK */}
        {item.category === 'Link' && item.metadata?.url && (
          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs">
              <span className="text-cyan-400 truncate font-mono text-[11px]">
                {item.metadata.url}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => handleCopy(item.metadata.url!, 'url', e)}
                  className="p-1 text-zinc-400 hover:text-cyan-300 transition-colors"
                  title="Copiar enlace"
                >
                  {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={item.metadata.url.startsWith('http') ? item.metadata.url : `https://${item.metadata.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-zinc-400 hover:text-cyan-300 transition-colors"
                  title="Abrir enlace en nueva pestaña"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 4. PDF */}
        {item.category === 'PDF' && (
          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileCheck2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div className="truncate">
                  <p className="font-medium text-zinc-200 truncate">
                    {item.metadata?.fileName || 'Documento.pdf'}
                  </p>
                  {item.metadata?.fileSize && (
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {formatFileSize(item.metadata.fileSize)}
                    </p>
                  )}
                </div>
              </div>

              {item.metadata?.fileUrl && (
                <a
                  href={item.metadata.fileUrl}
                  download={item.metadata.fileName || 'archivo.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/40 transition-colors"
                  title="Descargar o ver archivo PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ver PDF</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 5. CUSTOM CATEGORY */}
        {!['Cuenta', 'Nota', 'Link', 'PDF'].includes(item.category) && item.metadata?.customDetails && (
          <div className="pt-2">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/70 text-xs text-zinc-300 line-clamp-3">
              {item.metadata.customDetails}
            </div>
          </div>
        )}
      </div>

      {/* Footer info: Date & Details CTA */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(item.created_at)}</span>
        </div>
        <span className="text-violet-400 group-hover:text-violet-300 font-medium">
          Ver detalles →
        </span>
      </div>
    </div>
  );
};
