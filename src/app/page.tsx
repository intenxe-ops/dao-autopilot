import ProposalGenerator from "@/components/ProposalGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
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

      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-20">
            <div className="mb-6">
              <p className="text-sm font-mono text-[#666666] tracking-[0.3em] mb-3">
                AUTONOMOUS INFRASTRUCTURE
              </p>
              <h1 className="text-[120px] font-light leading-[0.9] tracking-[-0.02em] text-white mb-6">
                DAO<br/>
                <span className="font-extralight text-[#e0e0e0]">AUTOPILOT</span>
              </h1>
              <div className="w-24 h-[1px] bg-white/10"></div>
            </div>

            <p className="text-[28px] font-light text-[#999999] max-w-3xl leading-relaxed tracking-tight">
              AI-driven governance infrastructure.<br/>
              Generate proposals. Analyze votes. Automate operations.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex gap-4 mb-32">
            <a
              href="#generate"
              className="group px-8 py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-[#e0e0e0] transition-all duration-200"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                GENERATE PROPOSAL
              </span>
            </a>

            <a
              href="https://github.com/intenxe-ops/dao-autopilot"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-transparent text-white/80 font-mono text-sm tracking-wider hover:text-white hover:bg-white/5 transition-all duration-200 border border-white/10"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                VIEW SOURCE
              </span>
            </a>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.03] mb-32">
            <div className="bg-[#0f0f0f] p-10 group hover:bg-[#1a1a1a] transition-colors duration-300">
              <div className="mb-6 text-[#666666] group-hover:text-[#999999] transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 12h6M12 9v6"/>
                </svg>
              </div>
              <h3 className="text-lg font-mono tracking-wider text-white mb-3">
                AI PROPOSALS
              </h3>
              <p className="text-sm text-[#808080] leading-relaxed font-light">
                Generate governance proposals in minutes using historical context and proposal patterns
              </p>
            </div>

            <div className="bg-[#0f0f0f] p-10 group hover:bg-[#1a1a1a] transition-colors duration-300">
              <div className="mb-6 text-[#666666] group-hover:text-[#999999] transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9M13 17v-6M8 17v-3"/>
                </svg>
              </div>
              <h3 className="text-lg font-mono tracking-wider text-white mb-3">
                VOTING ANALYTICS
              </h3>
              <p className="text-sm text-[#808080] leading-relaxed font-light">
                Real-time insights on voter behavior and proposal performance metrics
              </p>
            </div>

            <div className="bg-[#0f0f0f] p-10 group hover:bg-[#1a1a1a] transition-colors duration-300">
              <div className="mb-6 text-[#666666] group-hover:text-[#999999] transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-mono tracking-wider text-white mb-3">
                SMART ALERTS
              </h3>
              <p className="text-sm text-[#808080] leading-relaxed font-light">
                Never miss quorum thresholds or critical governance events
              </p>
            </div>
          </div>

          {/* Accent Line */}
          <div className="w-full h-[1px] bg-white/[0.05] mb-32"></div>
        </div>
      </div>

      {/* Proposal Generator Section */}
      <div id="generate" className="container mx-auto px-4 pb-32 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-mono text-[#666666] tracking-[0.3em] mb-4">
              GENERATOR
            </p>
            <h2 className="text-[64px] font-light leading-none tracking-tight text-white">
              Build Your Proposal
            </h2>
          </div>
          
          <ProposalGenerator />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <p className="text-xs font-mono text-[#404040] tracking-wider">
              BUILDING IN PUBLIC / DAY 2
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
      </footer>
    </main>
  );
}