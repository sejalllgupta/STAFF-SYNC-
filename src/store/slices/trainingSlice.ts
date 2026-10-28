import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Training } from '../../types';
import { trainingService } from '../../services/api';

interface TrainingState {
  trainings: Training[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TrainingState = {
  trainings: [],
  isLoading: false,
  error: null,
  successMessage: null
};

export const fetchTrainings = createAsyncThunk(
  'training/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await trainingService.getAll();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const createTrainingThunk = createAsyncThunk(
  'training/create',
  async (data: Partial<Training>, { rejectWithValue }) => {
    try {
      const item = await trainingService.create(data);
      return item;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create training');
    }
  }
);

export const updateTrainingProgressThunk = createAsyncThunk(
  'training/updateProgress',
  async (
    { id, status, progressPercent, score }: { id: string; status: string; progressPercent?: number; score?: number },
    { rejectWithValue }
  ) => {
    try {
      const updated = await trainingService.updateProgress(id, status, progressPercent, score);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update progress');
    }
  }
);

export const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    clearTrainingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.trainings = action.payload;
      })
      .addCase(createTrainingThunk.fulfilled, (state, action) => {
        state.trainings.unshift(action.payload);
        state.successMessage = 'Training module added.';
      })
      .addCase(updateTrainingProgressThunk.fulfilled, (state, action) => {
        state.trainings = state.trainings.map(t =>
          t._id === action.payload._id ? action.payload : t
        );
        state.successMessage = 'Module progress saved.';
      });
  }
});

export const { clearTrainingMessages } = trainingSlice.actions;
export default trainingSlice.reducer;
