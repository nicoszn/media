"use client";
import { Participant } from "@/lib/data";

interface Props {
  participants: Participant[];
  onVote: (p: Participant) => void;
}

const medals = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ participants, onVote }: Props) {
  const total = participants.reduce((s, p) => s + p.votes, 0);

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <h2 className="font-display font-black text-white text-3xl mb-2 text-center">
        Live Rankings
      </h2>
      <p className="text-white/30 text-sm text-center mb-8">
        {total.toLocaleString()} total votes cast
      </p>

      <div className="space-y-3">
        {participants.map((p, i) => {
          const pct = total > 0 ? ((p.votes / total) * 100).toFixed(1) : "0";
          return (
            <div
              key={p.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                i === 0
                  ? "bg-[#c9a227]/10 border-[#c9a227]/30"
                  : i === 1
                  ? "bg-white/5 border-white/10"
                  : i === 2
                  ? "bg-white/3 border-white/5"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <span className="text-2xl w-8 text-center shrink-0">
                {i < 3 ? medals[i] : <span className="text-white/30 font-bold font-display text-sm">#{i + 1}</span>}
              </span>

              <img src={p.avatar} alt={p.fullName} className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display font-black text-white text-base">{p.nickname || p.fullName}</span>
                  <span className="text-white/30 text-xs">{p.state}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#f0d060] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-display font-black text-[#c9a227] text-lg leading-none">
                  {p.votes.toLocaleString()}
                </p>
                <p className="text-white/30 text-xs">{pct}%</p>
              </div>

              <button
                onClick={() => onVote(p)}
                className="shrink-0 bg-[#c9a227] hover:bg-[#f0d060] text-black font-bold text-xs px-3 py-2 rounded-lg transition-all active:scale-95"
              >
                Vote
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
