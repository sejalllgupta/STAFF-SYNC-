import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { userService } from '../../services/api';

interface EmployeeState {
  employees: User[];
  selectedEmployee: User | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  successMessage: null
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await userService.getUsers();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const createEmployeeThunk = createAsyncThunk(
  'employee/create',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const newUser = await userService.createUser(userData);
      return newUser;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployeeThunk = createAsyncThunk(
  'employee/update',
  async ({ id, updates }: { id: string; updates: Partial<User> }, { rejectWithValue }) => {
    try {
      const updated = await userService.updateUser(id, updates);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployeeThunk = createAsyncThunk(
  'employee/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete employee');
    }
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearEmployeeMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
        state.successMessage = 'Employee added successfully.';
      })
      // Update
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.employees = state.employees.map(e =>
          e._id === action.payload._id ? action.payload : e
        );
        state.successMessage = 'Employee record updated.';
      })
      // Delete
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.employees = state.employees.filter(e => e._id !== action.payload);
        state.successMessage = 'Employee removed from company records.';
      });
  }
});

export const { setSelectedEmployee, clearEmployeeMessages } = employeeSlice.actions;
export default employeeSlice.reducer;
