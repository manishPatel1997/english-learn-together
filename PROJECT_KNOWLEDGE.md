# PROJECT_KNOWLEDGE.md
# English Learn Together — Full Architecture & Connection Map

> Generated: 2026-08-08 | Confidence: HIGH (traced from source code)
> DO NOT modify code before reading this document.

---

## 1. What This Project Does

**English Learn Together** is a Gujarati → English language learning web app.

Target users: Gujarati-speaking people who want to learn English.

Users can:
- Practice vocabulary (Gujarati ↔ English flashcards)
- Practice sentence translation (Gujarati → English typing)
- Read and analyze sentences with AI phonetic breakdown
- Practice a mixed mode (vocabulary + sentence)
- Review their mistakes
- Save favorites
- Track XP, streak, and daily progress
- Get AI explanations for wrong answers (Google Gemini)
- Admins can manage users and unlock sections

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router) |
| Frontend Language | TypeScript + React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Theme | next-themes |
| AI (Frontend) | Google Gemini via @google/genai |
| Backend Framework | Express.js (Node.js) |
| Backend Language | TypeScript |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Database | File-based JSON (`backend/data/db.json`) |
| Deployment (Backend) | Vercel (vercel.json) |

---

## 3. Project Structure

```
english-learn-together/
│
├── src/                          ← FRONTEND (Next.js)
│   ├── app/                      ← Next.js App Router pages
│   │   ├── layout.tsx            ← Root layout (fonts, providers, shell)
│   │   ├── page.tsx              ← Home → Dashboard
│   │   ├── vocabulary/           ← Vocabulary practice page
│   │   ├── sentence/             ← Sentence practice page
│   │   ├── sentence-reading/     ← AI sentence reading page
│   │   ├── mixed/                ← Mixed mode page
│   │   ├── progress/             ← Progress tracker page
│   │   ├── mistakes/             ← Mistakes review page
│   │   ├── favorites/            ← Favorites page
│   │   ├── settings/             ← Settings page
│   │   ├── admin/                ← Admin dashboard page
│   │   └── api/
│   │       └── ai/explain/       ← Next.js API route for Gemini AI
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── providers.tsx         ← Global React providers (Theme, Toast, Auth)
│   │   ├── auth/                 ← Auth UI components
│   │   │   ├── auth-landing-gate.tsx
│   │   │   └── auth-modal.tsx
│   │   ├── layout/               ← App shell + navigation
│   │   │   ├── app-shell.tsx     ← MASTER layout component
│   │   │   ├── top-navbar.tsx
│   │   │   ├── app-layout.tsx
│   │   │   ├── vocabulary-sub-nav.tsx
│   │   │   └── sentence-sub-nav.tsx
│   │   ├── beui/                 ← Custom UI component library
│   │   │   ├── bounce-sidebar.tsx
│   │   │   ├── ai-tutor-modal.tsx
│   │   │   ├── command-palette.tsx
│   │   │   ├── animated-toast-stack.tsx
│   │   │   ├── preview-rail.tsx
│   │   │   └── ... (18 total beui components)
│   │   └── views/                ← Page view components (main page content)
│   │       ├── dashboard-view.tsx
│   │       ├── vocabulary-practice-view.tsx
│   │       ├── sentence-practice-view.tsx
│   │       ├── sentence-reading-ai-view.tsx
│   │       ├── admin-view.tsx
│   │       ├── progress-view.tsx
│   │       ├── mistakes-view.tsx
│   │       ├── favorites-view.tsx
│   │       ├── settings-view.tsx
│   │       ├── result-view.tsx
│   │       ├── topic-select-view.tsx
│   │       └── practice-select-view.tsx
│   │
│   ├── context/
│   │   └── auth-context.tsx      ← Global auth state (user, token, login, logout)
│   │
│   ├── lib/
│   │   ├── api-client.ts         ← All fetch calls to Express backend
│   │   ├── gemini-client.ts      ← Calls to /api/ai/explain (Next.js route)
│   │   ├── storage.ts            ← localStorage: XP, streak, mistakes, favorites
│   │   ├── vocabulary-data.ts    ← Static + API vocabulary loader
│   │   └── utils.ts              ← Small utility helpers
│   │
│   └── data/                     ← Static JSON content files
│       ├── vocabulary.json
│       ├── adjectives_section.json
│       ├── phonetics_section.json
│       ├── relatives_section.json
│       ├── professionals_section.json
│       └── sentences.json
│
└── backend/                      ← BACKEND (Express.js)
    ├── src/
    │   ├── server.ts             ← Express app entry point
    │   ├── db/
    │   │   └── store.ts          ← File-based JSON database (DataStore class)
    │   ├── middleware/
    │   │   └── auth.ts           ← JWT middleware + generateToken + requireAdmin
    │   └── routes/
    │       ├── auth.ts           ← /api/auth/*
    │       ├── user.ts           ← /api/user/*
    │       ├── content.ts        ← /api/content/*
    │       ├── settings.ts       ← /api/settings/*
    │       ├── admin.ts          ← /api/admin/*
    │       └── notifications.ts  ← /api/notifications/*
    ├── data/
    │   └── db.json               ← The actual JSON database file (auto-created)
    └── vercel.json               ← Vercel deployment config
```

---

## 4. Application Architecture

```
BROWSER
   │
   ├── Next.js Frontend (port 3000)
   │     │
   │     ├── Pages (App Router)
   │     │     └── Each page renders a View component
   │     │
   │     ├── AppShell (layout wrapper)
   │     │     ├── Checks login → shows AuthLandingGate if not logged in
   │     │     ├── BounceSidebar (navigation)
   │     │     ├── TopNavbar
   │     │     ├── CommandPalette
   │     │     ├── AITutorModal
   │     │     └── PreviewRail
   │     │
   │     ├── AuthContext (global state)
   │     │     ├── user object
   │     │     ├── JWT token (stored in localStorage)
   │     │     └── unlockedSections array
   │     │
   │     ├── api-client.ts → calls Express backend
   │     ├── gemini-client.ts → calls /api/ai/explain (Next.js route)
   │     └── storage.ts → reads/writes localStorage
   │
   ├── Next.js API Route
   │     └── POST /api/ai/explain → Google Gemini API
   │
   └── Express Backend (port 5000)
         │
         ├── /api/auth/*     ← register, login, /me
         ├── /api/user/*     ← progress, unlocked sections
         ├── /api/content/*  ← vocabulary, sentences
         ├── /api/settings/* ← get/save user settings
         ├── /api/admin/*    ← list users, unlock sections
         └── /api/notifications/* ← get, mark-read
               │
               └── db.json (file-based JSON storage)
```

---

## 5. Pages / Route Map

| URL | Page File | View Component | Who Can Access |
|---|---|---|---|
| `/` | `app/page.tsx` | `DashboardView` | All logged-in |
| `/vocabulary` | `app/vocabulary/` | `VocabularyPracticeView` | Users with section unlocked |
| `/sentence` | `app/sentence/` | `SentencePracticeView` | Users with section unlocked |
| `/sentence-reading` | `app/sentence-reading/` | `SentenceReadingAiView` | All logged-in |
| `/mixed` | `app/mixed/` | `VocabularyPracticeView` or mixed | All logged-in |
| `/progress` | `app/progress/` | `ProgressView` | All logged-in |
| `/mistakes` | `app/mistakes/` | `MistakesView` | All logged-in |
| `/favorites` | `app/favorites/` | `FavoritesView` | All logged-in |
| `/settings` | `app/settings/` | `SettingsView` | All logged-in |
| `/admin` | `app/admin/` | `AdminView` | Admin role only |

**FACT:** Navigation is controlled by `NAV_ROUTES` in `app-shell.tsx`.

---

## 6. Feature Map

```
APPLICATION
│
├── AUTHENTICATION
│     ├── Register (POST /api/auth/register)
│     ├── Login (POST /api/auth/login)
│     └── Auto-restore session on boot (GET /api/auth/me)
│
├── VOCABULARY PRACTICE
│     ├── Select section (1-5 or All)
│     ├── Flashcard loop with typing
│     ├── XP earned per correct answer
│     ├── Mistakes saved to localStorage
│     └── Section unlock after exam
│
├── SENTENCE PRACTICE
│     ├── Topic selection
│     ├── Gujarati → English translation typing
│     ├── AI hint (Gemini)
│     ├── AI explain mistake (Gemini)
│     └── Progress saved to backend
│
├── SENTENCE READING (AI)
│     ├── Input a Gujarati sentence
│     └── AI returns phonetics, breakdown, grammar
│
├── MIXED MODE
│     └── Combination of vocabulary + sentence practice
│
├── PROGRESS TRACKER
│     ├── XP total
│     ├── Streak
│     ├── History of exam results (from backend)
│     └── Daily activity chart (from localStorage)
│
├── MISTAKES REVIEW
│     ├── Shows wrong answers from localStorage
│     └── Retry specific items
│
├── FAVORITES
│     ├── Saved from vocabulary or sentence cards
│     └── Stored in localStorage
│
├── SETTINGS
│     ├── Daily goal
│     ├── Auto-advance speed
│     ├── Sound on/off
│     ├── Theme (light/dark/system)
│     └── Custom Gemini API key
│
├── ADMIN DASHBOARD
│     ├── List all users + their stats
│     └── Manually unlock sections for any user
│
├── AI TUTOR (Global Modal)
│     └── Free-form Q&A with Gemini
│
├── COMMAND PALETTE
│     └── Quick keyboard navigation (Ctrl+1..9)
│
└── NOTIFICATIONS
      ├── Shown in TopNavbar
      ├── Auto-created when section unlocked
      └── Marked as read per user
```

---

## 7. User Flows

### 7.1 First Visit / Registration

```
User opens app
   │
   └── AppShell checks isLoggedIn (from AuthContext)
         │
         ├── isLoading=true → shows ThemeLoader spinner
         │
         └── isLoggedIn=false → shows AuthLandingGate
               │
               └── User clicks Register
                     │
                     └── AuthModal opens
                           │
                           └── User fills name, email, password
                                 │
                                 └── auth-context.tsx: register()
                                       │
                                       └── api-client.ts: POST /api/auth/register
                                             │
                                             └── backend/auth.ts: validates with Zod
                                                   │
                                                   ├── Check: email already exists?
                                                   │     └── 400 error if yes
                                                   │
                                                   ├── Hash password (bcrypt)
                                                   │
                                                   ├── First user → role=admin
                                                   │   Other users → role=user
                                                   │
                                                   ├── New user: unlockedSections=['section1', 'who_section']
                                                   │   Admin: all sections unlocked
                                                   │
                                                   ├── Save to db.json
                                                   │
                                                   └── Return JWT token + user object
                                                         │
                                                         └── auth-context:
                                                               ├── token saved to localStorage (key: elt_auth_token)
                                                               ├── user state updated
                                                               ├── unlockedSections updated
                                                               └── AuthModal closes → app shows
```

### 7.2 Returning User (Session Restore)

```
User opens app (has token in localStorage)
   │
   └── AuthContext: fetchUserOnBoot()
         │
         └── getStoredAuthToken() → found in localStorage
               │
               └── api-client.ts: GET /api/auth/me
                     │
                     └── backend: verifies JWT → returns user object
                           │
                           └── auth-context: user state set
                                 └── App shows (no login needed)
```

### 7.3 Vocabulary Practice Flow

```
User navigates to /vocabulary
   │
   └── VocabularyPracticeView loads
         │
         ├── Checks unlockedSections from AuthContext
         │
         ├── User selects a section (section1, section2, etc.)
         │
         ├── vocabulary-data.ts: fetchVocabularyFromApi(sectionId)
         │     ├── Tries: GET /api/content/vocabulary?sectionId=X
         │     │     └── backend/content.ts: db.getVocabulary(sectionId)
         │     └── Falls back to: static JSON files in src/data/
         │
         ├── Questions displayed one at a time (flashcard style)
         │
         ├── User types answer
         │     ├── Correct: XP earned, storage.addXP() → localStorage
         │     └── Wrong: storage.addMistake() → localStorage
         │
         └── After exam completion:
               ├── api-client.ts: POST /api/user/progress
               │     └── backend/user.ts:
               │           ├── Calculate score %
               │           ├── passed = score >= 80%
               │           ├── Update user XP in db.json
               │           ├── If passed: unlock next section
               │           └── If section unlocked: create notification
               │
               └── AuthContext.updateUnlockedSections() → local state updated
```

### 7.4 Sentence Practice Flow with AI

```
User navigates to /sentence
   │
   └── SentencePracticeView loads
         │
         ├── User selects topic
         │
         ├── api-client.ts: GET /api/content/sentences?topic=X
         │     └── backend/content.ts: db.getSentences(topic)
         │
         ├── User types English translation of Gujarati sentence
         │
         ├── User clicks "Hint"
         │     └── gemini-client.ts: requestGeminiAI({ action: 'get_hint', gujarati, topic })
         │           └── POST /api/ai/explain (Next.js route)
         │                 └── route.ts calls Google Gemini API
         │                       └── Returns 1-2 sentence hint
         │
         ├── User submits wrong answer
         │     └── gemini-client.ts: requestGeminiAI({ action: 'explain_mistake', ... })
         │           └── POST /api/ai/explain → Gemini explains the mistake
         │
         └── After exam:
               ├── storage.addXP() → localStorage
               ├── storage.addMistake() → localStorage (wrong answers)
               └── api-client.ts: POST /api/user/progress → backend
```

### 7.5 Section Unlock Flow

```
User completes exam
   │
   └── backend/user.ts: POST /api/user/progress
         │
         ├── scorePercentage = (correctAnswers / totalQuestions) * 100
         ├── passed = scorePercentage >= 80
         │
         └── If passed AND role != admin:
               │
               ├── SECTION_ORDER = ['section1', 'section2', 'section3', 'section4', 'section5']
               ├── Find current section index
               ├── nextSection = SECTION_ORDER[currentIndex + 1]
               │
               ├── If nextSection not yet in unlockedSections:
               │     ├── Add to unlockedSections
               │     ├── db.updateUser() → save to db.json
               │     └── db.addNotification() → "🔓 New Module Unlocked!"
               │
               └── If ALL 5 sections passed:
                     └── Add 'all' to unlockedSections
```

### 7.6 Admin Flow

```
Admin user navigates to /admin
   │
   └── AdminView loads
         │
         ├── api-client.ts: GET /api/admin/users
         │     └── backend/admin.ts:
         │           ├── authenticateToken (JWT check)
         │           ├── requireAdmin (role check)
         │           └── Returns all users + their stats (totalExams, avgScore, etc.)
         │
         └── Admin clicks "Unlock Section" for a user
               └── api-client.ts: POST /api/admin/unlock-section
                     └── backend/admin.ts:
                           ├── Updates user.unlockedSections in db.json
                           └── Creates notification for target user
```

---

## 8. Frontend Architecture

### 8.1 Provider Hierarchy (How React context wraps the app)

```
layout.tsx
  └── <Providers>
        └── <NextThemesProvider>   ← Theme (light/dark/system)
              └── <ToastProvider>  ← Toast notifications
                    └── <AuthProvider>  ← Auth state (user, token, unlockedSections)
                          ├── {children}   ← All pages
                          └── <AuthModal>  ← Login/Register popup
```

### 8.2 AppShell — The Master Layout

`src/components/layout/app-shell.tsx`

**Responsibility:** Gate, navigation, and shell around all pages.

```
AppShell
  │
  ├── reads: isLoggedIn, isLoading from useAuth()
  │
  ├── isLoading=true → <ThemeLoader> spinner
  │
  ├── isLoggedIn=false → <AuthLandingGate> (full-screen landing/login)
  │
  └── isLoggedIn=true → renders full app:
        ├── <BounceSidebar> (desktop sidebar)
        ├── Mobile drawer sidebar (Framer Motion)
        ├── <TopNavbar> (with notifications, AI tutor, command palette)
        ├── <main> {children} (page content)
        ├── <CommandPalette> (Ctrl+K or Ctrl+1..9 shortcuts)
        ├── <AITutorModal> (free-form Gemini Q&A)
        └── <PreviewRail> (word detail side panel)
```

### 8.3 State Management

**Two separate systems run in parallel:**

| Where | What is stored |
|---|---|
| `AuthContext` (React state) | user profile, JWT token, unlockedSections |
| `localStorage` via `storage.ts` | XP, streak, accuracy, mistakes, favorites, daily activity, exam drafts |

**IMPORTANT:** XP and streak exist in BOTH systems:
- `localStorage` (`gem_user_stats`) → used for sidebar display, local counting
- Backend `db.json` → used for permanent record and section unlocking

These can get out of sync if a user switches devices.

### 8.4 Navigation System

`NAV_ROUTES` in `app-shell.tsx` maps NavItem → URL:

```
dashboard        → /
vocabulary       → /vocabulary
sentence         → /sentence
sentence-reading → /sentence-reading
mixed            → /mixed
progress         → /progress
mistakes         → /mistakes
favorites        → /favorites
settings         → /settings
admin            → /admin
```

Keyboard shortcuts: `Ctrl/Meta/Alt + 1..9` navigate directly.

---

## 9. Backend Architecture

**Entry point:** `backend/src/server.ts` — Express app

### 9.1 Middleware Stack (per request)

```
Request
  │
  ├── CORS (universal — echoes origin back)
  ├── Manual CORS headers (for maximum compatibility)
  ├── express.json() (parse JSON body, 10mb limit)
  └── Route handler
        ├── authenticateToken (reads Bearer JWT → attaches req.user)
        └── requireAdmin (checks req.user.role === 'admin')
```

### 9.2 All API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login → returns JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |
| GET | `/api/user/unlocked-sections` | JWT | Get user's unlocked sections |
| GET | `/api/user/progress` | JWT | Get XP, streak, exam history |
| POST | `/api/user/progress` | JWT | Record exam result, earn XP, unlock sections |
| GET | `/api/content/vocabulary` | None | Get vocabulary (by sectionId) |
| GET | `/api/content/sentences` | None | Get sentences (by topic) |
| GET | `/api/settings` | JWT | Get user settings |
| POST | `/api/settings` | JWT | Save user settings |
| GET | `/api/admin/users` | JWT + Admin | List all users with stats |
| POST | `/api/admin/unlock-section` | JWT + Admin | Unlock sections for a user |
| GET | `/api/notifications` | JWT | Get unread notifications |
| PUT | `/api/notifications/read-all` | JWT | Mark all as read |
| PUT | `/api/notifications/:id/read` | JWT | Mark one as read |
| GET | `/api/health` | None | Health check |

### 9.3 JWT Token

- **Generated by:** `generateToken()` in `middleware/auth.ts`
- **Contains:** `{ userId, email, role }`
- **Expires:** 30 days
- **Secret:** `JWT_SECRET` env variable (falls back to hardcoded default)
- **Stored by frontend:** `localStorage` key `elt_auth_token`
- **Sent by frontend:** `Authorization: Bearer <token>` header

---

## 10. Database Architecture

**Type:** File-based JSON — **NOT** a real database server.

**File:** `backend/data/db.json`

**Class:** `DataStore` in `backend/src/db/store.ts`

The `DataStore` class loads `db.json` into memory on startup, and writes it back to disk on every mutation (using `fs.writeFileSync`).

### 10.1 Schema

```
db.json
  │
  ├── users: UserEntity[]
  │     ├── id
  │     ├── email
  │     ├── passwordHash
  │     ├── name
  │     ├── role: 'user' | 'admin'
  │     ├── unlockedSections: string[]
  │     ├── xp
  │     ├── streak
  │     └── createdAt
  │
  ├── progress: UserProgressEntity[]
  │     ├── id
  │     ├── userId
  │     ├── sectionId
  │     ├── examType
  │     ├── scorePercentage
  │     ├── totalQuestions
  │     ├── correctAnswers
  │     ├── passed
  │     └── timestamp
  │
  ├── settings: Record<userId, UserSettingsEntity>
  │     ├── dailyGoal (default: 10)
  │     ├── autoAdvanceMs (default: 700)
  │     ├── soundEnabled (default: true)
  │     ├── theme (default: 'light')
  │     └── geminiKey
  │
  ├── vocabulary: VocabEntity[]
  │     (seeded from JSON files via seed script)
  │
  ├── sentences: SentenceEntity[]
  │     (seeded from JSON files via seed script)
  │
  └── notifications: NotificationEntity[]
        ├── id
        ├── userId (or 'all' for broadcast)
        ├── title
        ├── message
        ├── type: 'module_unlock' | 'new_content' | 'achievement' | 'system'
        ├── readBy: string[] (userId array)
        └── createdAt
```

---

## 11. AI Integration

### 11.1 Gemini API — How it works

```
Frontend component (e.g. SentencePracticeView)
   │
   └── gemini-client.ts: requestGeminiAI({ action, gujarati, topic, ... })
         │
         └── POST /api/ai/explain  (Next.js server-side route)
               │
               ├── Reads API key:
               │     1. clientApiKey (from body, if user provided own key in Settings)
               │     2. process.env.GEMINI_API_KEY (server env)
               │     3. process.env.NEXT_PUBLIC_GEMINI_API_KEY
               │
               ├── Creates GoogleGenAI client
               │
               ├── Lists available Gemini models (flash/pro)
               │     Falls back to: ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']
               │
               ├── Tries each model until one succeeds
               │
               └── Returns text response
```

### 11.2 AI Actions

| Action | Used By | What it does |
|---|---|---|
| `explain_mistake` | SentencePracticeView, MistakesView | Explains why answer was wrong |
| `get_hint` | SentencePracticeView | Gives a subtle hint without full answer |
| `ask_tutor` | AITutorModal | Free-form English learning Q&A |
| `read_sentence` | SentenceReadingAiView | Full phonetic + grammar breakdown of a sentence |

---

## 12. Content / Data System

### 12.1 Vocabulary Content

Static JSON files live in `src/data/`:

| File | Section ID | Content |
|---|---|---|
| `vocabulary.json` | section1 | General vocabulary & core words |
| `adjectives_section.json` | section2 | Descriptive adjectives |
| `phonetics_section.json` | section3 | Phonetics & sound rules |
| `relatives_section.json` | section4 | Family relations |
| `professionals_section.json` | section5 | Professions & occupations |

**Load priority:**
1. Try `GET /api/content/vocabulary?sectionId=X` from Express backend
2. If fails (backend down) → fall back to static JSON imports

### 12.2 Sentence Content

- Source file: `src/data/sentences.json`
- Loaded via: `GET /api/content/sentences?topic=X`
- Filtered by: `topic` or `sectionKey` field

### 12.3 Section Unlock Order

```
section1 → section2 → section3 → section4 → section5 → (all)
  80%+       80%+       80%+       80%+       80%+     (all 5 done)
```

New users start with `['section1', 'who_section']` unlocked.
Admins start with ALL sections unlocked.

---

## 13. localStorage Keys

| Key | What it stores |
|---|---|
| `elt_auth_token` | JWT auth token |
| `gem_user_stats` | XP, streak, accuracy, totalAnswered, vocabularyLearned, etc. |
| `gem_mistakes` | Array of wrong answers for Mistakes page |
| `gem_favorites` | Array of favorited vocab/sentence items |
| `gem_activity` | Daily activity log `{ date, count, xp }[]` |
| `gem_exam_draft_<examId>` | Auto-saved exam progress (expires after 48h) |
| `selected_vocab_section_id` | Last selected vocabulary section |
| `gemini_api_key` | User's custom Gemini API key |
| `sidebar_collapsed` | Whether sidebar is collapsed |

---

## 14. Business Rules

### FACT: Section Unlock Threshold
```
IF scorePercentage >= 80 AND user.role != 'admin'
   THEN unlock next section in order
```

### FACT: First user is always admin
```
IF db.getUsers().length === 0
   THEN newUser.role = 'admin'
ELSE
   newUser.role = 'user'
```

### FACT: Admin has all sections from the start
```
IF role === 'admin'
   THEN unlockedSections = ALL_DEFAULT_ADMIN_SECTIONS
ELSE
   THEN unlockedSections = ['section1', 'who_section']
```

### FACT: Content routes require no authentication
```
GET /api/content/vocabulary  → no JWT needed
GET /api/content/sentences   → no JWT needed
```

### FACT: Admin routes require both JWT AND admin role
```
GET /api/admin/users         → JWT + role=admin required
POST /api/admin/unlock-section → JWT + role=admin required
```

### FACT: Notification is created on section unlock
```
IF newlyUnlockedSection != null
   THEN db.addNotification({ userId, title, message, type: 'module_unlock' })
```

### FACT: Notifications are filtered per user
```
A notification is shown to a user IF:
   notification.userId === userId OR notification.userId === 'all'
   AND userId NOT IN notification.readBy
```

### FACT: XP is calculated as
```
xpEarned = (provided xpEarned) OR (correctAnswers * 10)
newXp = user.xp + xpEarned
```

### FACT: Exam draft expires after 48 hours
```
IF Date.now() - draft.timestamp > 48 * 3600 * 1000
   THEN draft is deleted from localStorage
```

---

## 15. Data Flow: Vocabulary Exam (Complete)

```
User clicks Start Vocabulary Practice
   ↓
VocabularyPracticeView mounts
   ↓
fetchVocabularyFromApi('section1')
   ↓
GET /api/content/vocabulary?sectionId=section1
   ↓
backend: db.getVocabulary('section1') → filters vocabulary array
   ↓
returns VocabQuestion[]
   ↓
Questions stored in component state
   ↓
User sees Gujarati word, types English answer
   ↓
Answer checked client-side
   ↓
Correct:
   storage.addXP(10, true) → localStorage updated
   storage.recordActivity(10) → gem_activity updated

Wrong:
   storage.addXP(0, false) → streak reset
   storage.addMistake({...}) → gem_mistakes updated
   optionally: requestGeminiAI('explain_mistake') → AI explanation
   ↓
End of exam
   ↓
api-client.ts: POST /api/user/progress
   ↓
backend: calculates score, updates user XP, checks unlock
   ↓
If unlocked: notification created in db.json
   ↓
Response: { scorePercentage, passed, newlyUnlockedSection, unlockedSections }
   ↓
AuthContext.updateUnlockedSections(sections)
   ↓
ResultView shown with score + celebration confetti
```

---

## 16. Dependency Graph

```
AUTH (JWT + AuthContext)
   │
   ├── ALL protected API routes
   ├── AppShell (gate)
   ├── AdminView
   ├── NotificationsUI (in TopNavbar)
   └── SectionUnlock

UNLOCKED SECTIONS
   │
   ├── VocabularyPracticeView (section picker)
   └── SentencePracticeView (topic picker)

BACKEND DB (db.json)
   │
   ├── users
   ├── progress
   ├── settings
   ├── notifications
   ├── vocabulary (if seeded)
   └── sentences (if seeded)

localStorage
   │
   ├── DashboardView (stats display)
   ├── BounceSidebar (streak, XP, accuracy)
   ├── MistakesView
   ├── FavoritesView
   └── ProgressView (activity chart)

GEMINI AI
   │
   ├── SentencePracticeView (hint + explain)
   ├── MistakesView (explain)
   ├── SentenceReadingAiView (read_sentence)
   └── AITutorModal (ask_tutor)
```

---

## 17. Important Files (Quick Reference)

| File | Role |
|---|---|
| `src/context/auth-context.tsx` | Global auth state — change carefully |
| `src/lib/api-client.ts` | All backend API calls — change carefully |
| `src/lib/storage.ts` | All localStorage operations |
| `src/components/layout/app-shell.tsx` | Master layout + route guard |
| `src/app/api/ai/explain/route.ts` | Gemini proxy route |
| `backend/src/db/store.ts` | Database class — all data reads/writes |
| `backend/src/middleware/auth.ts` | JWT validation + admin guard |
| `backend/src/routes/user.ts` | Section unlock business logic |
| `backend/src/routes/auth.ts` | Registration (first user = admin rule) |
| `src/lib/vocabulary-data.ts` | Vocabulary data with fallback logic |

---

## 18. Known Limitations

1. **Database is a flat JSON file** — concurrent writes could corrupt data. No transactions.
2. **XP exists in two places** — localStorage AND backend. They can drift apart.
3. **No server-side session invalidation** — JWT tokens are valid for 30 days even if user is deleted from db.json.
4. **Vocabulary content route has no auth** — anyone can read all vocabulary without logging in.
5. **Gemini API key stored in localStorage** — not secure for production.
6. **`mongoose` is a dependency in backend/package.json** but is NOT used anywhere in the code. Only the file-based DataStore is used.
7. **Content (vocabulary/sentences) in db.json must be seeded separately** (`npm run seed` in backend). If db.json is empty, frontend falls back to static JSON.

---

## 19. Change-Safety Notes

### DO NOT change without checking all consumers:

| Thing to change | Check these first |
|---|---|
| JWT token format or secret | All protected API routes, frontend localStorage key |
| `unlockedSections` array structure | AdminView, AppShell, VocabularyPracticeView, SentencePracticeView, auth.ts, user.ts |
| `UserEntity` schema | db/store.ts, auth.ts, middleware/auth.ts, api-client.ts (UserProfile interface) |
| `SECTION_ORDER` in user.ts | All unlock logic, ALL_DEFAULT_ADMIN_SECTIONS in auth.ts |
| `storage.ts` localStorage keys | Every component reading stats, mistakes, favorites |
| `api-client.ts` request() function | All API calls throughout the app |
| `AppShell` NAV_ROUTES | All navigation calls, keyboard shortcuts |
| Gemini `action` strings | gemini-client.ts, route.ts, all calling components |

### UNLOCK THRESHOLD (80%) — business rule
```
SECTION_ORDER in backend/src/routes/user.ts line 8
UNLOCK_THRESHOLD_PERCENT in backend/src/routes/user.ts line 9
```
Changing this affects all existing and future users' unlock progress.

### FIRST USER = ADMIN — business rule
```
backend/src/routes/auth.ts line 64-66
```
If the db.json is deleted and recreated, the next registered user becomes admin.
