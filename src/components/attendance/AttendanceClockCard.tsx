import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  performClockIn,
  performClockOut,
  clearAttendanceMessages
} from '../../store/slices/attendanceSlice';
import {
  Clock,
  LogIn,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building,
  Home,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AttendanceClockCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todayAttendance, hasClockedIn, hasClockedOut, isLoading, error, successMessage } =
    useAppSelector(state => state.attendance);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [workLocation, setWorkLocation] = useState<'Office' | 'Remote' | 'Hybrid'>('Office');
  const [notes, setNotes] = useState('');

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    dispatch(clearAttendanceMessages());
    const res = await dispatch(performClockIn({ workLocation, notes }));
    if (performClockIn.fulfilled.match(res)) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
      setNotes('');
    }
  };

  const handleClockOut = async () => {
    dispatch(clearAttendanceMessages());
    await dispatch(performClockOut(notes));
    setNotes('');
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 overflow-hidden relative">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Attendance Clock</h2>
              <p className="text-xs text-slate-500">Record your daily attendance and work location</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {formattedTime}
            </span>
            <p className="text-[11px] text-slate-500">{formattedDate}</p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current State Indicator */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Clock-In Time
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono mt-1 block">
              {todayAttendance?.clockIn
                ? new Date(todayAttendance.clockIn).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Not Marked'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Clock-Out Time
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono mt-1 block">
              {todayAttendance?.clockOut
                ? new Date(todayAttendance.clockOut).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : hasClockedIn
                ? 'Active Session'
                : '—'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Today's Status
            </span>
            <div className="mt-1">
              {todayAttendance ? (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    todayAttendance.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : todayAttendance.status === 'late'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  ● {todayAttendance.status} ({todayAttendance.workLocation})
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Pending Check-in</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 space-y-4">
          {!hasClockedIn && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Select Work Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Office', label: 'Office HQ', icon: Building },
                  { id: 'Remote', label: 'Remote / Home', icon: Home },
                  { id: 'Hybrid', label: 'Client / Field', icon: Laptop }
                ].map(loc => {
                  const Icon = loc.icon;
                  const isSelected = workLocation === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setWorkLocation(loc.id as any)}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{loc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!hasClockedOut && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {hasClockedIn ? 'Clock-out summary notes (optional)' : 'Check-in remarks (optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={
                  hasClockedIn
                    ? 'e.g. Completed feature PR #42, signed off for the day'
                    : 'e.g. Desk 4B, 3rd Floor or pairing with backend team'
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {!hasClockedIn ? (
              <button
                onClick={handleClockIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In Now</span>
              </button>
            ) : !hasClockedOut ? (
              <button
                onClick={handleClockOut}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Clock Out for Today</span>
              </button>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
                <p className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  You have completed today's attendance cycle ({todayAttendance?.durationHours} hrs).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
