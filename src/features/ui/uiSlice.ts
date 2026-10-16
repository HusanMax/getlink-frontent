import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
  toasts: Toast[];
}

const STORAGE_THEME = 'rh_theme';

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_THEME) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

const initialState: UiState = {
  theme: initialTheme(),
  sidebarOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_THEME, action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_THEME, state.theme);
    },
    toggleSidebar(state, action: PayloadAction<boolean | undefined>) {
      state.sidebarOpen = action.payload ?? !state.sidebarOpen;
    },
    addToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
      },
      prepare(payload: { type: ToastType; message: string }) {
        return { payload: { id: nanoid(), ...payload } };
      },
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setTheme, toggleTheme, toggleSidebar, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
