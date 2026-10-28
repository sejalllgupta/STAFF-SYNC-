import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Announcement } from '../../types';
import { announcementService } from '../../services/api';

interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  isLoading: false,
  error: null,
  successMessage: null
};

export const fetchAnnouncements = createAsyncThunk(
  'announcement/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await announcementService.getAll();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncementThunk = createAsyncThunk(
  'announcement/create',
  async (data: Partial<Announcement>, { rejectWithValue }) => {
    try {
      const item = await announcementService.create(data);
      return item;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create announcement');
    }
  }
);

export const deleteAnnouncementThunk = createAsyncThunk(
  'announcement/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await announcementService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

export const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    clearAnnouncementMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload;
      })
      .addCase(createAnnouncementThunk.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
        state.successMessage = 'Company announcement posted.';
      })
      .addCase(deleteAnnouncementThunk.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a._id !== action.payload);
        state.successMessage = 'Announcement deleted.';
      });
  }
});

export const { clearAnnouncementMessages } = announcementSlice.actions;
export default announcementSlice.reducer;
