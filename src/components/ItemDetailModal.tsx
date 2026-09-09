import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  FileText, 
  Link2, 
  FileCheck2, 
  Folder, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar, 
  Shield 
} from 'lucide-react';
import { MLockItem } from '../types';

interface ItemDetailModalProps {
  item: MLockItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!item) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="item-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="item-detail-modal"
        className="relative w-full max-w-lg my-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-900 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-violet-950/80 text-violet-300 border border-violet-800/40">
                {item.category}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                ID: {item.id.slice(0, 8)}...
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 font-sans leading-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-4">
          {item.description && (
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Descripción
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-900">
                {item.description}
              </p>
            </div>
          )}

          {/* Cuenta specifics */}
          {item.category === 'Cuenta' && (
            <div className="space-y-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
              {item.metadata?.service && (
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-semibold mb-1">
                    Servicio
                  </span>
                  <div className="text-sm font-medium text-zinc-200">
                    {item.metadata.service}
                  </div>
                </div>
              )}

              {item.metadata?.email && (
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-semibold mb-1">
                    Correo / Usuario
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-800">
                    <span className="select-all truncate">{item.metadata.email}</span>
                    <button
                      onClick={() => handleCopy(item.metadata.email!, 'email')}
                      className="p-1 text-zinc-400 hover:text-violet-300 transition-colors"
                      title="Copiar correo"
                    >
                      {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {item.metadata?.password && (
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-semibold mb-1">
                    Contraseña
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-800">
                    <span className="tracking-wider select-all truncate">
                      {showPassword ? item.metadata.password : '••••••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.metadata.password!, 'pass')}
                        className="p-1 text-zinc-400 hover:text-violet-300 transition-colors"
                        title="Copiar contraseña"
                      >
                        {copiedKey === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nota specifics */}
          {item.category === 'Nota' && item.metadata?.content && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Contenido
                </span>
                <button
                  onClick={() => handleCopy(item.metadata.content!, 'note')}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {copiedKey === 'note' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar nota</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {item.metadata.content}
              </div>
            </div>
          )}

          {/* Link specifics */}
          {item.category === 'Link' && item.metadata?.url && (
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Dirección URL
              </span>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <a
                  href={item.metadata.url.startsWith('http') ? item.metadata.url : `https://${item.metadata.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline font-mono truncate select-all"
                >
                  {item.metadata.url}
                </a>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(item.metadata.url!, 'link')}
                    className="p-1.5 rounded text-zinc-400 hover:text-zinc-200"
                    title="Copiar URL"
                  >
                    {copiedKey === 'link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={item.metadata.url.startsWith('http') ? item.metadata.url : `https://${item.metadata.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded text-zinc-400 hover:text-cyan-300"
                    title="Abrir URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* PDF specifics */}
          {item.category === 'PDF' && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-3">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-7 h-7 text-rose-400 flex-shrink-0" />
                <div className="truncate">
                  <h4 className="font-semibold text-zinc-100 text-sm truncate">
                    {item.metadata?.fileName || 'Documento.pdf'}
                  </h4>
                  {item.metadata?.fileSize && (
                    <p className="text-xs text-zinc-400 font-mono">
                      {(item.metadata.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>

              {item.metadata?.fileUrl && (
                <div className="pt-2">
                  <a
                    href={item.metadata.fileUrl}
                    download={item.metadata.fileName || 'archivo.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar o Abrir PDF</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Custom details */}
          {!['Cuenta', 'Nota', 'Link', 'PDF'].includes(item.category) && item.metadata?.customDetails && (
            <div>
              <span className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                Detalles
              </span>
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                {item.metadata.customDetails}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
            <Calendar className="w-3.5 h-3.5" />
            <span>Creado el {formatDate(item.created_at)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <button
            onClick={() => {
              if (window.confirm(`¿Seguro que deseas eliminar "${item.title}"?`)) {
                onDelete(item.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar elemento</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
