// Jest setup — must stay valid JavaScript (this file is only transformed, not
// type-checked, so TypeScript syntax such as `as any` breaks the whole suite).
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Node-environment suites (API routes, server helpers) run this file too, so
// DOM-only globals are installed only when a window exists.
const hasDom = typeof window !== 'undefined';

// Mock window.matchMedia
if (hasDom) Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Functional in-memory localStorage (jsdom's implementation is not always
// available in the test environment, and jest.fn() no-ops hide real bugs).
const localStorageStore = new Map();

const localStorageMock = {
  getItem: (key) => (localStorageStore.has(String(key)) ? localStorageStore.get(String(key)) : null),
  setItem: (key, value) => {
    localStorageStore.set(String(key), String(value));
  },
  removeItem: (key) => {
    localStorageStore.delete(String(key));
  },
  clear: () => {
    localStorageStore.clear();
  },
  key: (index) => Array.from(localStorageStore.keys())[index] ?? null,
  get length() {
    return localStorageStore.size;
  },
};

if (hasDom) {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
}

global.localStorage = localStorageMock;

beforeEach(() => {
  localStorageStore.clear();
});

// Silence the noisiest expected console output, but let real errors through.
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    const first = typeof args[0] === 'string' ? args[0] : '';
    if (
      first.includes('Warning: ReactDOM.render') ||
      first.includes('Not implemented: HTMLFormElement.prototype.submit') ||
      first.includes('Not implemented: navigation')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    const first = typeof args[0] === 'string' ? args[0] : '';
    if (first.includes('Not implemented: navigation')) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
