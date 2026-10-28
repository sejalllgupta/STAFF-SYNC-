export type Role = 'employee' | 'manager' | 'hr';

export type Department =
  | 'Engineering'
  | 'Human Resources'
  | 'Marketing'
  | 'Sales'
  | 'Design'
  | 'Finance'
  | 'Operations';

export interface LeaveBalances {
  annual: number;
  sick: number;
  casual: number;
  unpaid: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  designation: string;
  managerId: string | null;
  phone: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  leaveBalances: LeaveBalances;
}

export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent';
export type WorkLocation = 'Office' | 'Remote' | 'Hybrid';

export interface Attendance {
  _id: string;
  userId: string;
  userName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  clockIn: string; // ISO string
  clockOut: string | null; // ISO string
  durationHours: number;
  status: AttendanceStatus;
  workLocation: WorkLocation;
  notes: string;
}

export type LeaveType = 'annual' | 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: Department;
  managerId: string | null;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  reviewedBy: string | null;
  reviewerRole: Role | null;
  reviewerComments: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: 'General' | 'Policy' | 'Urgent' | 'Event' | 'Holiday';
  priority: 'low' | 'medium' | 'high';
  targetDepartment: string;
  authorName: string;
  authorId: string;
  isPinned: boolean;
  createdAt: string;
}

export interface TrainingProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  score?: number;
  completedAt?: string;
}

export interface Training {
  _id: string;
  title: string;
  description: string;
  category: 'Compliance' | 'Technical' | 'Soft Skills' | 'Cybersecurity' | 'Leadership';
  duration: string;
  modulesCount: number;
  assignedRoles: Role[];
  userProgress: Record<string, TrainingProgress>;
  thumbnailUrl: string;
}

export interface PerformanceRatings {
  productivity: number; // 1-5
  teamwork: number;
  communication: number;
  innovation: number;
  leadership: number;
}

export interface Performance {
  _id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: Department;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: Role;
  reviewPeriod: string;
  ratings: PerformanceRatings;
  overallScore: number;
  strengths: string;
  areasForImprovement: string;
  goals: string[];
  feedback: string;
  status: 'draft' | 'submitted' | 'acknowledged';
  createdAt: string;
}

export interface HRReportsData {
  totalEmployees: number;
  activeToday: number;
  attendanceRate: number;
  onLeaveToday: number;
  pendingLeavesCount: number;
  departmentHeadcount: Record<string, number>;
  leaveStatsByType: Record<string, number>;
  attendanceSummary: {
    present: number;
    late: number;
    half_day: number;
    absent: number;
  };
  performanceAvgByDept: Record<string, number>;
}
