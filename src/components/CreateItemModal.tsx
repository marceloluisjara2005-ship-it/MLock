import React, { useState, useRef } from 'react';
import { 
  X, 
  KeyRound, 
  FileText, 
  Link2, 
  FileCheck2, 
  Folder, 
  Upload, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertCircle,
  FileUp,
  Check
} from 'lucide-react';
import { CustomCategory, ItemCategoryType } from '../types';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CustomCategory[];
  defaultCategory?: string;
  onSave: (
    itemData: {
      title: string;
      category: ItemCategoryType;
      description?: string;
      metadata: Record<string, any>;
    },
    pdfFile?: File | null
  ) => Promise<boolean>;
  actionLoading: boolean;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  categories,
  defaultCategory = 'Cuenta',
  onSave,
  actionLoading,
}) => {
  // Determine initial valid category
  const initialCat = ['Cuenta', 'Nota', 'Link', 'PDF'].includes(defaultCategory)
    ? defaultCategory
    : categories.find((c) => c.name === defaultCategory)?.name || 'Cuenta';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategoryType>(initialCat);
  const [description, setDescription] = useState('');

  // Cuenta fields
  const [service, setService] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Nota fields
  const [content, setContent] = useState('');

  // Link fields
  const [url, setUrl] = useState('');

  // PDF fields
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Category fields
  const [customDetails, setCustomDetails] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate secure random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let generated = '';
    const array = new Uint32Array(16);
    crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      generated += chars[array[i] % chars.length];
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setValidationError('Solo se permiten archivos en formato PDF.');
        return;
      }
      setValidationError(null);
      setPdfFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setValidationError('Solo se permiten archivos en formato PDF.');
        return;
      }
      setValidationError(null);
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('El título es obligatorio.');
      return;
    }

    const metadata: Record<string, any> = {};

    // Specific validation & metadata gathering
    if (category === 'Cuenta') {
      if (!service.trim() && !email.trim() && !password.trim()) {
        setValidationError('Por favor completa al menos el servicio, correo o contraseña.');
        return;
      }
      metadata.service = service.trim();
      metadata.email = email.trim();
      metadata.password = password;
    } else if (category === 'Nota') {
      if (!content.trim()) {
        setValidationError('El contenido de la nota no puede estar vacío.');
        return;
      }
      metadata.content = content.trim();
    } else if (category === 'Link') {
      if (!url.trim()) {
        setValidationError('La dirección URL es obligatoria.');
        return;
      }
      metadata.url = url.trim();
    } else if (category === 'PDF') {
      if (!pdfFile) {
        setValidationError('Debes adjuntar un archivo PDF.');
        return;
      }
      metadata.fileName = pdfFile.name;
      metadata.fileSize = pdfFile.size;
    } else {
      // Custom category
      metadata.customDetails = customDetails.trim();
    }

    const success = await onSave(
      {
        title: title.trim(),
        category,
        description: description.trim(),
        metadata,
      },
      pdfFile
    );

    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="create-item-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="create-item-modal"
        className="relative w-full max-w-lg my-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-sans">
              Agregar a MLock
            </h2>
            <p className="text-xs text-zinc-400">
              Registra un nuevo elemento seguro en tu panel personal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            disabled={actionLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Validation Error Notice */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Categoría Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Categoría / Apartado *
            </label>
            <div className="relative">
              <select
                id="item-category-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setValidationError(null);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
              >
                <optgroup label="Apartados Principales">
                  <option value="Cuenta">🔑 Cuenta (Servicio, Correo, Contraseña)</option>
                  <option value="Nota">📝 Nota (Contenido seguro)</option>
                  <option value="Link">🔗 Link (Dirección URL)</option>
                  <option value="PDF">📄 PDF (Adjuntar documento)</option>
                </optgroup>
                {categories.length > 0 && (
                  <optgroup label="Mis Apartados Personalizados">
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        📁 {c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Título (Obligatorio) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Título *
            </label>
            <input
              id="item-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cuenta GitHub, Contrato de Trabajo, Resumen de Cripto..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          {/* Descripción (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Descripción (Opcional)
            </label>
            <input
              id="item-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve nota contextual o recordatorio"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          {/* ================= CONDITIONAL FIELDS ================= */}

          {/* 1. PDF: File attachment */}
          {category === 'PDF' && (
            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider">
                Adjuntar Documento PDF *
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragActive
                    ? 'border-rose-500 bg-rose-950/20'
                    : pdfFile
                    ? 'border-emerald-500/60 bg-emerald-950/15'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="pdf-file-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {pdfFile ? (
                  <div className="flex items-center gap-3 text-emerald-300 text-sm">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-zinc-200">{pdfFile.name}</p>
                      <p className="text-xs text-zinc-400 font-mono">
                        {(pdfFile.size / 1024).toFixed(1)} KB — Listo para subir
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <FileUp className="w-8 h-8 text-rose-400 mx-auto stroke-[1.5]" />
                    <p className="text-xs font-medium text-zinc-300">
                      Haz clic para seleccionar o arrastra tu archivo PDF
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Almacenado de forma segura en Supabase Storage
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. CUENTA: Servicio, Correo, Contraseña */}
          {category === 'Cuenta' && (
            <div className="pt-2 border-t border-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                  Datos de la Cuenta
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generar contraseña segura</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Servicio / Plataforma</label>
                <input
                  id="account-service-input"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Ej: Netflix, Google, Spotify, Banco..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Correo Electrónico / Usuario</label>
                <input
                  id="account-email-input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com o nombre_usuario"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    id="account-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 pr-10 text-sm text-zinc-100 placeholder-zinc-400 font-mono focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTA: Contenido */}
          {category === 'Nota' && (
            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Contenido de la Nota *
              </label>
              <textarea
                id="note-content-input"
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe aquí tu nota privada, listas, tokens o apuntes confidenciales..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans leading-relaxed"
              />
            </div>
          )}

          {/* 4. LINK: Dirección (URL) */}
          {category === 'Link' && (
            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Dirección (URL) *
              </label>
              <input
                id="link-url-input"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com/recurso-seguro"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 placeholder-zinc-400 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          )}

          {/* 5. Custom Category Details */}
          {!['Cuenta', 'Nota', 'Link', 'PDF'].includes(category) && (
            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Detalles del Apartado ({category})
              </label>
              <textarea
                id="custom-details-input"
                rows={4}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Información adicional o valores específicos para este apartado..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="submit-item-btn"
              type="submit"
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-medium text-sm shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Elemento</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
