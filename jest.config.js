export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@models/(.*)$': '<rootDir>/src/app/models/$1',
    '^@pipes/(.*)$': '<rootDir>/src/app/pipes/$1',
    '^@directives/(.*)$': '<rootDir>/src/app/directives/$1',
    '^@guards/(.*)$': '<rootDir>/src/app/guards/$1',
    '^@interceptors/(.*)$': '<rootDir>/src/app/interceptors/$1',
    '^@modules/(.*)$': '<rootDir>/src/app/modules/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react-leaflet|@react-leaflet|@react-dnd|dnd-core|react-dnd-html5-backend|react-dnd-touch-backend|@react-dnd/invariant|react-dnd|react-dnd-test-backend|react-dnd-test-utils|@react-dnd/test-utils|@react-dnd/asap|@react-dnd/shallowequal)/)',
  ],
};
