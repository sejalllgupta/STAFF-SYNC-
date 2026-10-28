import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, registerUser, clearAuthError } from '../../store/slices/authSlice';
import {
  Building2,
  Lock,
  Mail,
  User,
  ShieldAlert,
  Shield,
  UserCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Department, Role } from '../../types';

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('hr@staffsync.com');
  const [password, setPassword] = useState('StaffSync@2026');

  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('StaffSync@2026');
  const [role, setRole] = useState<Role>('employee');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [designation, setDesignation] = useState('Full Stack Software Engineer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(loginUser({ email, password }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(
      registerUser({
        name,
        email: regEmail,
        password: regPassword,
        role,
        department,
        designation
      })
    );
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('StaffSync@2026');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Building2 className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
          StaffSync
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Modern Human Resource Management Solution • MERN Stack
        </p>

        {/* Tab switch */}
        <div className="mt-6 flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Account
          </button>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@staffsync.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In with JWT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Credentials for Mentors */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Instant Mentor Demo Credentials
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('hr@staffsync.com')}
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-medium text-center transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mx-auto mb-0.5 text-purple-400" />
                    HR Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('manager@staffsync.com')}
                    className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium text-center transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 mx-auto mb-0.5 text-indigo-400" />
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('employee@staffsync.com')}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium text-center transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-400" />
                    Employee
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
                  Default Password: StaffSync@2026
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="jordan.lee@staffsync.com"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Personnel</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value as any)}
                    className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">HR</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer mt-3"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
