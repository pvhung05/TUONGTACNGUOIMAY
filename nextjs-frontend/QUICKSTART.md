# SignLearn Frontend - Quick Start Guide

Get the SignLearn frontend running in minutes!

## 🎯 Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: pnpm 10.7.1+ (recommended) or npm 9+
- **Backend**: SignLearn FastAPI backend running on http://localhost:8000

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd nextjs-frontend
pnpm install
```

### Step 2: Verify Environment
Check `.env.local` has the correct API endpoint:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000
```

### Step 3: Start Development Server
```bash
pnpm dev
```

🎉 Open http://localhost:3000 in your browser!

## 📍 Page Navigation

Once the development server is running, you can navigate to:

| Page | URL | Purpose |
|------|-----|---------|
| **Landing** | http://localhost:3000/landing | Hero page with features |
| **Learn** | http://localhost:3000/ | Main learning interface |
| **Translator** | http://localhost:3000/translator | Real-time sign translation |
| **Dashboard** | http://localhost:3000/dashboard | Learning progress |
| **Docs** | http://localhost:3000/docs | Documentation |

## 🎮 Testing the Features

### 1. Real-Time Translation
1. Go to **Translator** page
2. Click "Start Camera"
3. Allow camera access when prompted
4. Perform a sign gesture in front of the camera
5. See real-time translation and accuracy score

### 2. Learning Path
1. Go to **Learn** page
2. Browse through interactive lessons
3. Follow the learning path (Story → Lesson → Practice → Check → Review)
4. Track progress with XP system

### 3. View Progress
1. Go to **Dashboard**
2. See weekly activity chart
3. Check daily goal progress
4. View recent lesson completions

## 🛠️ Development Commands

### Common Development Tasks

```bash
# Start development server with hot-reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Check code quality
pnpm lint

# Format code with Prettier
pnpm prettier

# TypeScript type checking
pnpm tsc

# Generate OpenAPI client
pnpm generate-client
```

## 🔍 File Structure Quick Reference

Essential files to know:

```
nextjs-frontend/
├── app/
│   ├── page.tsx                    # Main learning page (/)
│   ├── translator/page.tsx         # Translator page
│   ├── dashboard/page.tsx          # Progress dashboard
│   ├── landing/page.tsx            # Landing page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Header.tsx                  # Navigation
│   ├── Footer.tsx                  # Footer
│   ├── sign-translator-demo.tsx    # Main translator component
│   └── signlearno/theme.ts         # Design system
└── lib/
    ├── sign-translation-api.ts     # API functions
    └── clientConfig.ts             # API configuration
```

## 🎨 Design System

The app uses a cohesive design system:

**Colors:**
- Primary: Green (#58cc02)
- Secondary: Blue (#1cb0f6)
- Accent: Orange (#ff9600)
- Highlight: Yellow (#ffc800)

**Typography:**
- Font: Inter (GeistVF)
- Responsive breakpoints: Mobile, Tablet, Desktop

**Components:**
- Cards with shadows
- Buttons with hover effects
- Icons from lucide-react
- Responsive grid layouts

## 🚨 Troubleshooting

### Camera Not Working
```
Solution:
1. Check browser camera permissions
2. Use HTTPS or localhost (not IP addresses)
3. Check Windows Settings → Privacy → Camera
4. Or check in Mac System Preferences
```

### API Connection Failed
```
Solution:
1. Start backend: cd fastapi_backend && python -m uvicorn app.main:app --reload
2. Check .env.local has correct URL
3. Verify backend is on http://localhost:8000
```

### Port 3000 Already in Use
```bash
# Use a different port
pnpm dev -- -p 3001

# Or kill the process
# On Windows: netstat -ano | findstr :3000
# On Mac/Linux: lsof -i :3000
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Or with npm
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learning Path

Start with these resources:

1. **Understand the App**
   - Read README_FRONTEND.md
   - Explore the landing page

2. **Try Core Features**
   - Test real-time translator
   - Complete a learning unit
   - View dashboard progress

3. **Explore Code**
   - Check `components/sign-translator-demo.tsx`
   - Review `lib/sign-translation-api.ts`
   - Study `components/signlearno/theme.ts`

4. **Customize**
   - Modify theme colors in `components/signlearno/theme.ts`
   - Add new pages in `app/` directory
   - Create new components in `components/`

## 🚀 Next Steps

### For Development
1. Make code changes in `components/`, `app/`, or `lib/`
2. Hot reload will automatically update
3. Use dev tools to debug (F12)

### For Deployment
1. Run `pnpm build` to build production
2. Run `pnpm start` to start production server
3. Deploy using Vercel or Docker

### For Backend Integration
1. Ensure backend API is running
2. Test API endpoints in `/docs` (http://localhost:8000/docs)
3. Update API functions in `lib/sign-translation-api.ts` as needed

## 📞 Getting Help

**Check API Status:**
```bash
curl http://localhost:8000/health
```

**View API Docs:**
- Navigate to http://localhost:8000/docs (Swagger UI)

**Debug Mode:**
- Open browser DevTools (F12)
- Check Console for errors
- Use Network tab to inspect API calls

## 💡 Pro Tips

1. **Hot Reload**: Changes save automatically - no restart needed
2. **Camera Testing**: Allow camera once, it remembers permission
3. **Responsive Design**: Test with browser DevTools device emulation (Ctrl+Shift+M)
4. **API Testing**: Use Swagger UI at backend /docs endpoint
5. **Code Formatting**: Auto-format with `pnpm prettier`

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MediaPipe](https://developers.google.com/mediapipe/solutions)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**You're all set! Start the dev server and begin exploring SignLearn! 🎉**

```bash
pnpm dev
```

Open http://localhost:3000/landing to get started!
