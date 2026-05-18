# Quick Start Guide — CareerForge Pro

## ⚡ 5-Minute Setup

### Step 1: Install All Dependencies

```bash
# From project root
npm run install:all
```

This installs packages for root, backend, and frontend.

### Step 2: Ensure MongoDB is Running

```bash
# If you have MongoDB installed locally:
mongod

# Or check if running on port 27017
```

If you don't have MongoDB yet, install it from https://www.mongodb.com/try/download/community

### Step 3: Start Both Servers

**Option A: Run Concurrently (Recommended)**

```bash
npm run dev
```

This starts backend on `http://localhost:5000` and frontend on `http://localhost:3000`

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 4: Open Your Browser

Navigate to **http://localhost:3000**

---

## 📋 What You Get

✅ **Split-screen editor** — Form on left, live preview on right
✅ **Real-time updates** — Every keystroke updates the preview
✅ **Auto-save** — Saves to MongoDB every 30 seconds (when typing)
✅ **Collapsible sections** — Expand/collapse form sections
✅ **Tag input** — Press Enter or comma to add skills
✅ **Professional template** — ATS-optimized resume design

---

## 🧪 Test the App

1. **Fill Personal Info**: Enter name, email, title
2. **Add Experience**: Click "Add Experience" and fill in a job
3. **Add Education**: Add a degree
4. **Add Skills**: Type skill + press Enter
5. **Watch the preview** on the right update in real-time!

---

## 🔍 Troubleshooting

### MongoDB Connection Failed

- Ensure MongoDB is running: `mongod`
- Check port 27017 is open
- Update `MONGODB_URI` in `backend/.env` if using remote DB

### Port Already in Use

If `localhost:3000` or `5000` is already in use:
- Change in `frontend/vite.config.js` (port: 3000)
- Change in `backend/.env` (PORT=5000)

### Changes Not Reflecting

1. Refresh the browser (Cmd+R / Ctrl+R)
2. Check browser console for errors (F12)
3. Check terminal output for server errors

---

## 📚 Useful Commands

```bash
# Start backend in watch mode
cd backend && npm run dev

# Start frontend dev server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# View built files
cd frontend && npm run preview
```

---

## 💾 Saving Your Resume

Your resume is **automatically saved** every 30 seconds while you're editing. You'll see:
- **Yellow dot** (●) = Unsaved changes
- **"Save Resume" button** in the top right

Click "Save Resume" anytime to manually save.

---

## 🎨 Customizing

- **Colors**: Edit `frontend/tailwind.config.js`
- **Fonts**: Update `frontend/index.html` Google Fonts link
- **Resume template**: Modify `frontend/src/components/LivePreview.jsx`

---

## ✨ Next Steps

1. ✅ Week 1 complete: Core builder is working
2. Week 2: Add authentication & multiple templates
3. Week 3: PDF export
4. Week 4: Polish & deployment

---

**Happy resume building! 🚀**
