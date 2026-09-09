import React, { useState } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send,
  Loader2,
  ShieldCheck,
  Vault
} from 'lucide-react';
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithMagicLink,
  isSupabaseConnected
} from '../lib/supabase';

interface AuthPageProps {
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'magic_link';

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        onSuccess?.();
      } else if (mode === 'signup') {
        if (!password || password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmailPassword(email, password);
        if (res.user && !res.session) {
          setSuccessMessage(
            '¡Cuenta creada con éxito! Si tienes la confirmación activada en Supabase, revisa tu correo para activar el acceso; o inicia sesión directamente si no la requiere.'
          );
        } else {
          setSuccessMessage('¡Cuenta creada y sesión iniciada!');
          onSuccess?.();
        }
      } else if (mode === 'magic_link') {
        await signInWithMagicLink(email);
        setSuccessMessage(
          '¡Enlace de acceso enviado! Revisa tu bandeja de entrada para ingresar sin contraseña.'
        );
      }
    } catch (err: any) {
      console.warn('Auth notice:', err?.message || err);
      const rawMsg = (err?.message || '').toLowerCase();
      let friendlyMsg = 'Error durante la autenticación.';

      if (rawMsg.includes('invalid login credentials') || rawMsg.includes('invalid_grant')) {
        friendlyMsg = 'Correo o contraseña incorrectos. Si aún no te has registrado, crea tu cuenta en la pestaña "Registrarse".';
      } else if (rawMsg.includes('user already registered') || rawMsg.includes('already exists')) {
        friendlyMsg = 'Este correo ya está registrado. Selecciona la pestaña "Iniciar Sesión" para ingresar o usa "Magic Link".';
      } else if (rawMsg.includes('email not confirmed')) {
        friendlyMsg = 'El correo no ha sido confirmado aún. Revisa tu bandeja de entrada o usa "Magic Link" para entrar.';
      } else if (rawMsg.includes('signup requires a valid password')) {
        friendlyMsg = 'La contraseña debe tener al menos 6 caracteres válidos.';
      } else if (rawMsg.includes('rate limit')) {
        friendlyMsg = 'Demasiados intentos seguidos. Por favor aguarda unos momentos antes de reintentar.';
      } else if (err.message) {
        friendlyMsg = err.message;
      }

      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative selection:bg-violet-600 selection:text-white">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-600/25 mb-4">
            <Vault className="w-7 h-7 text-white stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MLock Vault</h1>
          <p className="text-xs text-zinc-400 mt-1">Bóveda digital personal protegida y cifrada</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Card Header with Key Icon */}
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
                  {mode === 'signup' && 'Registra tu usuario seguro'}
                  {mode === 'magic_link' && 'Accede sin contraseña vía correo'}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="px-6 pt-4 pb-2">
            <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <button
                type="button"
                id="tab-signin"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-2 rounded-lg font-medium transition-colors ${
                  mode === 'signin'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-2 rounded-lg font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Registrarse
              </button>
              <button
                type="button"
                id="tab-magic"
                onClick={() => {
                  setMode('magic_link');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-2 rounded-lg font-medium transition-colors ${
                  mode === 'magic_link'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Magic Link
              </button>
            </div>
          </div>

          {/* Error Message */}
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

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="auth-email-input"
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
                      }}
                      className="text-[11px] text-violet-400 hover:text-violet-300"
                    >
                      ¿Olvidaste o sin contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password-input"
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
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-900/30 transition-all disabled:opacity-50 active:scale-[0.99]"
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

          {/* Footer Security Badge */}
          <div className="px-6 py-3 bg-zinc-950/60 border-t border-zinc-800/60 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Acceso seguro cifrado extremo a extremo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
