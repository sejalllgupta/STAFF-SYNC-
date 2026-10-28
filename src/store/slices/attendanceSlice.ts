import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/api';

interface AttendanceState {
  todayAttendance: Attendance | null;
  hasClockedIn: boolean;
  hasClockedOut: boolean;
  myHistory: Attendance[];
  teamAttendance: Attendance[];
  companyAttendance: Attendance[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AttendanceState = {
  todayAttendance: null,
  hasClockedIn: false,
  hasClockedOut: false,
  myHistory: [],
  teamAttendance: [],
  companyAttendance: [],
  isLoading: false,
  error: null,
  successMessage: null
};

export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getToday();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch today attendance');
    }
  }
);

export const performClockIn = createAsyncThunk(
  'attendance/clockIn',
  async ({ workLocation, notes }: { workLocation: string; notes?: string }, { rejectWithValue }) => {
    try {
      const data = await attendanceService.clockIn({ workLocation, notes });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Clock in failed');
    }
  }
);

export const performClockOut = createAsyncThunk(
  'attendance/clockOut',
  async (notes: string | undefined, { rejectWithValue }) => {
    try {
      const data = await attendanceService.clockOut(notes);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Clock out failed');
    }
  }
);

export const fetchMyAttendanceHistory = createAsyncThunk(
  'attendance/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const list = await attendanceService.getMyHistory();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const fetchTeamAttendance = createAsyncThunk(
  'attendance/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      const list = await attendanceService.getTeamAttendance();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch team attendance');
    }
  }
);

export const fetchCompanyAttendance = createAsyncThunk(
  'attendance/fetchCompany',
  async (filters: { department?: string; date?: string; status?: string } | undefined, { rejectWithValue }) => {
    try {
      const list = await attendanceService.getCompanyAttendance(filters);
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch company attendance');
    }
  }
);

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendanceMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Today status
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.todayAttendance = action.payload.attendance;
        state.hasClockedIn = action.payload.hasClockedIn;
        state.hasClockedOut = action.payload.hasClockedOut;
      })
      // Clock in
      .addCase(performClockIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performClockIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasClockedIn = true;
        state.todayAttendance = action.payload.attendance;
        state.successMessage = action.payload.message;
        state.myHistory.unshift(action.payload.attendance);
      })
      .addCase(performClockIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clock out
      .addCase(performClockOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performClockOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasClockedOut = true;
        state.todayAttendance = action.payload.attendance;
        state.successMessage = action.payload.message;
      })
      .addCase(performClockOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // History
      .addCase(fetchMyAttendanceHistory.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      // Team
      .addCase(fetchTeamAttendance.fulfilled, (state, action) => {
        state.teamAttendance = action.payload;
      })
      // Company
      .addCase(fetchCompanyAttendance.fulfilled, (state, action) => {
        state.companyAttendance = action.payload;
      });
  }
});

export const { clearAttendanceMessages } = attendanceSlice.actions;
export default attendanceSlice.reducer;
