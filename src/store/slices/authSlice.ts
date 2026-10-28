import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '../../types';
import { authService } from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('staffsync_token');
const initialUserJson = localStorage.getItem('staffsync_user');
let parsedUser: User | null = null;
if (initialUserJson) {
  try {
    parsedUser = JSON.parse(initialUserJson);
  } catch (e) {
    parsedUser = null;
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: initialToken,
  role: parsedUser ? parsedUser.role : null,
  isAuthenticated: !!initialToken && !!parsedUser,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: Partial<User> & { password?: string }, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed.');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      return data.user;
    } catch (err: any) {
      return rejectWithValue('Session expired or invalid.');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('staffsync_token');
      localStorage.removeItem('staffsync_user');
    },
    setDemoUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
      // Synthesize a valid demo token
      const demoToken = `demo_token_${action.payload.role}_${Date.now()}`;
      state.token = demoToken;
      localStorage.setItem('staffsync_token', demoToken);
      localStorage.setItem('staffsync_user', JSON.stringify(action.payload));
    },
    updateUserProfileState: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      localStorage.setItem('staffsync_user', JSON.stringify(action.payload));
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        localStorage.setItem('staffsync_token', action.payload.token);
        localStorage.setItem('staffsync_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
        localStorage.setItem('staffsync_token', action.payload.token);
        localStorage.setItem('staffsync_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch me
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        localStorage.setItem('staffsync_user', JSON.stringify(action.payload));
      });
  }
});

export const { logout, setDemoUser, updateUserProfileState, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
