"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "@/components/SignInModal";
import ProposalGenerator from "@/components/ProposalGenerator";

export default function Home() {
  const { user, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
      {/* Sign In Modal */}
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Header with Auth */}
      <div className="container mx-auto px-4 py-6 relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xs font-mono text-[#666666] tracking-[0.2em]">
            DAO AUTOPILOT
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#808080] font-mono">
                {user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-xs font-mono text-[#666666] hover:text-white transition-colors tracking-wider cursor-pointer"
              >
                SIGN OUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="text-xs font-mono text-[#808080] hover:text-white transition-colors tracking-wider cursor-pointer"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="mb-32">
            <div className="mb-8">
              <p className="text-[10px] md:text-xs font-mono text-[#666666] tracking-[0.3em] mb-4">
                GOVERNANCE INFRASTRUCTURE
              </p>
              <h1 className="text-[48px] md:text-[72px] lg:text-[96px] font-light leading-[0.9] tracking-[-0.02em] text-white mb-8">
                Intelligence for<br/>
                <span className="font-extralight text-[#e0e0e0]">Protocol DAOs</span>
              </h1>
              <div className="w-16 md:w-24 h-[1px] bg-white/10 mb-8"></div>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl font-light text-[#999999] max-w-3xl leading-relaxed mb-12">
              Your governance team writes better proposals, faster. AI-powered analysis and proposal generation optimized for your DAO's voting patterns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {user ? (
                <a
                  href="#generate"
                  className="group px-8 py-5 bg-white text-black font-mono text-xs md:text-sm tracking-[0.2em] hover:bg-[#e0e0e0] transition-all duration-200 text-center cursor-pointer"
                >
                  <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                    START BUILDING
                  </span>
                </a>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="group px-8 py-5 bg-white text-black font-mono text-xs md:text-sm tracking-[0.2em] hover:bg-[#e0e0e0] transition-all duration-200 text-center cursor-pointer"
                >
                  <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                    START FREE
                  </span>
                </button>
              )}

              <a
                href="https://github.com/intenxe-ops/dao-autopilot"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-5 bg-transparent text-white/80 font-mono text-xs md:text-sm tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all duration-200 border border-white/10 text-center cursor-pointer"
              >
                <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                  VIEW SOURCE
                </span>
              </a>
            </div>

            <p className="text-xs font-mono text-[#404040] tracking-wider">
              Open source • Real-time Snapshot data • No calls required
            </p>
          </div>

          {/* Problem/Solution */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
                  THE PROBLEM
                </p>
                <div className="space-y-4 text-[#999999] font-light leading-relaxed">
                  <p>Governance teams spend 10+ hours per proposal</p>
                  <p>60% of proposals fail due to poor framing</p>
                  <p>No data on what actually passes in your DAO</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
                  THE SOLUTION
                </p>
                <div className="space-y-4 text-white font-light leading-relaxed">
                  <p>Generate proposals in 15 minutes</p>
                  <p>Optimize based on voting patterns + whale behavior</p>
                  <p>Increase success rate with intelligence-driven writing</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-32">
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-12">
              HOW IT WORKS
            </p>
            <div className="grid md:grid-cols-3 gap-px bg-white/[0.03]">
              <div className="bg-[#0f0f0f] p-8 md:p-10">
                <p className="text-sm font-mono text-[#666666] mb-4 tracking-wider">01</p>
                <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-tight">
                  Analyze
                </h3>
                <p className="text-sm text-[#808080] leading-relaxed font-light">
                  System learns your DAO's voting patterns, power distribution, and proposal success criteria
                </p>
              </div>

              <div className="bg-[#0f0f0f] p-8 md:p-10">
                <p className="text-sm font-mono text-[#666666] mb-4 tracking-wider">02</p>
                <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-tight">
                  Optimize
                </h3>
                <p className="text-sm text-[#808080] leading-relaxed font-light">
                  AI generates proposals designed to pass using success keywords and proven patterns
                </p>
              </div>

              <div className="bg-[#0f0f0f] p-8 md:p-10">
                <p className="text-sm font-mono text-[#666666] mb-4 tracking-wider">03</p>
                <h3 className="text-xl md:text-2xl font-light text-white mb-4 tracking-tight">
                  Deploy
                </h3>
                <p className="text-sm text-[#808080] leading-relaxed font-light">
                  Export to Snapshot, track performance, iterate based on results
                </p>
              </div>
            </div>
          </div>

          {/* Accent Line */}
          <div className="w-full h-[1px] bg-white/[0.05] mb-32"></div>
        </div>
      </div>

      {/* Proposal Generator Section */}
      <div id="generate" className="container mx-auto px-4 pb-32 relative scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] md:text-sm font-mono text-[#666666] tracking-[0.3em] mb-4">
              GENERATOR
            </p>
            <h2 className="text-[36px] md:text-[48px] lg:text-[64px] font-light leading-none tracking-tight text-white">
              Start Building
            </h2>
          </div>
          
          {user ? (
            <ProposalGenerator />
          ) : (
            <div className="bg-[#0f0f0f] border border-white/10 p-12 md:p-20 text-center">
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-6">
                AUTHENTICATION REQUIRED
              </p>
              <h3 className="text-2xl md:text-3xl font-light text-white mb-6 tracking-tight">
                Sign in to generate proposals
              </h3>
              <p className="text-sm text-[#999999] mb-8 font-light max-w-md mx-auto">
                Create an account to access the proposal generator and voting intelligence.
              </p>
              <button
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 bg-white text-black font-mono text-xs tracking-[0.2em] hover:bg-[#e0e0e0] transition-all cursor-pointer"
              >
                SIGN IN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <p className="text-xs font-mono text-[#666666] tracking-wider mb-4">PRODUCT</p>
                <div className="space-y-2">
                  <a href="https://github.com/intenxe-ops/dao-autopilot" target="_blank" className="block text-xs text-[#808080] hover:text-white transition-colors">GitHub</a>
                  <a href="https://github.com/intenxe-ops/dao-autopilot#readme" target="_blank" className="block text-xs text-[#808080] hover:text-white transition-colors">Documentation</a>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-mono text-[#666666] tracking-wider mb-4">COMPANY</p>
                <div className="space-y-2">
                  <a href="https://twitter.com/intenxe_ops" target="_blank" className="block text-xs text-[#808080] hover:text-white transition-colors">Twitter</a>
                  <a href="mailto:ops@intenxe.xyz" className="block text-xs text-[#808080] hover:text-white transition-colors">Contact</a>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono text-[#666666] tracking-wider mb-4">RESOURCES</p>
                <div className="space-y-2">
                  <a href="https://github.com/intenxe-ops/dao-autopilot#roadmap" target="_blank" className="block text-xs text-[#808080] hover:text-white transition-colors">Roadmap</a>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono text-[#666666] tracking-wider mb-4">LEGAL</p>
                <div className="space-y-2">
                  <p className="text-xs text-[#404040]">MIT License</p>
                  <p className="text-xs text-[#404040]">Open Source</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs font-mono text-[#404040] tracking-wider">
                BUILDING IN PUBLIC
              </p>
              <a 
                href="https://github.com/intenxe-ops" 
                target="_blank"
                className="text-xs font-mono text-[#666666] hover:text-[#999999] tracking-wider transition-colors"
              >
                @INTENXE-OPS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}