# Practice Shadowing – Pro English BD

A modern, responsive web application for Bangladeshi Spoken English and IELTS students to improve pronunciation, fluency, listening, rhythm, confidence, speaking flow, vocabulary, and IELTS Speaking ability through a structured Shadowing Practice System.

## Features

### Core Shadowing System
- **Word Shadowing** - Single word practice with pronunciation hints
- **Phrase Shadowing** - Short phrase/chunk practice
- **Sentence Shadowing** - Full sentence practice
- **Context Shadowing** - IELTS-style connected speech

### 4-Step Shadowing Flow
1. **Listen Only** - Focus on natural sound and rhythm
2. **Listen + Read** - Read transcript while listening
3. **Speak Along** - Repeat together with audio
4. **Record & Compare** - Record own voice and compare

### Audio System
- British & Australian accent options
- Play/Pause/Resume controls
- 5-sec forward/backward skip
- Speed control (0.75x, 1x, 1.25x)
- Progress bar with timestamps

### Recording System
- Browser MediaRecorder API (100% free)
- Start/Stop/Replay/Download
- Save best attempt
- Unlimited retries
- Mobile compatible

### Self-Check System
- 1-5 star self-rating
- Practice checklist (rhythm, stress, pauses, clarity)
- No fake AI scoring

### Gamification
- Daily streak tracking
- XP points system
- Level progression
- Badge achievements
- Motivational messages (Bangla + English)

### Admin Panel (Complete Control)
- Manage categories, levels, modules, items
- Upload/manage audio files
- Manage students & batches
- Assign homework with deadlines
- Review student recordings
- CSV/JSON import/export
- Full analytics dashboard
- Platform settings

### Student Panel
- Dashboard with stats
- Practice page with 4-step flow
- My Recordings
- Sticky Notes vocabulary system
- Progress tracking
- Badges & achievements
- Homework tracking
- Profile page

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with HTTP-only cookies
- **Audio:** Browser MediaRecorder API
- **Styling:** Tailwind CSS with custom brand theme

## Brand Colors
- **Navy Blue:** #1a1a2e
- **Red:** #e63946
- **White:** #ffffff

## Setup Guide

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud - MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/shadowing-app.git
cd shadowing-app

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# Seed database with demo data
npm run seed

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/shadowing-app
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_NAME=Pro English BD
```

### Database Seeding

```bash
npm run seed
```

This creates:
- Demo admin account
- Demo student account
- 4 categories (Word, Phrase, Sentence, Context)
- 5 difficulty levels
- 4 modules
- 11 practice items with full Bangla translations

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@proenglishbd.com | admin123 |
| Student | student@proenglishbd.com | student123 |

## Folder Structure

```
src/
├── app/
│   ├── api/          # API routes
│   │   ├── auth/     # Login, Register, Session
│   │   ├── admin/    # Admin CRUD endpoints
│   │   └── student/  # Student endpoints
│   ├── admin/        # Admin panel pages
│   ├── student/      # Student panel pages
│   ├── auth/         # Login/Register pages
│   └── page.tsx      # Landing page
├── components/
│   ├── layout/       # Navbar, Sidebar
│   ├── practice/     # AudioPlayer, RecordingPanel, SelfCheck
│   └── ui/           # Reusable UI components
├── contexts/         # Auth context
├── hooks/            # Custom hooks
├── lib/              # DB connection, auth utilities
├── models/           # Mongoose schemas
└── middleware/       # Route protection
```

## Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Deploy to Railway/Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

## CSV Import Format

```csv
category,module,level,title,english_text,bangla_meaning,english_meaning,pronunciation_hint,vocabulary_notes,common_mistake,example_sentence,british_audio,australian_audio,tags,order,status
Word Shadowing,Day 1 - Basics,Beginner,improve,improve,উন্নত করা,to make better,im-PROOV,Common word,,I want to improve.,,,common,1,active
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/me` - Logout

### Admin
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/POST/PUT/DELETE /api/admin/levels`
- `GET/POST/PUT/DELETE /api/admin/modules`
- `GET/POST/PUT/DELETE /api/admin/items`
- `GET/PUT/DELETE /api/admin/students`
- `GET/POST/PUT/DELETE /api/admin/batches`
- `GET/POST/PUT/DELETE /api/admin/homework`
- `GET /api/admin/analytics`
- `POST /api/admin/import`

### Student
- `GET/POST /api/student/progress`
- `GET/POST /api/student/recordings`
- `GET/POST/DELETE /api/student/sticky-notes`
- `GET /api/student/badges`
- `GET /api/student/homework`

## License

MIT

## Credits

Built for **Pro English BD** - Helping Bangladeshi students master English speaking through structured shadowing practice.
