import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send,
  Loader2
} from 'lucide-react';
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithMagicLink
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'magic_link';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!password) {
          setError('Por favor ingresa tu contraseña.');
          setLoading(false);
          return;
        }
        await signInWithEmailPassword(email, password);
        handleClose();
      } else if (mode === 'signup') {
        if (!password || password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmailPassword(email, password);
        // If confirmation email is required
        if (res.user && !res.session) {
          setSuccessMessage(
            '¡Cuenta creada con éxito! Se ha enviado un enlace de confirmación a tu correo para activar el acceso.'
          );
        } else {
          setSuccessMessage('¡Sesión iniciada con éxito!');
          setTimeout(() => handleClose(), 1200);
        }
      } else if (mode === 'magic_link') {
        await signInWithMagicLink(email);
        setSuccessMessage(
          '¡Enlace mágico enviado! Revisa tu bandeja de entrada para ingresar sin contraseña.'
        );
      }
    } catch (err: any) {
      console.warn('Auth notice:', err?.message || err);
      let rawMsg = (err?.message || '').toLowerCase();
      let friendlyMsg = 'Error durante la autenticación.';

      if (rawMsg.includes('invalid login credentials') || rawMsg.includes('invalid_grant')) {
        friendlyMsg = 'Correo o contraseña incorrectos. Si aún no has registrado tu cuenta en este proyecto de Supabase, puedes crearla en la pestaña "Registrarse".';
      } else if (rawMsg.includes('user already registered') || rawMsg.includes('already exists')) {
        friendlyMsg = 'Este correo ya tiene una cuenta registrada. Selecciona la pestaña "Iniciar Sesión" para acceder o usa "Magic Link".';
      } else if (rawMsg.includes('email not confirmed')) {
        friendlyMsg = 'Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada o usa "Magic Link" para acceder.';
      } else if (rawMsg.includes('signup requires a valid password')) {
        friendlyMsg = 'La contraseña ingresada no cumple con los requisitos de seguridad.';
      } else if (rawMsg.includes('rate limit')) {
        friendlyMsg = 'Demasiados intentos seguidos. Por favor espera unos momentos antes de reintentar.';
      } else if (err.message) {
        friendlyMsg = err.message;
      }

      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="auth-modal"
        className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col relative"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                {mode === 'signin' && 'Iniciar Sesión'}
                {mode === 'signup' && 'Crear Cuenta'}
                {mode === 'magic_link' && 'Enlace Mágico'}
              </h2>
              <p className="text-xs text-zinc-400">
                {mode === 'signin' && 'Ingresa a tu bóveda personal de MLock'}
                {mode === 'signup' && 'Registra tu usuario seguro en Supabase'}
                {mode === 'magic_link' && 'Accede sin contraseña vía correo'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('magic_link');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                mode === 'magic_link'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Magic Link
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mx-6 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex flex-col gap-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
            {mode === 'signin' && (
              <div className="flex items-center gap-2 pl-6 pt-1 border-t border-rose-900/40">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-xs font-semibold text-rose-200 hover:text-white underline"
                >
                  Ir a Registrarse con este correo →
                </button>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mx-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          {mode !== 'magic_link' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Contraseña
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('magic_link');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-violet-400 hover:text-violet-300"
                  >
                    ¿Olvidaste o sin contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-900/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Entrar a MLock'}
                    {mode === 'signup' && 'Crear mi cuenta'}
                    {mode === 'magic_link' && 'Enviar enlace de acceso'}
                  </span>
                  {mode === 'magic_link' ? (
                    <Send className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-950/60 border-t border-zinc-800/60 text-[11px] text-zinc-500 flex items-center justify-center">
          <span>Seguridad con Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
