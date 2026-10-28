import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { RoleBadge } from '../common/RoleBadge';
import {
  Menu,
  LogOut,
  Bell,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Props {
  onToggleSidebar: () => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<Props> = ({ onToggleSidebar, onOpenDocs }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-9 z-30 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {getGreeting()}, {user?.name.split(' ')[0] || 'Team Member'}
              </h1>
              {user && <RoleBadge role={user.role} size="sm" />}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.department || 'StaffSync HQ'}</span>
              <span className="text-slate-300">•</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayFormatted}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions and User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDocs}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Capstone Guide</span>
          </button>

          {/* User profile capsule */}
          {user && (
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{user.designation}</p>
              </div>

              <button
                onClick={() => dispatch(logout())}
                title="Log out of session"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
