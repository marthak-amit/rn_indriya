jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));

// Tests run against the built-in placeholder catalog so they stay deterministic regardless of synced site data.
jest.mock('@/data/generated/indriya.json', () => ({ fetchedAt: null, source: '', theme: {}, banners: [], collections: [], products: [] }), { virtual: false });
jest.mock('@/data/generated/images', () => ({ generatedImages: {} }));
