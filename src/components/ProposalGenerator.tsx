"use client";

import { useState } from "react";

export default function ProposalGenerator() {
  const [daoSpace, setDaoSpace] = useState("");
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!daoSpace || !idea) return;

    setLoading(true);
    setProposal("");

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daoSpace, idea }),
      });

      const data = await res.json();
      
      if (data.success) {
        setProposal(data.proposal);
      } else {
        setProposal("Error: " + data.error);
      }
    } catch (error) {
      setProposal("Error generating proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-black/80 border border-red-900/50 rounded-none p-8 shadow-2xl shadow-red-500/10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-2">
              DAO SNAPSHOT SPACE
            </label>
            <input
              type="text"
              value={daoSpace}
              onChange={(e) => setDaoSpace(e.target.value)}
              placeholder="e.g., arbitrumfoundation.eth"
              className="w-full px-4 py-3 bg-black border border-red-900/50 rounded-none text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-500 transition-colors font-mono"
            />
            <p className="text-xs text-red-900/70 mt-2 font-mono">
              ENTER SNAPSHOT SPACE NAME (USUALLY ENDS IN .ETH)
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-2">
              PROPOSAL IDEA
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., Increase grants budget by 10%"
              rows={4}
              className="w-full px-4 py-3 bg-black border border-red-900/50 rounded-none text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono"
            />
            <p className="text-xs text-red-900/70 mt-2 font-mono">
              DESCRIBE YOUR PROPOSAL IDEA IN A FEW SENTENCES
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !daoSpace || !idea}
            className="w-full px-8 py-4 bg-red-600 text-black font-bold rounded-none hover:bg-red-500 transition-all shadow-lg shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-mono"
          >
            {loading ? "EXECUTING..." : "GENERATE PROPOSAL"}
          </button>
        </div>
      </div>

      {/* Generated Proposal */}
      {proposal && (
        <div className="bg-black/80 border border-red-900/50 rounded-none p-8 shadow-2xl shadow-red-500/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-red-400 font-mono uppercase tracking-wider">GENERATED PROPOSAL</h3>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-black text-red-400 rounded-none hover:bg-red-950 transition-all border border-red-900/50 text-xs font-mono uppercase tracking-wider"
            >
              COPY TO CLIPBOARD
            </button>
          </div>
          
          <div className="bg-black rounded-none p-6 border border-red-900/50 overflow-x-auto">
            <pre className="text-red-100 whitespace-pre-wrap font-mono text-sm">
              {proposal}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}