import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Performance } from '../../types';
import { performanceService } from '../../services/api';

interface PerformanceState {
  reviews: Performance[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PerformanceState = {
  reviews: [],
  isLoading: false,
  error: null,
  successMessage: null
};

export const fetchPerformanceReviews = createAsyncThunk(
  'performance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await performanceService.getAll();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createPerformanceReviewThunk = createAsyncThunk(
  'performance/create',
  async (data: Partial<Performance>, { rejectWithValue }) => {
    try {
      const review = await performanceService.create(data);
      return review;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    clearPerformanceMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(createPerformanceReviewThunk.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
        state.successMessage = 'Performance appraisal submitted.';
      });
  }
});

export const { clearPerformanceMessages } = performanceSlice.actions;
export default performanceSlice.reducer;
