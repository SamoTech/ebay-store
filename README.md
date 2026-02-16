# 🛍️ DealsHub - Your Ultimate eBay Deals Finder

> Find the best deals on eBay with AI-powered search and real-time price tracking.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

🔗 **Live Demo:** [https://ebay-store.vercel.app](https://ebay-store.vercel.app)

---

## ✨ Features

- 🔍 **Smart Search** - AI-powered product search across eBay
- 💰 **Best Deals** - Real-time price tracking and deal alerts
- 🤖 **AI Chatbot** - Get personalized shopping recommendations
- 📧 **Newsletter** - Subscribe for exclusive deals and updates
- 🌙 **Dark Mode** - Beautiful UI with light/dark themes
- ⚡ **Fast Performance** - Built with Next.js 16 and Turbopack
- 📱 **Responsive** - Works on all devices

---

## 🚀 Installation

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SamoTech/ebay-store.git
   cd ebay-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Note: Uses `--legacy-peer-deps` configured in `.npmrc` for React 19 compatibility.

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `WEB3FORMS_ACCESS_KEY` - Newsletter service
   - `EBAY_APP_ID` - eBay Partner Network
   - `NEXT_PUBLIC_GA_ID` - Google Analytics

4. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Run tests:**
   ```bash
   npm test
   ```

### Build for Production

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

See [Testing Guide](docs/TESTING_GUIDE.md) for details.

---

## 📁 Project Structure

```
ebay-store/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── newsletter/    # Newsletter subscription
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── NewsletterPopup.tsx
│   └── ...
├── contexts/              # React contexts
├── lib/                   # Utilities
│   ├── env.ts            # Environment validation
│   ├── rate-limit.ts     # Rate limiting
│   └── analytics.ts      # Analytics
├── __tests__/            # Test files
│   └── api/
├── docs/                 # Documentation
│   └── TESTING_GUIDE.md
├── public/               # Static assets
└── styles/               # Global styles
```

---

## 🔧 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS

### Backend
- **Next.js API Routes** - Serverless functions
- **eBay API** - Product data
- **Web3Forms** - Newsletter service

### Testing
- **Jest** - Test framework
- **React Testing Library** - Component testing
- **Coverage** - 80%+ target

### DevOps
- **Vercel** - Deployment and hosting
- **GitHub** - Version control
- **ESLint** - Code quality

---

## 📚 Documentation

- [Testing Guide](docs/TESTING_GUIDE.md) - How to write and run tests
- [Security Fixes](SPRINT_SECURITY_FIXES.md) - Phase 1 security improvements
- [Testing Infrastructure](PHASE_2_TESTING.md) - Phase 2 testing setup

---

## 🛡️ Security

- ✅ No API keys exposed in client-side code
- ✅ Environment variable validation
- ✅ Rate limiting on public APIs
- ✅ Input sanitization and validation
- ✅ Secure server-side API routes

---

## 🧪 Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

**Current Coverage:** 25%+ (growing)

**Test Suites:**
- Newsletter API (14 tests) ✅
- Rate Limiting (pending)
- Components (pending)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Write tests for new features
4. Ensure all tests pass (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing`)
7. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Ossama Hashim** (SamoTech)
- GitHub: [@SamoTech](https://github.com/SamoTech)
- Email: samo.hossam@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- eBay for the Partner Network API
- Vercel for hosting and deployment

---

**Made with ❤️ using Next.js 16 & React 19**
