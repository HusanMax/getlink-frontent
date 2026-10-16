import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TOKEN_KEY } from '../../api/client';
import * as authApi from '../../api/auth';
import { getErrorMessage } from '../../api/client';
import type { Admin } from '../../types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthState {
  token: string | null;
  admin: Pick<Admin, 'id' | 'username'> | null;
  status: AuthStatus;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  admin: null,
  status: 'idle',
  initialized: false,
  error: null,
};

export const loginAdmin = createAsyncThunk<
  authApi.LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authApi.login(credentials.username, credentials.password);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loadSession = createAsyncThunk<Admin, void, { rejectValue: string }>(
  'auth/loadSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.admin = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.token = action.payload.accessToken;
        state.admin = action.payload.admin;
        state.initialized = true;
        localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? "Kirish amalga oshmadi.";
      })
      .addCase(loadSession.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.admin = { id: action.payload.id, username: action.payload.username };
        state.status = 'authenticated';
        state.initialized = true;
      })
      .addCase(loadSession.rejected, (state) => {
        state.token = null;
        state.admin = null;
        state.status = 'idle';
        state.initialized = true;
        localStorage.removeItem(TOKEN_KEY);
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
