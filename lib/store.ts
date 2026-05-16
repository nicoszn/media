import { Participant, defaultParticipants } from "./data";

const KEY = "showvote_participants";

export function loadParticipants(): Participant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveParticipants(participants: Participant[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(participants));
}

export function resetParticipants() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(defaultParticipants));
}
