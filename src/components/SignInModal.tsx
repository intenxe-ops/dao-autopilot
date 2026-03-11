"use client";

import { useAuth } from "@/lib/auth-context";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { signInWithGoogle, signInWithWallet } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0f0f0f] border border-white/10 max-w-md w-full p-8 md:p-12">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#666666] hover:text-white transition-colors cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
          SIGN IN
        </p>
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
          Start Building
        </h2>
        <p className="text-sm text-[#999999] mb-8 font-light leading-relaxed">
          Sign in to start generating proposals. Free tier: 10 proposals/month.
        </p>

        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            className="w-full px-6 py-4 bg-white text-black font-mono text-xs tracking-[0.15em] hover:bg-[#e0e0e0] transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          {/* Wallet Connect */}
          <button
            onClick={signInWithWallet}
            className="w-full px-6 py-4 bg-transparent text-white border border-white/10 font-mono text-xs tracking-[0.15em] hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="6" width="18" height="12" rx="2"/>
              <path d="M3 10h18"/>
              <path d="M7 14h.01"/>
              <path d="M11 14h2"/>
            </svg>
            CONNECT WALLET
          </button>
        </div>

        <p className="text-xs text-[#404040] mt-6 font-light text-center">
          No credit card required
        </p>
      </div>
    </div>
  );
}