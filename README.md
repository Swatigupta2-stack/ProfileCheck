# 🌟 CareerForge Pro — Resume Builder

A full-stack MERN application for building professional, ATS-optimized resumes with a real-time split-screen editor.

## 📋 Week 1 — Builder Core

This is the Week 1 implementation featuring:

### ✅ Implemented Features

1. **Resume Schema (MongoDB)**
   - Personal information (name, email, phone, location, LinkedIn, portfolio)
   - Professional summary (max 500 characters)
   - Experience entries with achievements array
   - Education entries with GPA
   - Skills organized by category (technical, soft, tools, languages)
   - Projects with technologies and links

2. **Live Preview UI (Split-Screen)**
   - 40% form panel on the left (collapsible sections)
   - 60% live preview on the right
   - Real-time updates as you type
   - Professional ATS-optimized resume template

3. **Full State Management (Redux)**
   - Redux Toolkit for centralized state
   - Actions for all resume sections
   - Dirty state tracking
   - Auto-save every 30 seconds
   - Manual save with status indicator

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Redux Toolkit + Tailwind CSS |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Build Tool | Vite 5 |

## 📁 Project Structure

```
careerforge/
├── package.json
├── README.md
│
├── backend/
│   ├── server.js              # Express + MongoDB setup
│   ├── models/Resume.js       # Mongoose schema
│   ├── routes/resumeRoutes.js # API routes
│   └── controllers/           # Business logic
│
└── frontend/
    ├── vite.config.js         # Vite + proxy config
    ├── index.html
    └── src/
        ├── main.jsx           # React entry
        ├── App.jsx            # Auto-save logic
        ├── store/
        │   ├── store.js       # Redux setup
        │   └── resumeSlice.js # All actions
        └── components/
            ├── ResumeBuilder.jsx  # Split-screen layout
            ├── FormPanel.jsx      # Collapsible sidebar
            ├── LivePreview.jsx    # ATS template
            ├── sections/
            │   ├── PersonalInfo.jsx
            │   ├── SummarySection.jsx
            │   ├── ExperienceSection.jsx
            │   ├── EducationSection.jsx
            │   ├── SkillsSection.jsx
            │   └── ProjectsSection.jsx
            └── common/
                └── TagInput.jsx
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** running on `localhost:27017` (or set `MONGODB_URI` env var)

### 1. Install Dependencies

```bash
# From careerforge/ root:
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start Backend

```bash
cd backend
npm run dev       # with nodemon (auto-reload)
# or
npm start         # production mode
```

Backend runs on **http://localhost:5000**

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on **http://localhost:3000**

> Vite proxies `/api/*` requests to the backend automatically.

### 4. Run Both Concurrently

From the root directory:

```bash
npm run dev
```

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/save` | Save/update resume |
| `GET` | `/api/resume/:id` | Get by MongoDB ID |
| `GET` | `/api/resume/user/:userId` | Get all user resumes |
| `DELETE` | `/api/resume/:id` | Delete resume |
| `GET` | `/health` | Health check |

## 🎨 Design System

- **Display Font**: Playfair Display (headings)
- **Body Font**: DM Sans (UI elements)
- **Mono Font**: JetBrains Mono (labels, tags)
- **Resume Font**: Source Serif 4 (printed preview)
- **Primary Color**: Forge Gold (`#a87830`)
- **Background**: Deep Ink (`#1a1a14`)

## 🔄 State Management

### Redux Actions

```js
import {
  updatePersonal,    // { firstName, lastName, email, ... }
  updateSummary,     // string (max 500)
  addExperience,     // no payload
  removeExperience,  // id
  updateExperience,  // { id, field, value }
  // ... and more for education, skills, projects
  markSaved,         // marks isDirty: false
  loadResume,        // full resume object
} from './store/resumeSlice';
```

### Auto-Save

- Saves to MongoDB every **30 seconds** if changes are pending
- Shows "● Unsaved changes" indicator
- Manual save button in header

## 📝 Features (Week 1)

✅ Resume Mongoose schema with all fields
✅ Express REST API (save, get, delete)
✅ Redux Toolkit slice with complete actions
✅ Split-screen layout (40/60)
✅ All form sections (Personal, Experience, Education, Skills, Projects)
✅ Collapsible form sections with smooth expand/collapse
✅ Live preview ATS template
✅ Auto-save every 30 seconds
✅ Manual save with dirty state indicator
✅ Tag input with keyboard support (Enter/comma)
✅ Real-time form → preview synchronization

## 🔧 Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/careerforge
PORT=5000
```

## 📦 Dependencies

**Backend:**
- express
- mongoose
- cors
- dotenv
- nodemon (dev)

**Frontend:**
- react
- @reduxjs/toolkit
- react-redux
- vite
- tailwindcss
- postcss
- autoprefixer



Project Documentation
Resume Builder – Interactive Web Application (Project 2)
Team Members & Contributions
NVL Balram: Frontend Developer (UI/UX Design)
Designed HTML structure, created responsive layout using CSS, styled UI components, integrated Google Fonts, ensured print-friendly design.
Swati Gupta: JavaScript Developer (Core Functionality)
Developed core functions like updateResume() and renderResume(), implemented real-time preview, handled DOM updates and rendering.
Asheesh: Dynamic Data & Form Handling Developer
Managed data structure, implemented add/remove for experience and education, handled dynamic forms and synchronization.
Paramanandham: Storage & Export Developer
Implemented localStorage saving, created export feature using Blob API, enabled HTML download functionality.
Project Modules
UI Design – Form and preview layout
Data Handling – Central data object management
Dynamic Sections – Experience & Education handling
Rendering Engine – Resume preview generation
Storage – LocalStorage saving
Export – HTML file download
Technologies Used
HTML5, CSS3, JavaScript (Vanilla JS)
Project Outcome
Developed a functional Resume Builder with real-time preview, dynamic sections, and export capability.

## 🎯 Next Steps (Future Weeks)

- [ ] Authentication & user accounts
- [ ] Template selection & customization
- [ ] PDF export
- [ ] Resume sharing & public links
- [ ] Custom color schemes
- [ ] Dark/light mode toggle
- [ ] Import from LinkedIn
- [ ] ATS score checker
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality

---

## 🤖 Week 2 — AI Writer & Optimization (The "Magic" Button)

This is the Week 2 implementation featuring AI-powered resume optimization with keyword extraction, intelligent rewriting, and ATS scoring.

---

### 👥 Team Members & Contributions (Week 2)

| Member | Role | Contributions |
|--------|------|---------------|
| **Swati Gupta** | Backend + AI Developer | Built Express server, MongoDB schema, LangChain + Gemini integration, JD Analysis API, AI Rewrite API, ATS Scoring Logic, Git branching & merging, API testing with curl |
| **NVL Balram** | Frontend Developer | UI integration for AI features, Magic Button component design, ATS score display UI, API response handling |
| **Asheesh** | Dynamic Data Handler | Resume data structure for AI processing, keyword integration with form fields, real-time score updates |
| **Paramanandham** | Storage & Export Developer | Save AI-optimized resumes, export optimized versions, localStorage for draft resumes |

---

### ✅ Implemented Features

#### 1. JD Analysis Agent (Keyword Extraction) - Swati
- Extracts ATS keywords from job descriptions using Google Gemini AI
- Semantic understanding of technical and soft skills
- Returns ranked keywords with latency tracking
- **Endpoint:** `POST /api/ai/analyze-jd`

#### 2. AI Rewrite Logic (Magic Button) - Swati + Balram
- Prompt engineering templates for professional resume rewriting
- Natural keyword integration without forced placement
- Returns rewritten bullet with original text and latency
- Frontend Magic Button component for one-click optimization
- **Endpoint:** `POST /api/ai/rewrite`

#### 3. ATS Scoring Logic - Swati + Asheesh
- Calculates keyword match percentage between resume and job description
- Identifies matched and missing keywords
- Returns score (0-100%) with detailed breakdown
- Real-time scoring as user types
- Highlights missing keywords in red
- **Endpoint:** `POST /api/ai/ats-score`

#### 4. Prompt Engineering Templates - Swati

| Template Type | Purpose | Example Keyword |
|---------------|---------|-----------------|
| Leadership | Authority & team management | "Leadership", "Mentoring" |
| Technical | Skill emphasis | "Python", "Machine Learning" |
| Achievement | Result-oriented | "Improved", "Delivered" |
| Collaboration | Team work | "Collaborated", "Coordinated" |

**Sample Prompt Template:**
