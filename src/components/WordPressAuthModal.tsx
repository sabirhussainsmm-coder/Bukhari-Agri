import React, { useState } from 'react';
import { Lock, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface WordPressAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const WordPressAuthModal: React.FC<WordPressAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('bukhari_admin_auth', '7467');
        setTimeout(() => {
          setIsLoading(false);
          setSuccess(false);
          setPassword('');
          onAuthenticated();
          onClose();
        }, 600);
      } else {
        setIsLoading(false);
        setError(data.error || 'Invalid password. Access denied.');
      }
    } catch {
      // Fallback local check
      if (password === '7467') {
        setSuccess(true);
        localStorage.setItem('bukhari_admin_auth', '7467');
        setTimeout(() => {
          setIsLoading(false);
          setSuccess(false);
          setPassword('');
          onAuthenticated();
          onClose();
        }, 600);
      } else {
        setIsLoading(false);
        setError('Invalid password. Access denied.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1e2327] text-slate-100 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-bold text-lg shadow-md border border-white/20">
              W
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                WordPress Admin Access
              </h3>
              <p className="text-xs text-slate-400">
                Bukhari Agro Management Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            id="close-wp-auth-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter the administrator password to unlock site editing, media library image replacement, and backend settings.
          </p>

          {error && (
            <div className="bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Password verified! Opening editor...</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Administrator Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter password"
                autoFocus
                required
                className="w-full bg-[#101517] text-white text-sm px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-hidden placeholder:text-slate-500"
                id="wp-admin-password-input"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="px-5 py-2 text-xs font-bold text-white bg-[#2271b1] hover:bg-[#135e96] rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
              id="wp-admin-login-btn"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
