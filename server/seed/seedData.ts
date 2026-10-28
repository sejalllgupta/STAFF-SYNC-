import bcrypt from 'bcryptjs';
import { User, Attendance, LeaveRequest, Announcement, Training, Performance } from '../models/types';

export const getHashedPassword = (password: string = 'StaffSync@2026') => {
  return bcrypt.hashSync(password, 10);
};

export const INITIAL_USERS: User[] = [
  {
    _id: 'usr_hr_01',
    name: 'Eleanor Vance',
    email: 'hr@staffsync.com',
    password: getHashedPassword(),
    role: 'hr',
    department: 'Human Resources',
    designation: 'Head of People & Culture',
    managerId: null,
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-01-15',
    status: 'active',
    leaveBalances: { annual: 24, sick: 12, casual: 6, unpaid: 0 }
  },
  {
    _id: 'usr_mgr_eng',
    name: 'Marcus Sterling',
    email: 'manager@staffsync.com',
    password: getHashedPassword(),
    role: 'manager',
    department: 'Engineering',
    designation: 'VP of Engineering',
    managerId: 'usr_hr_01',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-03-01',
    status: 'active',
    leaveBalances: { annual: 20, sick: 10, casual: 5, unpaid: 0 }
  },
  {
    _id: 'usr_mgr_mkt',
    name: 'Sophia Chen',
    email: 'sophia.chen@staffsync.com',
    password: getHashedPassword(),
    role: 'manager',
    department: 'Marketing',
    designation: 'Marketing Director',
    managerId: 'usr_hr_01',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-05-12',
    status: 'active',
    leaveBalances: { annual: 18, sick: 10, casual: 5, unpaid: 0 }
  },
  {
    _id: 'usr_emp_01',
    name: 'Alex Rivera',
    email: 'employee@staffsync.com',
    password: getHashedPassword(),
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    managerId: 'usr_mgr_eng',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-02-01',
    status: 'active',
    leaveBalances: { annual: 16, sick: 9, casual: 4, unpaid: 0 }
  },
  {
    _id: 'usr_emp_02',
    name: 'David Kim',
    email: 'david.kim@staffsync.com',
    password: getHashedPassword(),
    role: 'employee',
    department: 'Engineering',
    designation: 'Backend Cloud Specialist',
    managerId: 'usr_mgr_eng',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-06-15',
    status: 'active',
    leaveBalances: { annual: 18, sick: 11, casual: 5, unpaid: 0 }
  },
  {
    _id: 'usr_emp_03',
    name: 'Maya Patel',
    email: 'maya.patel@staffsync.com',
    password: getHashedPassword(),
    role: 'employee',
    department: 'Marketing',
    designation: 'Content & Brand Strategist',
    managerId: 'usr_mgr_mkt',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-08-01',
    status: 'on_leave',
    leaveBalances: { annual: 12, sick: 7, casual: 2, unpaid: 0 }
  },
  {
    _id: 'usr_emp_04',
    name: 'Liam O’Connor',
    email: 'liam.o@staffsync.com',
    password: getHashedPassword(),
    role: 'employee',
    department: 'Design',
    designation: 'Lead UI/UX Designer',
    managerId: 'usr_mgr_eng',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-04-10',
    status: 'active',
    leaveBalances: { annual: 15, sick: 8, casual: 4, unpaid: 0 }
  }
];

// Helper to format ISO date strings for today and previous days
const getDayOffset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    _id: 'att_01',
    userId: 'usr_emp_01',
    userName: 'Alex Rivera',
    department: 'Engineering',
    date: getDayOffset(0),
    clockIn: `${getDayOffset(0)}T09:05:00.000Z`,
    clockOut: null,
    durationHours: 0,
    status: 'present',
    workLocation: 'Office',
    notes: 'In-office desk 4B, working on microservices refactor.'
  },
  {
    _id: 'att_02',
    userId: 'usr_emp_02',
    userName: 'David Kim',
    department: 'Engineering',
    date: getDayOffset(0),
    clockIn: `${getDayOffset(0)}T08:55:00.000Z`,
    clockOut: null,
    durationHours: 0,
    status: 'present',
    workLocation: 'Remote',
    notes: 'Home office, pairing with Alex on GraphQL schema.'
  },
  {
    _id: 'att_03',
    userId: 'usr_mgr_eng',
    userName: 'Marcus Sterling',
    department: 'Engineering',
    date: getDayOffset(0),
    clockIn: `${getDayOffset(0)}T08:30:00.000Z`,
    clockOut: null,
    durationHours: 0,
    status: 'present',
    workLocation: 'Office',
    notes: 'Quarterly planning and 1:1 syncs.'
  },
  {
    _id: 'att_04',
    userId: 'usr_hr_01',
    userName: 'Eleanor Vance',
    department: 'Human Resources',
    date: getDayOffset(0),
    clockIn: `${getDayOffset(0)}T08:45:00.000Z`,
    clockOut: null,
    durationHours: 0,
    status: 'present',
    workLocation: 'Office',
    notes: 'HR policy review and onboarding sprint.'
  },
  {
    _id: 'att_05',
    userId: 'usr_emp_01',
    userName: 'Alex Rivera',
    department: 'Engineering',
    date: getDayOffset(1),
    clockIn: `${getDayOffset(1)}T09:12:00.000Z`,
    clockOut: `${getDayOffset(1)}T17:45:00.000Z`,
    durationHours: 8.55,
    status: 'present',
    workLocation: 'Office',
    notes: 'Sprint demo and code review.'
  },
  {
    _id: 'att_06',
    userId: 'usr_emp_02',
    userName: 'David Kim',
    department: 'Engineering',
    date: getDayOffset(1),
    clockIn: `${getDayOffset(1)}T09:40:00.000Z`,
    clockOut: `${getDayOffset(1)}T18:10:00.000Z`,
    durationHours: 8.5,
    status: 'late',
    workLocation: 'Hybrid',
    notes: 'Traffic delay on highway transit.'
  },
  {
    _id: 'att_07',
    userId: 'usr_emp_04',
    userName: 'Liam O’Connor',
    department: 'Design',
    date: getDayOffset(1),
    clockIn: `${getDayOffset(1)}T09:00:00.000Z`,
    clockOut: `${getDayOffset(1)}T17:15:00.000Z`,
    durationHours: 8.25,
    status: 'present',
    workLocation: 'Remote',
    notes: 'Design system tokens and components review.'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    _id: 'lev_01',
    userId: 'usr_emp_01',
    userName: 'Alex Rivera',
    userEmail: 'employee@staffsync.com',
    department: 'Engineering',
    managerId: 'usr_mgr_eng',
    leaveType: 'annual',
    startDate: getDayOffset(-5),
    endDate: getDayOffset(-3),
    totalDays: 3,
    reason: 'Family wedding out of state. All deliverables handed off to David.',
    status: 'pending',
    reviewedBy: null,
    reviewerRole: null,
    reviewerComments: null,
    createdAt: `${getDayOffset(2)}T10:30:00.000Z`,
    updatedAt: `${getDayOffset(2)}T10:30:00.000Z`
  },
  {
    _id: 'lev_02',
    userId: 'usr_emp_03',
    userName: 'Maya Patel',
    userEmail: 'maya.patel@staffsync.com',
    department: 'Marketing',
    managerId: 'usr_mgr_mkt',
    leaveType: 'sick',
    startDate: getDayOffset(0),
    endDate: getDayOffset(-2),
    totalDays: 3,
    reason: 'Severe flu symptoms with doctor advisory to rest for 3 days.',
    status: 'approved',
    reviewedBy: 'Sophia Chen',
    reviewerRole: 'manager',
    reviewerComments: 'Approved. Rest well Maya, we will cover your scheduled posts.',
    createdAt: `${getDayOffset(1)}T08:00:00.000Z`,
    updatedAt: `${getDayOffset(1)}T08:45:00.000Z`
  },
  {
    _id: 'lev_03',
    userId: 'usr_emp_02',
    userName: 'David Kim',
    userEmail: 'david.kim@staffsync.com',
    department: 'Engineering',
    managerId: 'usr_mgr_eng',
    leaveType: 'casual',
    startDate: getDayOffset(-10),
    endDate: getDayOffset(-9),
    totalDays: 2,
    reason: 'Relocation and apartment lease signing.',
    status: 'approved',
    reviewedBy: 'Marcus Sterling',
    reviewerRole: 'manager',
    reviewerComments: 'Approved. Enjoy the new home!',
    createdAt: `${getDayOffset(12)}T14:20:00.000Z`,
    updatedAt: `${getDayOffset(11)}T09:15:00.000Z`
  },
  {
    _id: 'lev_04',
    userId: 'usr_emp_04',
    userName: 'Liam O’Connor',
    userEmail: 'liam.o@staffsync.com',
    department: 'Design',
    managerId: 'usr_mgr_eng',
    leaveType: 'annual',
    startDate: getDayOffset(-20),
    endDate: getDayOffset(-15),
    totalDays: 5,
    reason: 'Personal vacation in the Rockies.',
    status: 'rejected',
    reviewedBy: 'Marcus Sterling',
    reviewerRole: 'manager',
    reviewerComments: 'Rejected due to major design sprint overlap with client kickoff. Please reschedule for next month.',
    createdAt: `${getDayOffset(25)}T11:00:00.000Z`,
    updatedAt: `${getDayOffset(24)}T16:00:00.000Z`
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: 'ann_01',
    title: 'Q4 All-Hands Townhall & Global Product Roadmap',
    content: 'Join CEO and executive leadership this Thursday at 3:00 PM EST for the annual company update, Q4 goals review, and new innovation spotlights. A Q&A session will follow.',
    category: 'Event',
    priority: 'high',
    targetDepartment: 'All',
    authorName: 'Eleanor Vance',
    authorId: 'usr_hr_01',
    isPinned: true,
    createdAt: `${getDayOffset(1)}T09:00:00.000Z`
  },
  {
    _id: 'ann_02',
    title: 'New Hybrid Work Policy & Office Booking Guidelines',
    content: 'We have upgraded our smart office reservation system. Employees planning to work from HQ should reserve hot-desks via the StaffSync portal at least 24 hours in advance.',
    category: 'Policy',
    priority: 'medium',
    targetDepartment: 'All',
    authorName: 'Eleanor Vance',
    authorId: 'usr_hr_01',
    isPinned: true,
    createdAt: `${getDayOffset(3)}T14:20:00.000Z`
  },
  {
    _id: 'ann_03',
    title: 'Upcoming Scheduled Infrastructure & VPN Maintenance',
    content: 'IT Operations will perform scheduled security patches and gateway upgrades on Saturday 11:00 PM - Sunday 2:00 AM UTC. Internal VPN services will have intermittent connectivity.',
    category: 'Urgent',
    priority: 'high',
    targetDepartment: 'Engineering',
    authorName: 'Marcus Sterling',
    authorId: 'usr_mgr_eng',
    isPinned: false,
    createdAt: `${getDayOffset(4)}T11:45:00.000Z`
  },
  {
    _id: 'ann_04',
    title: 'Health & Wellness Benefit Enrollment Window is Open',
    content: 'Annual benefits enrollment window ends on November 15th. Please review health, dental, and gym reimbursement options in the perks catalog.',
    category: 'General',
    priority: 'low',
    targetDepartment: 'All',
    authorName: 'Eleanor Vance',
    authorId: 'usr_hr_01',
    isPinned: false,
    createdAt: `${getDayOffset(6)}T10:15:00.000Z`
  }
];

export const INITIAL_TRAININGS: Training[] = [
  {
    _id: 'trn_01',
    title: 'Modern Security & Data Protection Compliance 2026',
    description: 'Essential cyber security hygiene, phishing threat detection, GDPR/CCPA personal data handling, and multi-factor authentication protocol standards.',
    category: 'Cybersecurity',
    duration: '45 mins',
    modulesCount: 5,
    assignedRoles: ['employee', 'manager', 'hr'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    userProgress: {
      'usr_emp_01': { status: 'completed', progressPercent: 100, score: 96, completedAt: `${getDayOffset(5)}T14:00:00.000Z` },
      'usr_emp_02': { status: 'in_progress', progressPercent: 60 },
      'usr_mgr_eng': { status: 'completed', progressPercent: 100, score: 100, completedAt: `${getDayOffset(10)}T11:00:00.000Z` }
    }
  },
  {
    _id: 'trn_02',
    title: 'Inclusive Leadership & Constructive Performance Feedback',
    description: 'Frameworks for psychological safety, objective OKR alignment, conducting high-impact 1:1 meetings, and mitigating unconscious bias in appraisals.',
    category: 'Leadership',
    duration: '1 hr 15 mins',
    modulesCount: 4,
    assignedRoles: ['manager', 'hr'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    userProgress: {
      'usr_mgr_eng': { status: 'completed', progressPercent: 100, score: 94, completedAt: `${getDayOffset(12)}T16:30:00.000Z` },
      'usr_mgr_mkt': { status: 'in_progress', progressPercent: 50 }
    }
  },
  {
    _id: 'trn_03',
    title: 'Microservices Architecture & Resilient Distributed Systems',
    description: 'Hands-on architectural patterns for Node.js event-driven microservices, Redis caching tiers, Docker containers, and zero-downtime CI/CD deployment.',
    category: 'Technical',
    duration: '2 hours',
    modulesCount: 6,
    assignedRoles: ['employee', 'manager'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    userProgress: {
      'usr_emp_01': { status: 'in_progress', progressPercent: 75 },
      'usr_emp_02': { status: 'completed', progressPercent: 100, score: 98, completedAt: `${getDayOffset(3)}T15:20:00.000Z` }
    }
  },
  {
    _id: 'trn_04',
    title: 'Workplace Ergonomics & Remote Productivity Mastery',
    description: 'Best practices for physical posture, screen breaks, asynchronous communication discipline, and establishing healthy work-life boundaries.',
    category: 'Soft Skills',
    duration: '30 mins',
    modulesCount: 3,
    assignedRoles: ['employee', 'manager', 'hr'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    userProgress: {
      'usr_emp_01': { status: 'not_started', progressPercent: 0 }
    }
  }
];

export const INITIAL_PERFORMANCES: Performance[] = [
  {
    _id: 'prf_01',
    employeeId: 'usr_emp_01',
    employeeName: 'Alex Rivera',
    employeeDepartment: 'Engineering',
    reviewerId: 'usr_mgr_eng',
    reviewerName: 'Marcus Sterling',
    reviewerRole: 'manager',
    reviewPeriod: 'Q3 2026',
    ratings: {
      productivity: 5,
      teamwork: 5,
      communication: 4,
      innovation: 5,
      leadership: 4
    },
    overallScore: 4.6,
    strengths: 'Outstanding technical velocity, championed our microservices migration, consistently mentors junior devs with patience and clarity.',
    areasForImprovement: 'Can delegate more architectural proof-of-concept spikes rather than taking on everything individually during sprint crunch.',
    goals: [
      'Spearhead the transition to GraphQL Federation across all 4 core services',
      'Conduct 2 technical brown-bag training sessions for the frontend guild',
      'Achieve 99.95% uptime on checkout API services'
    ],
    feedback: 'Alex has shown tremendous growth and is tracking towards Staff Engineer criteria. Keep up the high standard!',
    status: 'submitted',
    createdAt: `${getDayOffset(14)}T10:00:00.000Z`
  },
  {
    _id: 'prf_02',
    employeeId: 'usr_emp_02',
    employeeName: 'David Kim',
    employeeDepartment: 'Engineering',
    reviewerId: 'usr_mgr_eng',
    reviewerName: 'Marcus Sterling',
    reviewerRole: 'manager',
    reviewPeriod: 'Q3 2026',
    ratings: {
      productivity: 4,
      teamwork: 4,
      communication: 4,
      innovation: 4,
      leadership: 3
    },
    overallScore: 3.8,
    strengths: 'Solid backend foundations, excellent database query optimization and zero-error database migrations.',
    areasForImprovement: 'Improve morning meeting punctuality and proactive communication on pull request dependencies.',
    goals: [
      'Complete MongoDB indexing and query profiling audit',
      'Implement automated integration test suites for leave balance transactions'
    ],
    feedback: 'David is a dependable engineer with strong analytical capability.',
    status: 'submitted',
    createdAt: `${getDayOffset(15)}T11:30:00.000Z`
  },
  {
    _id: 'prf_03',
    employeeId: 'usr_emp_03',
    employeeName: 'Maya Patel',
    employeeDepartment: 'Marketing',
    reviewerId: 'usr_mgr_mkt',
    reviewerName: 'Sophia Chen',
    reviewerRole: 'manager',
    reviewPeriod: 'Q3 2026',
    ratings: {
      productivity: 5,
      teamwork: 5,
      communication: 5,
      innovation: 4,
      leadership: 4
    },
    overallScore: 4.6,
    strengths: 'Exceptional storytelling, generated 45% increase in organic qualified leads through product spotlight campaign.',
    areasForImprovement: 'Develop deeper knowledge of analytics instrumentation and attribution modeling.',
    goals: [
      'Launch product video series for enterprise feature release',
      'Coordinate co-marketing webinars with strategic cloud partners'
    ],
    feedback: 'Maya is a cornerstone of our marketing team. Consistently inspiring work.',
    status: 'submitted',
    createdAt: `${getDayOffset(16)}T09:15:00.000Z`
  }
];
