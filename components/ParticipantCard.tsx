"use client";
import { Participant } from "@/lib/data";

interface Props {
  participant: Participant;
  rank?: number;
  onVote: () => void;
}

export default function ParticipantCard({ participant: p, rank, onVote }: Props) {
  const formatVotes = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

  const rankColors = ["text-[#c9a227]", "text-[#b0c4de]", "text-[#cd7f32]"];
  const rankBg = ["border-[#c9a227]/40", "border-[#b0c4de]/40", "border-[#cd7f32]/40"];

  return (
    <div
      className={`group relative bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#c9a227]/10 ${
        rank && rank <= 3 ? rankBg[rank - 1] : "border-white/8"
      }`}
    >
      {/* Rank badge */}
      {rank && (
        <div
          className={`absolute top-3 left-3 z-10 font-display font-black text-xs px-2 py-0.5 rounded-full border ${
            rank <= 3
              ? `${rankColors[rank - 1]} ${rankBg[rank - 1]} bg-black/60`
              : "text-white/40 border-white/10 bg-black/40"
          }`}
        >
          #{rank}
        </div>
      )}

      {/* Avatar */}
      <div className="relative h-56 bg-gradient-to-br from-white/5 to-transparent overflow-hidden">
        <img
          src={p.avatar}
          alt={p.fullName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-0.5">
            {p.state}
          </p>
          <h3 className="font-display font-black text-white text-lg leading-tight">
            {p.nickname || p.fullName}
          </h3>
          <p className="text-white/40 text-xs mt-0.5">{p.fullName}</p>
        </div>

        <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">{p.bio}</p>

        {/* Socials */}
        <div className="flex gap-2 mb-4">
          {p.instagram && (
            <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-md">
              IG
            </span>
          )}
          {p.twitter && (
            <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-md">
              𝕏
            </span>
          )}
          {p.tiktok && (
            <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-md">
              TT
            </span>
          )}
        </div>

        {/* Votes + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#c9a227] font-display font-black text-xl leading-none">
              {formatVotes(p.votes)}
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">votes</p>
          </div>
          <button
            onClick={onVote}
            className="bg-[#c9a227] hover:bg-[#f0d060] text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#c9a227]/20"
          >
            Vote →
          </button>
        </div>
      </div>
    </div>
  );
}
