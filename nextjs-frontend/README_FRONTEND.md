# SignLearn Frontend

A modern, responsive Next.js frontend for the SignLearn platform - an AI-powered sign language learning application.

## 🎯 Project Overview

SignLearn is a comprehensive platform that combines:
- **Real-time Sign Translation**: Uses MediaPipe Holistic for gesture recognition
- **Interactive Lessons**: Structured learning paths with multimedia content
- **Gamified Learning**: XP system, daily goals, and progress tracking
- **AI-Powered Feedback**: Accuracy metrics and personalized recommendations

## 📁 Project Structure

```
nextjs-frontend/
├── app/
│   ├── page.tsx                 # Main learning interface
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global styles and theme
│   ├── translator/
│   │   └── page.tsx            # Real-time translator page
│   ├── dashboard/
│   │   └── page.tsx            # Learning progress dashboard
│   ├── docs/
│   │   └── page.tsx            # Documentation/About page
│   ├── landing/
│   │   └── page.tsx            # Landing page
│   ├── fonts/                   # Custom fonts
│   └── openapi-client/          # Generated API clients
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Footer
│   ├── sign-translator-demo.tsx # Main translator component
│   ├── signlearno/
│   │   ├── theme.ts            # Design system theme
│   │   ├── icons.tsx           # Custom SVG icons
│   │   └── ...
│   ├── ui/                      # UI components (shadcn/ui)
│   └── ...
├── lib/
│   ├── sign-translation-api.ts  # API client functions
│   ├── clientConfig.ts          # API configuration
│   ├── holistic-keypoints.ts    # MediaPipe utilities
│   ├── mediapipe-drawing.ts     # Canvas drawing utilities
│   └── ...
├── public/
│   └── images/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.mjs

```

## 🎨 Design System

The project uses the **SignLearn Design System** with a cohesive color palette:

```
Primary Colors:
- Green (#58cc02) - Main brand color
- Blue (#1cb0f6) - Secondary accent
- Purple (#b779ff) - Tertiary accent
- Yellow (#ffc800) - Highlight/warning

Neutral Colors:
- Surface (#ffffff) - Background
- Text Strong (#4b4b4b) - Primary text
- Text Muted (#7b7b7b) - Secondary text
- Border (#e5e5e5) - Dividers
```

## 🚀 Features

### 1. **Learn Module** (/)
- Unit-based learning curriculum
- Interactive navigation through Guidebook
- Story, practice, and review sections
- XP tracking and daily goals

### 2. **Sign Translator** (/translator)
- Real-time webcam gesture detection
- Live sign-to-text translation
- Text-to-sign video generation
- Translation history and quick access

### 3. **Dashboard** (/dashboard)
- Learning progress visualization
- Weekly activity charts
- XP and streak tracking
- Recent activity timeline

### 4. **Landing Page** (/landing)
- Hero section with CTAs
- Feature highlights
- Statistics
- Call-to-action sections

### 5. **Documentation** (/docs)
- Platform overview
- Feature explanations
- Getting started guide

## 🔧 Technology Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS-in-JS
- **UI Components**: shadcn/ui + custom components
- **Vision**: MediaPipe Holistic for pose/gesture detection
- **State Management**: React Hooks
- **API Client**: OpenAPI generated client
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm 10.7.1+ (or npm/yarn)

### Install Dependencies
```bash
pnpm install
# or
npm install
```

### Environment Configuration
```bash
cp .env.example .env.local
# Edit .env.local with your API endpoint
```

**Required Environment Variables:**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000
```

### Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Build & Production

### Build for Production
```bash
pnpm build
# or
npm run build
```

### Start Production Server
```bash
pnpm start
# or
npm start
```

## 🧪 Testing

### Run Tests
```bash
pnpm test
# or
npm test
```

### Run Tests with Coverage
```bash
pnpm coverage
# or
npm run coverage
```

## 📝 Code Quality

### Linting
```bash
pnpm lint
# or
npm run lint
```

### Fix Linting Issues
```bash
pnpm lint:fix
# or
npm run lint:fix
```

### Format Code
```bash
pnpm prettier
# or
npm run prettier
```

### Type Checking
```bash
pnpm tsc
# or
npm run tsc
```

## 🔌 API Integration

The frontend communicates with the backend API:

### Key Endpoints

**Sign Recognition**
- `POST /v1/action-detection/sign-to-text`
  - Input: Array of keypoint sequences
  - Output: Recognized sign label and confidence

**Sign Generation**
- `POST /v1/action-detection/text-to-sign`
  - Input: Text in English
  - Output: Generated sign language video URL

## 🎬 MediaPipe Integration

The translator uses MediaPipe Holistic to detect:
- **Pose Landmarks**: Body position (33 points)
- **Hand Landmarks**: Finger positions (21 per hand)
- **Face Landmarks**: Facial expressions (468 points)

Combined these create a feature vector of ~1662 dimensions per frame.

## 📱 Responsive Design

The frontend is fully responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components use flexbox and CSS grid for responsive layouts.

## 🎯 Key Components

### Header
- Sticky navigation
- Active route highlighting
- User stats (XP, gems)
- Mobile menu

### Footer
- Multi-column link structure
- Social media links
- Copyright info
- Resource links

### SignTranslatorDemo
- Main learning interface with units
- Real-time translator
- Video generation
- Activity tracking

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MediaPipe Docs](https://developers.google.com/mediapipe)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting

### Camera Access Issues
- Ensure your browser has camera permissions
- Use HTTPS or localhost for production
- Check Windows Privacy settings for camera access

### API Connection Issues
- Verify backend is running on configured port
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure CORS is properly configured

### Build Issues
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `pnpm install --force`
- Check Node.js version: `node --version`

## 📄 License

See [LICENSE.txt](../../LICENSE.txt) for details.

## 👥 Contributors

SignLearn Development Team

## 📞 Support

For issues and questions, please refer to the [main README](../../README.md).
