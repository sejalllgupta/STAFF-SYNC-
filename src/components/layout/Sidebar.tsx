import React from 'react';
import { useAppSelector } from '../../store';
import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  Users,
  Megaphone,
  GraduationCap,
  Award,
  BarChart3,
  BookOpen,
  X,
  Building
} from 'lucide-react';

export type NavItem =
  | 'dashboard'
  | 'attendance'
  | 'leaves'
  | 'directory'
  | 'announcements'
  | 'training'
  | 'performance'
  | 'reports'
  | 'architecture';

interface Props {
  activeTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const user = useAppSelector(state => state.auth.user);
  const pendingLeaves = useAppSelector(state => {
    if (user?.role === 'hr') {
      return state.leave.allLeaves.filter(l => l.status === 'pending').length;
    }
    if (user?.role === 'manager') {
      return state.leave.teamLeaves.filter(l => l.status === 'pending').length;
    }
    return 0;
  });

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'attendance',
      label: 'Attendance Tracking',
      icon: Clock,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'leaves',
      label: 'Leave Management',
      icon: CalendarCheck,
      roles: ['employee', 'manager', 'hr'],
      badge: pendingLeaves > 0 ? pendingLeaves : undefined
    },
    {
      id: 'directory',
      label: user?.role === 'hr' ? 'Employee Management' : user?.role === 'manager' ? 'Team Directory' : 'Company Directory',
      icon: Users,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'training',
      label: 'Training & Skills',
      icon: GraduationCap,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'performance',
      label: 'Performance Reviews',
      icon: Award,
      roles: ['employee', 'manager', 'hr']
    },
    {
      id: 'reports',
      label: 'HR Analytics & Reports',
      icon: BarChart3,
      roles: ['hr'] // Restricted to HR Personnel
    },
    {
      id: 'architecture',
      label: 'Capstone Architecture',
      icon: BookOpen,
      roles: ['employee', 'manager', 'hr']
    }
  ];

  const filteredItems = navItems.filter(item =>
    user ? item.roles.includes(user.role) : true
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-9 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block">
                StaffSync
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                Enterprise HRMS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workforce Portal
          </div>
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavItem);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current user footer badge */}
        {user && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">
                  Role: {user.role === 'hr' ? 'HR Personnel' : user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
