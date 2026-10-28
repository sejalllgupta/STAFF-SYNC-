import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HRReportsData } from '../../types';
import { reportService } from '../../services/api';

interface ReportState {
  stats: HRReportsData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  stats: null,
  isLoading: false,
  error: null
};

export const fetchReportStats = createAsyncThunk(
  'report/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await reportService.getDashboardStats();
      return stats;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch HR reports');
    }
  }
);

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchReportStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default reportSlice.reducer;
