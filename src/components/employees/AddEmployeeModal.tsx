import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createEmployeeThunk } from '../../store/slices/employeeSlice';
import { X, UserPlus, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Department, Role } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(state => state.employee.employees);
  const managers = employees.filter(e => e.role === 'manager' || e.role === 'hr');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [designation, setDesignation] = useState('');
  const [managerId, setManagerId] = useState(managers[0]?._id || '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !designation.trim()) return;

    setIsSubmitting(true);
    const res = await dispatch(
      createEmployeeThunk({
        name,
        email,
        role,
        department,
        designation,
        managerId: role === 'employee' ? managerId : null,
        phone: phone || '+1 (555) 321-9876'
      })
    );

    if (createEmployeeThunk.fulfilled.match(res)) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Employee</h3>
              <p className="text-xs text-slate-400">Onboard a corporate staff member or manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rachel.adams@staffsync.com"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">System Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR Personnel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {role === 'employee' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Assign Reporting Manager
              </label>
              <select
                value={managerId}
                onChange={e => setManagerId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
              >
                {managers.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.designation} - {m.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500">
            Initial temporary password will be set to <code className="font-bold text-slate-700">StaffSync@2026</code>. Standard annual leave balance of 20 days will be initialized.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Onboarding...' : 'Create Employee Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
