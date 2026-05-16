"use client";

import { useState, useEffect } from "react";
import VoteModal from "@/components/VoteModal";
import ParticipantCard from "@/components/ParticipantCard";
import Leaderboard from "@/components/Leaderboard";
import Header from "@/components/Header";
import { Participant, defaultParticipants } from "@/lib/data";
import { loadParticipants, saveParticipants } from "@/lib/store";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState<{name: string; votes: number} | null>(null);

  useEffect(() => {
    const stored = loadParticipants();
    setParticipants(stored.length ? stored : defaultParticipants);
  }, []);

  const visible = participants.filter((p) => p.visible);
  const ranked = [...visible].sort((a, b) => b.votes - a.votes);
  const displayList = participants.some((p) => p.ranked) ? ranked : visible;

  const handleVote = (participant: Participant) => {
    setSelected(participant);
    setShowModal(true);
  };

  const handlePayment = (amount: number) => {
    if (!selected) return;
    const votesAdded = Math.floor(amount / 100);
    const updated = participants.map((p) =>
      p.id === selected.id ? { ...p, votes: p.votes + votesAdded } : p
    );
    setParticipants(updated);
    saveParticipants(updated);
    setShowModal(false);
    setVoteSuccess({ name: selected.nickname || selected.fullName, votes: votesAdded });
    setSelected(null);
    setTimeout(() => setVoteSuccess(null), 4000);
  };

  return (
    <main className="min-h-screen bg-[#080810] text-white font-body max-w-3xl mx-auto px-4 py-8 overflow-x-hidden">
      <Header onLeaderboard={() => setShowLeaderboard(!showLeaderboard)} showLeaderboard={showLeaderboard} />

      {/* Hero */}
      <section className="relative pt-28 pb-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#c9a227_0%,_transparent_60%)] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#1a0533_0%,_transparent_70%)] opacity-60 pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block text-[#c9a227] text-xs font-semibold tracking-[0.3em] uppercase mb-4 border border-[#c9a227]/30 px-4 py-1.5 rounded-full">
            🔴 Live Voting Open
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-4">
            VOTE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a227] via-[#f0d060] to-[#c9a227]">
              FAVOURITE
            </span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">
            ₦100 = 1 Vote · Every naira counts · Keep your star in the game
          </p>
        </div>
      </section>

      {/* Vote success toast */}
      {voteSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-[#c9a227] text-black px-6 py-3 rounded-2xl font-semibold shadow-2xl flex items-center gap-3">
            <span className="text-xl">🗳️</span>
            <span>+{voteSuccess.votes} votes added for <strong>{voteSuccess.name}</strong>!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {showLeaderboard ? (
          <Leaderboard participants={ranked} onVote={handleVote} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {displayList.map((p, i) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  rank={participants.some((x) => x.ranked) ? i + 1 : undefined}
                  onVote={() => handleVote(p)}
                />
              ))}
            </div>
            {displayList.length === 0 && (
              <div className="text-center py-32 text-white/30">
                <p className="text-4xl mb-4">🎭</p>
                <p>No participants available yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selected && (
        <VoteModal
          participant={selected}
          onClose={() => { setShowModal(false); setSelected(null); }}
          onPay={handlePayment}
        />
      )}
    </main>
  );
}
