import { create } from 'zustand';

const getLocalStorageMessages = () => {
  const savedMessages = localStorage.getItem('fitgptMessages');
  return savedMessages ? JSON.parse(savedMessages) : [];
};

const saveMessagesToLocalStorage = (messages) => {
  localStorage.setItem('fitgptMessages', JSON.stringify(messages));
};

export const useFitGptStore = create((set) => ({
  messages: getLocalStorageMessages(), // Initialize messages from localStorage
  addMessages: (message) =>
    set((state) => {
      const updatedMessages = [...state.messages, message];
      saveMessagesToLocalStorage(updatedMessages); // Save to localStorage
      return { messages: updatedMessages };
    }),
  clearMessages: () => {
    set({ messages: [] });
    localStorage.removeItem('fitgptMessages'); // Clear from localStorage
  },
}));
