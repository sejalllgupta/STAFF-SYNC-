import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FolderTree,
  Database,
  Route,
  CheckCircle2,
  Layers,
  Key,
  ShieldCheck,
  Server,
  Code2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'epics' | 'structure' | 'schemas' | 'routes' | 'credentials'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                StaffSync Capstone Architecture & Mentor Review Guide
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SkillWallet MERN Track
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Production-grade human resource management system documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto text-sm">
          {[
            { id: 'overview', label: '1. Architecture & Stack', icon: Layers },
            { id: 'epics', label: '2. Six Epics & 19 Tasks', icon: CheckCircle2 },
            { id: 'structure', label: '3. Folder Tree', icon: FolderTree },
            { id: 'schemas', label: '4. Database Models', icon: Database },
            { id: 'routes', label: '5. API Endpoints', icon: Route },
            { id: 'credentials', label: '6. Demo Credentials', icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-5">
                <h3 className="font-bold text-indigo-950 text-base mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  MERN Full-Stack System Design
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  StaffSync is engineered using the canonical <strong>MERN</strong> architecture (MongoDB, Express.js, React.js, Node.js).
                  It enforces clear separation of concerns across presentation, state, routing, authentication, business logic, and database persistence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-indigo-600">
                    <Server className="w-4 h-4" /> Backend Tier
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>Node.js & Express.js</strong> runtime with CORS and JSON middleware.</li>
                    <li><strong>JWT (JSON Web Token)</strong> stateless authentication via Bearer headers.</li>
                    <li><strong>bcryptjs</strong> cryptographic hashing (10 salt rounds) for password safety.</li>
                    <li><strong>Role-Based Access Control (RBAC)</strong> middleware gating routes for Employee, Manager, and HR.</li>
                    <li><strong>Mongoose-compatible persistence store</strong> with seed population and instant reset capability.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2 text-emerald-600">
                    <Code2 className="w-4 h-4" /> Frontend Tier
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>React 19 with Vite</strong> for fast rendering and modular component design.</li>
                    <li><strong>Redux Toolkit (RTK)</strong> slices for auth, attendance, leave, employee, announcements, training, and reports.</li>
                    <li><strong>Axios</strong> client with request/response interceptors for automatic Bearer token injection.</li>
                    <li><strong>Tailwind CSS</strong> responsive layout with mobile drawer and desktop sidebar.</li>
                    <li><strong>One-Click Role Switcher</strong> for mentors to test all 3 personas without manual re-login.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'epics' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Six Capstone Epics (19 Tasks Implemented)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    epic: 'Epic 1: Project Architecture & Environment',
                    tasks: [
                      'Task 1.1: System architecture diagram and technology stack selection',
                      'Task 1.2: Directory structure specification for client & server',
                      'Task 1.3: Environment configuration (.env, JWT secrets, database URIs)'
                    ]
                  },
                  {
                    epic: 'Epic 2: Database Schema & Seeding',
                    tasks: [
                      'Task 2.1: User schema with role enum and leave balances',
                      'Task 2.2: Attendance schema with single-check-in per day constraint',
                      'Task 2.3: LeaveRequest schema with multi-stage approval workflow',
                      'Task 2.4: Announcement, Training, and Performance schemas',
                      'Task 2.5: Seed database script with HR, Manager, and Employee accounts'
                    ]
                  },
                  {
                    epic: 'Epic 3: Backend REST API Development',
                    tasks: [
                      'Task 3.1: JWT authentication endpoints (register, login, me)',
                      'Task 3.2: Role-based authorization middleware (employee, manager, hr)',
                      'Task 3.3: Attendance clock-in, clock-out, late detection & history APIs',
                      'Task 3.4: Leave application, balance check, and status update endpoints',
                      'Task 3.5: Company announcements, training modules, and HR report endpoints'
                    ]
                  },
                  {
                    epic: 'Epic 4: Frontend State & Redux Toolkit',
                    tasks: [
                      'Task 4.1: Redux store initialization with typed hooks',
                      'Task 4.2: Auth, attendance, leave, and employee async thunk slices',
                      'Task 4.3: Axios client interceptor with local token hydration'
                    ]
                  },
                  {
                    epic: 'Epic 5: Role-Specific UI Dashboards',
                    tasks: [
                      'Task 5.1: Employee Portal: Attendance clock widget, leave balance cards, training',
                      'Task 5.2: Manager Console: Direct reports attendance board, leave approval modal',
                      'Task 5.3: HR Personnel Suite: Company-wide attendance, reports, announcements'
                    ]
                  },
                  {
                    epic: 'Epic 6: Execution, Verification & Testing',
                    tasks: [
                      'Task 6.1: Seed reset endpoint for instantaneous test reproducibility',
                      'Task 6.2: One-click mentor role switcher bar with demo accounts'
                    ]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide text-indigo-700 mb-2">
                      {item.epic}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {item.tasks.map((t, tidx) => (
                        <li key={tidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">MERN Project Directory Structure</h3>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`staffsync-hrms/
├── .env.example                     # Environment template (JWT_SECRET, MONGODB_URI, PORT)
├── package.json                     # Dependencies (@reduxjs/toolkit, express, bcryptjs, etc.)
├── server.ts                        # Main Express server with Vite middleware mount
│
├── server/                          # Backend MERN tier
│   ├── config/
│   │   ├── db.ts                    # Mongoose-compatible database collection engine
│   │   └── jwt.ts                   # Token signing & verification utilities
│   ├── controllers/
│   │   ├── authController.ts        # Register, login, me, seed-reset
│   │   ├── userController.ts        # Directory and employee management
│   │   ├── attendanceController.ts  # Daily clock-in/out, single record constraint
│   │   ├── leaveController.ts       # Apply, balance deduction, manager/HR approvals
│   │   ├── announcementController.ts# Broadcasting and alerts
│   │   ├── trainingController.ts    # Modules & progress tracking
│   │   ├── performanceController.ts # Reviews & ratings
│   │   └── reportController.ts      # HR analytics aggregation
│   ├── middleware/
│   │   ├── authMiddleware.ts        # Bearer token verification
│   │   └── roleMiddleware.ts        # RBAC role authorization (employee, manager, hr)
│   ├── models/
│   │   └── types.ts                 # Backend data schema interfaces
│   ├── routes/                      # Modular Express routers
│   └── seed/
│       └── seedData.ts              # Pre-configured HR, Manager, and Employee records
│
└── src/                             # Frontend React + Redux Toolkit tier
    ├── components/
    │   ├── layout/                  # Navbar, Sidebar, Header, DemoRoleBar
    │   ├── attendance/              # AttendanceClockCard, History, TeamBoard
    │   ├── leaves/                  # ApplyLeaveModal, BalanceCards, ApprovalTable
    │   ├── announcements/           # Feed, PostAnnouncementModal
    │   ├── training/                # TrainingGrid, AddCourseModal
    │   ├── performance/             # ReviewCards, AddReviewModal
    │   ├── employees/               # Directory, AddEmployeeModal
    │   ├── reports/                 # HRReportsView (attendance & leave charts)
    │   └── docs/                    # MentorProjectDocsModal
    ├── services/
    │   └── api.ts                   # Axios service layer with interceptors
    ├── store/                       # Redux Toolkit store & slices
    │   ├── index.ts                 # Root store & typed hooks
    │   └── slices/                  # auth, attendance, leave, employee, etc.
    └── types/
        └── index.ts                 # Shared TypeScript models`}
              </pre>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Database Schemas & Relationships</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-indigo-700">
                    <Database className="w-3.5 h-3.5" /> 1. User Model
                  </h4>
                  <p className="text-slate-600 mb-2">Represents corporate accounts across Employee, Manager, and HR roles.</p>
                  <code className="text-[11px] block text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    _id (ObjectId/String)<br/>
                    name: String (Required)<br/>
                    email: String (Unique, Indexed)<br/>
                    password: String (Hashed with bcrypt)<br/>
                    role: 'employee' | 'manager' | 'hr'<br/>
                    department: String<br/>
                    designation: String<br/>
                    managerId: String (Ref: User._id)<br/>
                    leaveBalances: &#123; annual, sick, casual, unpaid &#125;<br/>
                    status: 'active' | 'on_leave' | 'inactive'
                  </code>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-indigo-700">
                    <Database className="w-3.5 h-3.5" /> 2. Attendance Model
                  </h4>
                  <p className="text-slate-600 mb-2">Tracks daily check-in with a 1-record-per-day constraint.</p>
                  <code className="text-[11px] block text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    _id: String<br/>
                    userId: String (Ref: User._id)<br/>
                    date: String (YYYY-MM-DD, Compound Index [userId, date])<br/>
                    clockIn: ISOString<br/>
                    clockOut: ISOString | null<br/>
                    durationHours: Number<br/>
                    status: 'present' | 'late' | 'half_day' | 'absent'<br/>
                    workLocation: 'Office' | 'Remote' | 'Hybrid'
                  </code>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-indigo-700">
                    <Database className="w-3.5 h-3.5" /> 3. LeaveRequest Model
                  </h4>
                  <p className="text-slate-600 mb-2">Manages time-off workflow, balances, and multi-tier reviews.</p>
                  <code className="text-[11px] block text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    _id: String<br/>
                    userId: String (Ref: User._id)<br/>
                    managerId: String (Ref: User._id)<br/>
                    leaveType: 'annual' | 'sick' | 'casual' | 'unpaid'<br/>
                    startDate: String, endDate: String<br/>
                    totalDays: Number<br/>
                    reason: String<br/>
                    status: 'pending' | 'approved' | 'rejected' | 'cancelled'<br/>
                    reviewedBy: String, reviewerComments: String
                  </code>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-indigo-700">
                    <Database className="w-3.5 h-3.5" /> 4. Announcement, Training & Performance
                  </h4>
                  <p className="text-slate-600 mb-2">Enterprise operations, training records, and KPI review ratings.</p>
                  <code className="text-[11px] block text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    Announcement: title, content, category, isPinned<br/>
                    Training: title, duration, assignedRoles, userProgress<br/>
                    Performance: employeeId, reviewerId, ratings (1-5), overallScore, goals, feedback
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">REST API Endpoints by Module & Role</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Module</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Endpoint</th>
                      <th className="py-2.5 px-3">Allowed Roles</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Auth</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/auth/login</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Public</span></td>
                      <td className="py-2 px-3">Validates credentials with bcrypt & issues JWT</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Auth</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/auth/register</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Public</span></td>
                      <td className="py-2 px-3">Creates new user with hashed password</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Auth</td>
                      <td className="py-2 px-3 font-mono text-blue-600 font-semibold">GET</td>
                      <td className="py-2 px-3 font-mono">/api/auth/me</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">Authenticated</span></td>
                      <td className="py-2 px-3">Returns current session user profile</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Attendance</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/attendance/clock-in</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Employee</span></td>
                      <td className="py-2 px-3">Enforces 1 record/day with late detection</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Attendance</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/attendance/clock-out</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Employee</span></td>
                      <td className="py-2 px-3">Computes durationHours & half-day status</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Attendance</td>
                      <td className="py-2 px-3 font-mono text-blue-600 font-semibold">GET</td>
                      <td className="py-2 px-3 font-mono">/api/attendance/team</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Manager, HR</span></td>
                      <td className="py-2 px-3">Direct reports attendance statuses</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Attendance</td>
                      <td className="py-2 px-3 font-mono text-blue-600 font-semibold">GET</td>
                      <td className="py-2 px-3 font-mono">/api/attendance/company</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">HR Only</span></td>
                      <td className="py-2 px-3">Company-wide attendance with dept filters</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Leave</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/leaves</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Employee</span></td>
                      <td className="py-2 px-3">Applies for leave with balance check</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Leave</td>
                      <td className="py-2 px-3 font-mono text-amber-600 font-semibold">PATCH</td>
                      <td className="py-2 px-3 font-mono">/api/leaves/:id/status</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Manager, HR</span></td>
                      <td className="py-2 px-3">Approves/rejects and auto-deducts balance</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Announcements</td>
                      <td className="py-2 px-3 font-mono text-emerald-600 font-semibold">POST</td>
                      <td className="py-2 px-3 font-mono">/api/announcements</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">HR Only</span></td>
                      <td className="py-2 px-3">Broadcasts company-wide announcements</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Reports</td>
                      <td className="py-2 px-3 font-mono text-blue-600 font-semibold">GET</td>
                      <td className="py-2 px-3 font-mono">/api/reports/dashboard-stats</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">HR Only</span></td>
                      <td className="py-2 px-3">Attendance summary and leave utilization analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Mentor Demo Credentials</h3>
              <p className="text-slate-600 text-xs">
                Use these pre-configured accounts to test each role’s dashboard, permissions, and workflows. Alternatively, use the top banner’s 1-Click Role Switcher.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/50">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wide block mb-1">
                    HR Personnel (Admin)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-700"><strong>Name:</strong> Eleanor Vance</p>
                    <p className="text-slate-700"><strong>Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-purple-700">hr@staffsync.com</code></p>
                    <p className="text-slate-700"><strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-purple-700">StaffSync@2026</code></p>
                    <p className="text-slate-500 text-[11px] mt-2">Can manage all employees, company attendance, leave approvals, reports, and announcements.</p>
                  </div>
                </div>

                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide block mb-1">
                    Manager (Team Lead)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-700"><strong>Name:</strong> Marcus Sterling</p>
                    <p className="text-slate-700"><strong>Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700">manager@staffsync.com</code></p>
                    <p className="text-slate-700"><strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700">StaffSync@2026</code></p>
                    <p className="text-slate-500 text-[11px] mt-2">Can review and approve/reject team leaves, monitor engineering team attendance, and submit reviews.</p>
                  </div>
                </div>

                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                    Employee (Staff)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-700"><strong>Name:</strong> Alex Rivera</p>
                    <p className="text-slate-700"><strong>Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700">employee@staffsync.com</code></p>
                    <p className="text-slate-700"><strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700">StaffSync@2026</code></p>
                    <p className="text-slate-500 text-[11px] mt-2">Can clock in/out daily, apply for leaves, access training courses, and view performance goals.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>StaffSync Human Resource Management Solution • Ready for Mentor Evaluation</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
