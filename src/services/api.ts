import axios from 'axios';
import {
  User,
  Attendance,
  LeaveRequest,
  Announcement,
  Training,
  Performance,
  HRReportsData
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor attaches JWT token from localStorage
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('staffsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default api;

// API Service functions
export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData: Partial<User> & { password?: string }) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  resetSeed: async () => {
    const res = await api.post('/auth/seed-reset');
    return res.data;
  }
};

export const userService = {
  getUsers: async () => {
    const res = await api.get('/users');
    return res.data.users as User[];
  },
  getUserById: async (id: string) => {
    const res = await api.get(`/users/${id}`);
    return res.data.user as User;
  },
  createUser: async (user: Partial<User>) => {
    const res = await api.post('/users', user);
    return res.data.user as User;
  },
  updateUser: async (id: string, updates: Partial<User>) => {
    const res = await api.put(`/users/${id}`, updates);
    return res.data.user as User;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};

export const attendanceService = {
  getToday: async () => {
    const res = await api.get('/attendance/today');
    return res.data;
  },
  clockIn: async (data: { workLocation: string; notes?: string }) => {
    const res = await api.post('/attendance/clock-in', data);
    return res.data;
  },
  clockOut: async (notes?: string) => {
    const res = await api.post('/attendance/clock-out', { notes });
    return res.data;
  },
  getMyHistory: async () => {
    const res = await api.get('/attendance/my-history');
    return res.data.history as Attendance[];
  },
  getTeamAttendance: async () => {
    const res = await api.get('/attendance/team');
    return res.data.teamAttendance as Attendance[];
  },
  getCompanyAttendance: async (filters?: { department?: string; date?: string; status?: string }) => {
    const res = await api.get('/attendance/company', { params: filters });
    return res.data.records as Attendance[];
  }
};

export const leaveService = {
  apply: async (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => {
    const res = await api.post('/leaves', data);
    return res.data;
  },
  getMyLeaves: async () => {
    const res = await api.get('/leaves/my');
    return res.data;
  },
  getTeamLeaves: async () => {
    const res = await api.get('/leaves/team');
    return res.data.leaves as LeaveRequest[];
  },
  getAllLeaves: async () => {
    const res = await api.get('/leaves/all');
    return res.data.leaves as LeaveRequest[];
  },
  updateStatus: async (id: string, status: string, comments?: string) => {
    const res = await api.patch(`/leaves/${id}/status`, { status, comments });
    return res.data;
  }
};

export const announcementService = {
  getAll: async () => {
    const res = await api.get('/announcements');
    return res.data.announcements as Announcement[];
  },
  create: async (data: Partial<Announcement>) => {
    const res = await api.post('/announcements', data);
    return res.data.announcement as Announcement;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  }
};

export const trainingService = {
  getAll: async () => {
    const res = await api.get('/trainings');
    return res.data.trainings as Training[];
  },
  create: async (data: Partial<Training>) => {
    const res = await api.post('/trainings', data);
    return res.data.training as Training;
  },
  updateProgress: async (id: string, status: string, progressPercent?: number, score?: number) => {
    const res = await api.patch(`/trainings/${id}/progress`, { status, progressPercent, score });
    return res.data.training as Training;
  }
};

export const performanceService = {
  getAll: async () => {
    const res = await api.get('/performance');
    return res.data.reviews as Performance[];
  },
  create: async (data: Partial<Performance>) => {
    const res = await api.post('/performance', data);
    return res.data.review as Performance;
  }
};

export const reportService = {
  getDashboardStats: async () => {
    const res = await api.get('/reports/dashboard-stats');
    return res.data.stats as HRReportsData;
  }
};
