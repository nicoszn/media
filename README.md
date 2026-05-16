# ShowVote 🗳️

> Entertainment game show voting platform. ₦100 = 1 Vote.

## Stack

- **Next.js 16.2.4** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Bebas Neue** (display) + **DM Sans** (body)
- **localStorage** for state persistence (no backend needed for demo)

## Getting Started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>

-----

## Routes

|Route   |Description                                         |
|--------|----------------------------------------------------|
|`/`     |Public voting page — participant cards + leaderboard|
|`/admin`|Admin panel (PIN: `1234`)                           |

-----

## Features

### Public Page (`/`)

- Participant cards with avatar, bio, state, socials, vote count
- Vote modal with ₦ amount selector (presets + custom input)
- ₦100 = 1 vote conversion
- Payment simulation (no real gateway — demo only)
- Live vote count update after payment
- Leaderboard view with % share bars
- Success toast on vote

### Admin Panel (`/admin`, PIN: `1234`)

- Stats dashboard (total participants, votes, leader)
- Add / Edit / Delete participants
- Toggle visibility (show/hide on public page)
- Toggle ranking (include/exclude from ranked sort)
- Override vote counts directly
- Stats tab with ranked bar chart view
- Reset to mock data

-----

## Iteration Notes (for next sprint)

- [ ] Replace simulated payment with real Paystack/Flutterwave integration
- [ ] Replace localStorage with a real DB (Neon Postgres + Drizzle ORM)
- [ ] Add auth middleware for `/admin` route (JWT or NextAuth)
- [ ] Add WebSocket or polling for real-time vote updates
- [ ] Add voting history / fan receipts
- [ ] Add SMS OTP verification before voting
- [ ] Add image upload for participant avatars (Cloudinary)
- [ ] Add voting deadline / countdown timer
