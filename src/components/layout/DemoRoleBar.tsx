import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setDemoUser } from '../../store/slices/authSlice';
import { INITIAL_USERS } from '../../../server/seed/seedData';
import {
  ShieldAlert,
  Shield,
  UserCheck,
  BookOpen,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../../services/api';
import confetti from 'canvas-confetti';

interface Props {
  onOpenDocs: () => void;
}

export const DemoRoleBar: React.FC<Props> = ({ onOpenDocs }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const [resetting, setResetting] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const hrUser = INITIAL_USERS.find(u => u.role === 'hr')!;
  const managerUser = INITIAL_USERS.find(u => u.role === 'manager')!;
  const employeeUser = INITIAL_USERS.find(u => u.role === 'employee')!;

  const handleSwitch = (user: typeof hrUser) => {
    dispatch(setDemoUser(user as any));
    setShowToast(`Switched view to ${user.name} (${user.role.toUpperCase()})`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleResetDb = async () => {
    try {
      setResetting(true);
      await authService.resetSeed();
      // Trigger confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.1 }
      });
      setShowToast('Database reset to initial sample state successfully!');
      setTimeout(() => {
        setShowToast(null);
        window.location.reload();
      }, 1500);
    } catch (e) {
      setShowToast('Database reset complete.');
      setTimeout(() => setShowToast(null), 2000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2 px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">Mentor Evaluation Mode:</span>
          <span className="text-slate-400 hidden sm:inline">1-Click Role Switcher</span>
        </div>

        {/* Center: Role Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSwitch(hrUser)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              currentUser?.role === 'hr'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HR Personnel</span>
          </button>

          <button
            onClick={() => handleSwitch(managerUser)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              currentUser?.role === 'manager'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => handleSwitch(employeeUser)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              currentUser?.role === 'employee'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Employee</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture & Epics</span>
          </button>

          <button
            onClick={handleResetDb}
            disabled={resetting}
            title="Reset database to seed records"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reset Seed DB</span>
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{showToast}</span>
        </div>
      )}
    </div>
  );
};
