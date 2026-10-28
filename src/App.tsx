import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import { setDemoUser, fetchCurrentUser } from './store/slices/authSlice';
import { INITIAL_USERS } from '../server/seed/seedData';
import { DemoRoleBar } from './components/layout/DemoRoleBar';
import { Header } from './components/layout/Header';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { ProjectArchitectureModal } from './components/docs/ProjectArchitectureModal';
import { AuthModal } from './components/auth/AuthModal';

// Dashboards
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { HRDashboard } from './components/dashboard/HRDashboard';

// Subviews
import { AttendanceClockCard } from './components/attendance/AttendanceClockCard';
import { AttendanceHistoryTable } from './components/attendance/AttendanceHistoryTable';
import { TeamAttendanceTable } from './components/attendance/TeamAttendanceTable';
import { LeaveBalanceCards } from './components/leaves/LeaveBalanceCards';
import { LeaveRequestsTable } from './components/leaves/LeaveRequestsTable';
import { ApplyLeaveModal } from './components/leaves/ApplyLeaveModal';
import { AnnouncementsFeed } from './components/announcements/AnnouncementsFeed';
import { CreateAnnouncementModal } from './components/announcements/CreateAnnouncementModal';
import { TrainingGrid } from './components/training/TrainingGrid';
import { AddTrainingModal } from './components/training/AddTrainingModal';
import { PerformanceReviewsList } from './components/performance/PerformanceReviewsList';
import { CreateReviewModal } from './components/performance/CreateReviewModal';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { AddEmployeeModal } from './components/employees/AddEmployeeModal';
import { HRReportsView } from './components/reports/HRReportsView';

function MainApp() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Modals state
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);

  // Initialize with sample demo account if fresh mentor evaluation session
  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('staffsync_token')) {
      // Default to HR Personnel Eleanor Vance for full administrative preview
      const defaultHr = INITIAL_USERS.find(u => u.role === 'hr')!;
      dispatch(setDemoUser(defaultHr as any));
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated && !user) {
    return <AuthModal />;
  }

  const role = user?.role || 'employee';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === 'hr') {
          return (
            <HRDashboard
              onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
              onOpenAddTraining={() => setIsAddTrainingOpen(true)}
              onViewReports={() => setActiveTab('reports')}
            />
          );
        }
        if (role === 'manager') {
          return (
            <ManagerDashboard
              onOpenCreateReview={() => setIsCreateReviewOpen(true)}
            />
          );
        }
        return (
          <EmployeeDashboard
            onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
          />
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <AttendanceClockCard />
            {role === 'employee' ? (
              <AttendanceHistoryTable />
            ) : (
              <TeamAttendanceTable isHR={role === 'hr'} />
            )}
          </div>
        );

      case 'leaves':
        return (
          <div className="space-y-6">
            {role === 'employee' && (
              <LeaveBalanceCards onOpenApplyModal={() => setIsApplyLeaveOpen(true)} />
            )}
            <LeaveRequestsTable
              viewMode={role === 'hr' ? 'all' : role === 'manager' ? 'team' : 'my'}
            />
          </div>
        );

      case 'directory':
        return (
          <EmployeeDirectory
            isHR={role === 'hr'}
            onOpenAddModal={() => setIsAddEmployeeOpen(true)}
          />
        );

      case 'announcements':
        return (
          <AnnouncementsFeed
            isHR={role === 'hr'}
            onOpenCreateModal={() => setIsCreateAnnouncementOpen(true)}
          />
        );

      case 'training':
        return (
          <TrainingGrid
            isHR={role === 'hr'}
            onOpenAddModal={() => setIsAddTrainingOpen(true)}
          />
        );

      case 'performance':
        return (
          <PerformanceReviewsList
            canReview={role === 'manager' || role === 'hr'}
            onOpenCreateModal={() => setIsCreateReviewOpen(true)}
          />
        );

      case 'reports':
        return <HRReportsView />;

      case 'architecture':
        // Trigger modal directly and show confirmation card
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <span className="text-xl font-bold">📚</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Capstone Project Documentation Opened</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Review the complete 6-Epic, 19-task implementation plan, database models, directory tree, and REST API specification.
            </p>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              Reopen Documentation Modal
            </button>
          </div>
        );

      default:
        return <div>Select a view from the sidebar.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1-Click Role Switcher for Mentors */}
      <DemoRoleBar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            onOpenDocs={() => setIsDocsOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProjectArchitectureModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />

      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
      />

      <AddTrainingModal
        isOpen={isAddTrainingOpen}
        onClose={() => setIsAddTrainingOpen(false)}
      />

      <CreateReviewModal
        isOpen={isCreateReviewOpen}
        onClose={() => setIsCreateReviewOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
