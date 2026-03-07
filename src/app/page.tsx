import ProposalGenerator from "@/components/ProposalGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-7xl font-bold mb-4 text-red-600 font-mono uppercase tracking-tighter">
              DAO AUTOPILOT
            </h1>
            <div className="h-0.5 w-32 mx-auto bg-red-600"></div>
          </div>

          <p className="text-2xl text-red-400 mb-4 font-mono uppercase tracking-wide">
            AUTONOMOUS GOVERNANCE INFRASTRUCTURE
          </p>
          
          <p className="text-lg text-red-900/70 mb-12 max-w-2xl mx-auto font-mono">
            AI AGENTS THAT GENERATE PROPOSALS, ANALYZE VOTES, AND AUTOMATE OPERATIONS
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <a
              href="#generate"
              className="px-8 py-4 bg-red-600 text-black font-bold rounded-none hover:bg-red-500 transition-all shadow-lg shadow-red-600/50 uppercase tracking-wider font-mono"
            >
              GENERATE PROPOSAL
            </a>

            <a
              href="https://github.com/intenxe-ops/dao-autopilot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black text-red-400 font-bold rounded-none hover:bg-red-950 transition-all border border-red-900/50 uppercase tracking-wider font-mono"
            >
              VIEW ON GITHUB
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-black/80 rounded-none border border-red-900/50 shadow-xl shadow-red-500/10">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-red-400 mb-3 font-mono uppercase">AI PROPOSALS</h3>
              <p className="text-red-900/70 font-mono text-sm">
                GENERATE GOVERNANCE PROPOSALS IN MINUTES
              </p>
            </div>

            <div className="p-6 bg-black/80 rounded-none border border-red-900/50 shadow-xl shadow-red-500/10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-red-400 mb-3 font-mono uppercase">VOTING ANALYTICS</h3>
              <p className="text-red-900/70 font-mono text-sm">
                REAL-TIME INSIGHTS ON VOTER BEHAVIOR
              </p>
            </div>

            <div className="p-6 bg-black/80 rounded-none border border-red-900/50 shadow-xl shadow-red-500/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-red-400 mb-3 font-mono uppercase">SMART ALERTS</h3>
              <p className="text-red-900/70 font-mono text-sm">
                NEVER MISS QUORUM OR GOVERNANCE EVENTS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Generator Section */}
      <div id="generate" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-red-600 mb-12 font-mono uppercase tracking-wider">
            GENERATE YOUR PROPOSAL
          </h2>
          
          <ProposalGenerator />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-red-900/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-red-900/70 text-sm font-mono">
          <p>BUILDING IN PUBLIC. DAY 2 IN PROGRESS.</p>
          <p className="mt-2">
            <a 
              href="https://github.com/intenxe-ops" 
              target="_blank"
              className="text-red-400 hover:text-red-300"
            >
              @INTENXE-OPS
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}