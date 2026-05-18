# 🗺️ Workspace Directory Map — CareerForge Pro & AI Career Craft

Welcome to the comprehensive mapping of the workspace directory. This document outlines the structural layout, folders, files, and purposes of each directory in this codebase.

---

## 📂 Workspace Overview

The active workspace `c:\Users\swati\OneDrive\Attachments\Internship-files\Zalima-paidIntern\Zaalima-main` consists of three primary directories:

1. **`Zaalima-main/`** — **The Primary MERN Stack Application (CareerForge Pro)**
   * Built with React (Vite, TS) on the frontend and Express + Node + MongoDB on the backend.
   * Leverages LangChain, Google Gemini, and OpenRouter for AI Resume Generation, ATS Scoring, and Bullet Optimization.
2. **`ai-career-craft-63/`** — **The Secondary Supabase Sandbox Application**
   * Built with React + Vite + TypeScript + TailwindCSS + Supabase.
   * Focuses on premium client-side resume structuring using Shadcn UI.
3. **`frontend/`** — **Backup Frontend Assets**
   * Contains supplemental client-side assets and components.

---

## 🌳 Workspace Directory Tree

Below is the complete file and folder structure of this workspace, detailing the path and purpose of each node:

```text
workspace/
│
├── WORKSPACE_README.md            # The current workspace mapping guide (this file)
├── package.json                   # Root package configuration containing main dev dependencies
├── package-lock.json              # Lockfile for root-level modules
├── resume.pdf                     # Sample/test resume PDF document
│
├── Zaalima-main/                  # ====== CORE FULL-STACK APPLICATION (MERN) ======
│   ├── package.json               # Main startup script folder (runs concurrently backend & frontend)
│   ├── QUICKSTART.md              # 5-minute setup and developer onboarding guide
│   ├── README.md                  # Comprehensive core application documentation
│   │
│   ├── backend/                   # ⚡ Express Backend API (Port 9000)
│   │   ├── server.js              # Server entrypoint (CORS, Express, Mongoose, routes setup)
│   │   ├── .env                   # Local backend configuration (API keys, ports, DB URIs)
│   │   │
│   │   ├── controllers/           # Route handler controllers (business logic)
│   │   │   ├── aiController.js    # Routes Gemini/OpenRouter calls for rewriting & ATS scoring
│   │   │   ├── paymentController.jsx # Manages Razorpay & Stripe webhooks and checkout sessions
│   │   │   └── resumeController.jsx # Manages Mongoose Mongo save, fetch, and delete calls
│   │   │
│   │   ├── models/                # MongoDB Mongoose schemas
│   │   │   ├── User.js            # User accounts, billing tier (Pro/Free), and auth metadata
│   │   │   ├── Payment.js         # Transaction records (Stripe and Razorpay billing logs)
│   │   │   └── Resume.js          # Main schema holding full resume data (nested items)
│   │   │
│   │   ├── routes/                # API Route endpoints mapping to controllers
│   │   │   ├── aiRoutes.js        # AI actions: `/rewrite`, `/ats-score`, `/analyze-jd`
│   │   │   ├── pdfRoutes.js       # Puppeteer PDF layout generation: `/generate`
│   │   │   ├── renderRoutes.js    # JSON Resume theme rendering engine route
│   │   │   ├── resumeRoutes.js    # Resume persistence routes (save/load/delete)
│   │   │   └── paymentRoutes.js   # Razorpay and Stripe endpoint maps
│   │   │
│   │   ├── services/              # AI Agents and External Provider Integrations
│   │   │   ├── atsAIService.js    # Connects to Gemini for deep semantic ATS grading
│   │   │   ├── atsService.js      # Local regex/keyword count analyzer (fallback)
│   │   │   ├── coverLetterAgent.js # Prompt agents to write professional cover letters
│   │   │   ├── jdAgent.js         # Extracts keywords/skills from Job Descriptions
│   │   │   ├── pdfService.js      # Puppeteer runner to generate print-ready PDFs
│   │   │   ├── stripeService.js   # Stripe Checkout API and webhook handlers
│   │   │   └── universityAIService.js # Gemini-assisted college/university searches
│   │   │
│   │   └── utils/                 # Utility helpers
│   │       └── aiModel.js         # Centralized model provider (resolves Gemini vs OpenRouter keys)
│   │
│   └── frontend/                  # 🎨 Vite + React + TypeScript Frontend (Port 8080)
│       ├── index.html             # HTML entry document holding Google Font assets
│       ├── vite.config.ts         # Vite configuration (aliases, port setup)
│       ├── tailwind.config.ts     # Complete Tailwind styling system config
│       ├── .env                   # Client-side configuration (Supabase keys, backend API URL)
│       │
│       └── src/                   # React Source Directory
│           ├── main.tsx           # Primary React entry script
│           ├── App.tsx            # Routes mapping and auth validation wrappers
│           ├── index.css          # Vanilla global stylesheet holding theme design system
│           │
│           ├── pages/             # Major full-page view components
│           │   ├── ATS.tsx        # Deep semantic ATS scoring dashboard
│           │   ├── ResumeBuilder.tsx # Split-screen editor (form left, PDF preview right)
│           │   ├── CoverLetterBuilder.tsx # Live Cover Letter AI writing assistant
│           │   └── PortfolioBuilder.tsx # Converts resumes to live portfolio websites
│           │
│           ├── components/        # Reusable component widgets
│           │   ├── MagicButton.tsx # The Sparkles "Magic AI" button executing rewrites
│           │   ├── Autocomplete.tsx # Typeahead dropdown with Clearbit/Gemini endpoints
│           │   ├── UpgradeButton.tsx # Displays billing upgrading pathways
│           │   ├── resume/        # Resume form subsections (Personal, Exp, Edu, Skills)
│           │   └── ui/            # Pre-styled primitive widgets (button, input, card, dialog)
│           │
│           ├── hooks/             # Custom React Hooks
│           │   ├── useAuth.ts     # Interfaces with active authentication session
│           │   └── useResumeStorage.ts # Handles drafts and version control rollback states
│           │
│           ├── utils/             # Helper libraries
│           │   ├── atsAnalyzer.ts # Client-side grammar, word count, and keyword checkers
│           │   └── pdfExport.ts   # Renders canvases to PDFs or routes to backend Puppeteer
│           │
│           └── services/          # Client API Adapters
│               └── jsonResumeAdapter.ts # Adapts internal state to Schema Org JSON Resume formatting
│
└── ai-career-craft-63/            # ====== SUPABASE SANDBOX APP ======
    ├── package.json               # Sandbox package file
    ├── vite.config.ts             # Vite configuration
    ├── components.json            # Shadcn UI CLI installation paths
    ├── supabase/                  # supabase config and migrations
    └── src/                       # React frontend matching Shadcn presets
        ├── pages/                 # UI pages (Dashboard, Profile, Templates)
        └── components/            # Shadcn interactive modular elements
```

---

## ⚡ Running the Applications

### Core Full-Stack App (Zaalima-main)
To run the primary application (both backend on port `9000` and frontend on port `8080` concurrently):

```bash
# 1. Navigate to the core project directory
cd Zaalima-main

# 2. Run the concurrent developer script
npm run dev
```

### Sandbox App (ai-career-craft-63)
To run the sandbox React interface separately:

```bash
# 1. Navigate to the sandbox directory
cd ai-career-craft-63

# 2. Run the development server
npm run dev
```

---

> [!NOTE]
> * Make sure **MongoDB** is running locally on port `27017` before launching the backend server.
> * **Ollama** runs locally on port `11434` for local AI fallbacks.
> * The **OpenRouter** or **Gemini API** credentials should be supplied inside `Zaalima-main/backend/.env` for optimal AI operation.
