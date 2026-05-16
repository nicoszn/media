export interface Participant {
  id: string;
  fullName: string;
  nickname: string;
  avatar: string;
  bio: string;
  state: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  votes: number;
  visible: boolean;
  ranked: boolean;
}

export const defaultParticipants: Participant[] = [
  {
    id: "1",
    fullName: "Adaeze Okonkwo",
    nickname: "Queen Ada",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Ada&backgroundColor=b6e3f4",
    bio: "Fashion designer from Enugu. Bold, unapologetic, here to win.",
    state: "Enugu",
    instagram: "@queenada_ng",
    twitter: "@queenada",
    tiktok: "@queenada_official",
    votes: 12450,
    visible: true,
    ranked: true,
  },
  {
    id: "2",
    fullName: "Emeka Obi",
    nickname: "Big E",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Emeka&backgroundColor=ffd5dc",
    bio: "Comedian and music producer. Lagos to the world.",
    state: "Lagos",
    instagram: "@bige_official",
    twitter: "@big_e_ng",
    votes: 9830,
    visible: true,
    ranked: true,
  },
  {
    id: "3",
    fullName: "Fatima Al-Hassan",
    nickname: "Tima",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Fatima&backgroundColor=d1f7c4",
    bio: "Dancer and entrepreneur from Abuja. Grace under fire.",
    state: "Abuja",
    instagram: "@tima_dances",
    twitter: "@fatima_tima",
    tiktok: "@tima_ng",
    votes: 11200,
    visible: true,
    ranked: true,
  },
  {
    id: "4",
    fullName: "Kelvin Adeyemi",
    nickname: "K-Boy",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Kelvin&backgroundColor=ffe4b5",
    bio: "Fitness coach and content creator. Ibadan bred, world ready.",
    state: "Oyo",
    instagram: "@kboy_fit",
    votes: 7600,
    visible: true,
    ranked: true,
  },
  {
    id: "5",
    fullName: "Ngozi Eze",
    nickname: "Glow",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Ngozi&backgroundColor=c9e8ff",
    bio: "Makeup artist and influencer. Making beauty mean something.",
    state: "Rivers",
    instagram: "@glow_by_ngozi",
    twitter: "@ngozi_glow",
    votes: 14100,
    visible: true,
    ranked: true,
  },
  {
    id: "6",
    fullName: "Tunde Badmus",
    nickname: "Thunder",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Tunde&backgroundColor=f4c2c2",
    bio: "Ex-footballer turned motivational speaker. Kano's finest.",
    state: "Kano",
    twitter: "@tunde_thunder",
    votes: 8950,
    visible: true,
    ranked: true,
  },
  {
    id: "7",
    fullName: "Sola Martins",
    nickname: "Solo",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Sola&backgroundColor=e8d5ff",
    bio: "Software engineer and DJ. Port Harcourt's tech boy.",
    state: "Rivers",
    instagram: "@solo_coded",
    tiktok: "@solomartins",
    votes: 6300,
    visible: true,
    ranked: true,
  },
  {
    id: "8",
    fullName: "Amaka Nwosu",
    nickname: "Mama Drama",
    avatar: "https://api.dicebear.com/9.x/personas/svg?seed=Amaka&backgroundColor=ffecd2",
    bio: "Actress and mother of three. Real, raw, and unstoppable.",
    state: "Anambra",
    instagram: "@mamadrama_official",
    votes: 10750,
    visible: true,
    ranked: true,
  },
];
