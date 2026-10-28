import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchEmployees, deleteEmployeeThunk } from '../../store/slices/employeeSlice';
import { RoleBadge } from '../common/RoleBadge';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  Trash2,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { User } from '../../types';

interface Props {
  onOpenAddModal?: () => void;
  isHR?: boolean;
}

export const EmployeeDirectory: React.FC<Props> = ({ onOpenAddModal, isHR = false }) => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(state => state.employee.employees);
  const currentUser = useAppSelector(state => state.auth.user);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesRole = selectedRole === 'All' || emp.role === selectedRole;
    return matchesSearch && matchesDept && matchesRole;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the company records?`)) {
      dispatch(deleteEmployeeThunk(id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHR ? 'Workforce & Staff Management' : 'Colleague Directory'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHR
                ? 'Create, manage, and audit corporate employees and departmental managers'
                : 'Connect and collaborate with your teammates across departments'}
            </p>
          </div>
        </div>

        {isHR && onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or designation..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Design">Design</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
        </select>

        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All Roles</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="hr">HR Personnel</option>
        </select>
      </div>

      {/* Employee cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => (
          <div
            key={emp._id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl border border-slate-200 object-cover shadow-2xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</h4>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">{emp.designation}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <RoleBadge role={emp.role} size="sm" showIcon={false} />
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          emp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : emp.status === 'on_leave'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {emp.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {isHR && emp._id !== currentUser?._id && (
                  <button
                    onClick={() => handleDelete(emp._id, emp.name)}
                    title="Remove Employee"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Contact and Dept Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone || '+1 (555) 000-0000'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined: {emp.joinDate}
              </span>
              <span className="font-mono text-slate-600 font-semibold">
                Vacation: {emp.leaveBalances?.annual ?? 0}d left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
