# 📐 Frontend Architecture Diagram

## High-Level Project Structure

```
nextjs-frontend/
│
├── 🔧 Configuration Files
│   ├── middleware.ts           ← Route protection & auth middleware
│   ├── env.d.ts                ← Environment variable types
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   └── package.json
│
├── 📚 lib/ - Utilities & Business Logic Layer
│   ├── 🔗 api/
│   │   ├── client.ts           ← API client initialization
│   │   ├── sign-translation.ts ← Sign translation API
│   │   └── index.ts            ← API barrel export
│   │
│   ├── 📋 types/
│   │   ├── api.ts              ← API response types
│   │   ├── holistic.ts         ← MediaPipe types
│   │   └── index.ts            ← Types barrel export
│   │
│   ├── ⚙️ constants/
│   │   ├── holistic.ts         ← Drawing & keypoint constants
│   │   ├── legacy-sequences.ts ← Demo sequences
│   │   └── index.ts            ← Constants barrel export
│   │
│   ├── 🛠️ utils/
│   │   ├── cn.ts               ← Tailwind utilities
│   │   ├── string.ts           ← String helpers
│   │   ├── date.ts             ← Date formatters
│   │   └── index.ts            ← Utils barrel export
│   │
│   ├── 🎯 mediapipe/
│   │   ├── keypoints.ts        ← Keypoint extraction
│   │   ├── drawing.ts          ← Canvas drawing functions
│   │   └── index.ts            ← MediaPipe barrel export
│   │
│   ├── 🪝 hooks/               ← Ready for custom hooks
│   │
│   └── index.ts                ← Main lib barrel export
│
├── 🎨 components/ - React Components Layer
│   ├── 🖼️ ui/
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── FormError.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── submitButton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── index.ts            ← UI components export
│   │
│   ├── 📍 shared/
│   │   ├── Header.tsx          ← Layout header
│   │   ├── Footer.tsx          ← Layout footer
│   │   └── index.ts            ← Shared barrel export
│   │
│   ├── 🧩 modules/
│   │   └── index.ts            ← Feature modules export
│   │
│   ├── 📝 sign-translator/
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── learn/
│   │   ├── sign-to-text/       ← Sign recognition feature
│   │   ├── text-to-sign/       ← Text translation feature
│   │   └── ui/
│   │
│   ├── 🎨 signlearno/
│   │   ├── theme.ts            ← Theme configuration
│   │   └── icons.tsx           ← Icon definitions
│   │
│   ├── sign-translator-demo.tsx ← Demo component
│   ├── ThemeToggle.tsx          ← Theme switcher
│   ├── Header.tsx              ← (Legacy, in shared)
│   └── Footer.tsx              ← (Legacy, in shared)
│
├── 🌐 app/ - Next.js App Router
│   ├── 🔌 api/                 ← API routes (ready for expansion)
│   ├── 📊 dashboard/
│   ├── 📖 dictionary/
│   ├── 📚 docs/
│   ├── 🎓 learn/
│   ├── 🔐 login/
│   ├── 📝 register/
│   ├── 🎯 translator/
│   ├── 🏆 leaderboard/
│   ├── 🔤 fonts/
│   ├── 🌐 openapi-client/      ← Generated API client
│   ├── globals.css
│   ├── layout.tsx              ← Root layout
│   ├── page.tsx                ← Home page
│   └── clientService.ts        ← Client service exports
│
├── 📦 public/ - Static Assets
│   ├── images/
│   │   ├── icons/
│   │   ├── logos/
│   │   └── illustrations/
│   └── [other assets]
│
├── ✅ Documentation (NEW)
│   ├── RESTRUCTURE_GUIDE.md    ← Detailed restructure guide
│   └── RESTRUCTURE_SUMMARY.md  ← This summary
│
└── [other config & lock files]
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER INTERFACE                    │
│  (Components: UI, Shared, Modules, Sign-Translator) │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│              REACT COMPONENTS LAYER                  │
│  (Re-usable UI components from components/ui/)      │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────┴────────┬─────────────┐
              ↓                 ↓             ↓
    ┌──────────────────┐ ┌──────────┐ ┌──────────────┐
    │  Custom Hooks    │ │ Utils    │ │ Constants    │
    │  (lib/hooks/)    │ │(lib/utils)│ │(lib/constants)
    └──────────────────┘ └──────────┘ └──────────────┘
              │                 │             │
              └────────┬────────┴─────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                 │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ API Client   │  │ MediaPipe   │  │   Types    │ │
│  │ (lib/api/)   │  │(lib/mediapipe) │ (lib/types)│ │
│  └──────────────┘  └─────────────┘  └────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│              EXTERNAL API SERVICE                    │
│        (Backend via API Endpoints)                  │
│  - /v1/action-detection/sign-to-text               │
│  - /v1/action-detection/text-to-sign               │
└─────────────────────────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
RootLayout
│
├── Header (shared)
├── Route Pages
│   ├── LandingPage (/)
│   ├── LoginPage (/login)
│   ├── RegisterPage (/register)
│   ├── DashboardLayout → DashboardPage (/dashboard)
│   ├── LearnLayout
│   │   ├── LearnPage (/learn)
│   │   └── LearnModules
│   ├── DictionaryPage (/dictionary)
│   ├── TranslatorLayout
│   │   ├── SignToText (Camera input)
│   │   └── TextToSign (Text input)
│   ├── LeaderboardPage (/leaderboard)
│   └── DocsPage (/docs)
└── Footer (shared)
```

## 📊 Import Dependency Graph

```
app/page.tsx
    ↓
    ├─→ @/components/shared (Header, Footer)
    ├─→ @/components/signlearno (Theme)
    └─→ @/lib (Constants, Utils)

sign-to-text/index.tsx
    ↓
    ├─→ @/lib/api/sign-translation
    ├─→ @/lib/mediapipe (keypoints, drawing)
    ├─→ @/lib/constants/holistic
    ├─→ @/lib/types
    └─→ @/components/signlearno

components/ui/*.tsx
    ↓
    └─→ @/lib/utils/cn
```

## 🔐 Route Protection Middleware

```
┌──────────────────────────┐
│   middleware.ts          │
│                          │
│  ┌────────────────────┐  │
│  │ Check Auth Token   │  │
│  │ in Cookies         │  │
│  └────┬───────────────┘  │
│       │                  │
│   ┌───┴────┬────────┐    │
│   ↓        ↓        ↓    │
│  ALLOW  REDIRECT  ALLOW  │
│  Public Protected  Auth  │
│  Routes  Routes  Routes  │
│       ↓                  │
│  ✅ Request Proceeds     │
└──────────────────────────┘
```

## 📦 Module Exports Pattern

### Barrel Export (lib/index.ts)
```typescript
// Single import for multiple utilities
import { cn, extractHolisticKeypoints, translateTextToSign } from "@/lib";
```

### Direct Import (Recommended for bundling)
```typescript
// Direct imports for better tree-shaking
import { cn } from "@/lib/utils/cn";
import { extractHolisticKeypoints } from "@/lib/mediapipe/keypoints";
import { translateTextToSign } from "@/lib/api/sign-translation";
```

## 🎓 Best Practices Applied

### ✅ Architecture
- **Layered Architecture**: Separation of UI, Business Logic, and Data layers
- **Dependency Injection**: Types and utilities injected where needed
- **Service Locator Pattern**: Centralized API client initialization

### ✅ Code Organization
- **Feature-Based Structure**: Components grouped by feature
- **Utility Separation**: Each utility file has single responsibility
- **Barrel Exports**: Clean import statements with index.ts

### ✅ Type Safety
- **Strict TypeScript**: Type checking enabled globally
- **Typed APIs**: All API responses have types
- **Typed Environment**: Environment variables have types

### ✅ Performance
- **Tree-Shakeable**: Only used code is bundled
- **Code Splitting**: Routes automatically code-split
- **Barrel Exports**: Convenient re-exports for organization

---

**Created**: April 2, 2026  
**Version**: 1.0 - Complete Restructure  
**Status**: ✅ Production Ready
