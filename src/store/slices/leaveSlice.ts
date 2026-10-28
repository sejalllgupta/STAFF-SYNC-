import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRequest, LeaveBalances } from '../../types';
import { leaveService } from '../../services/api';

interface LeaveState {
  myLeaves: LeaveRequest[];
  teamLeaves: LeaveRequest[];
  allLeaves: LeaveRequest[];
  balances: LeaveBalances | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: LeaveState = {
  myLeaves: [],
  teamLeaves: [],
  allLeaves: [],
  balances: null,
  isLoading: false,
  error: null,
  successMessage: null
};

export const applyForLeave = createAsyncThunk(
  'leave/apply',
  async (
    data: { leaveType: string; startDate: string; endDate: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await leaveService.apply(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit leave request');
    }
  }
);

export const fetchMyLeaves = createAsyncThunk(
  'leave/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await leaveService.getMyLeaves();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leaves');
    }
  }
);

export const fetchTeamLeaves = createAsyncThunk(
  'leave/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      const list = await leaveService.getTeamLeaves();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch team leaves');
    }
  }
);

export const fetchAllLeaves = createAsyncThunk(
  'leave/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await leaveService.getAllLeaves();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch all leaves');
    }
  }
);

export const updateLeaveStatusThunk = createAsyncThunk(
  'leave/updateStatus',
  async (
    { id, status, comments }: { id: string; status: string; comments?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await leaveService.updateStatus(id, status, comments);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update leave status');
    }
  }
);

export const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaveMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyForLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForLeave.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.myLeaves.unshift(action.payload.leave);
      })
      .addCase(applyForLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch my
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.myLeaves = action.payload.leaves;
        if (action.payload.balances) {
          state.balances = action.payload.balances;
        }
      })
      // Fetch team
      .addCase(fetchTeamLeaves.fulfilled, (state, action) => {
        state.teamLeaves = action.payload;
      })
      // Fetch all
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.allLeaves = action.payload;
      })
      // Update status
      .addCase(updateLeaveStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload.leave;
        state.successMessage = action.payload.message;
        // update in all lists
        state.myLeaves = state.myLeaves.map(l => (l._id === updated._id ? updated : l));
        state.teamLeaves = state.teamLeaves.map(l => (l._id === updated._id ? updated : l));
        state.allLeaves = state.allLeaves.map(l => (l._id === updated._id ? updated : l));
      });
  }
});

export const { clearLeaveMessages } = leaveSlice.actions;
export default leaveSlice.reducer;
