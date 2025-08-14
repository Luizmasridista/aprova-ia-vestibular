import '@testing-library/jest-dom';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock do window.location
const mockLocation = {
  ...window.location,
  href: '',
  search: '',
  hash: '',
  assign: jest.fn(),
};
Object.defineProperty(window, 'location', {
  writable: true,
  value: mockLocation,
});

// Mock do window.history
const mockHistory = {
  ...window.history,
  pushState: jest.fn(),
  replaceState: jest.fn(),
};
Object.defineProperty(window, 'history', {
  writable: true,
  value: mockHistory,
});
