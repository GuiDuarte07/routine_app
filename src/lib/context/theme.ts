import { create } from 'zustand';

interface DarkModeStates {
  darkMode: boolean;
}

interface DarkModeActions {
  toggleDarkMode: () => void;
}

const useDarkModeStore = create<DarkModeStates & DarkModeActions>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

export default useDarkModeStore;
