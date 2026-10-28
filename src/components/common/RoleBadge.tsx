import React from 'react';
import { Role } from '../../types';
import { ShieldAlert, UserCheck, Shield } from 'lucide-react';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', showIcon = true }) => {
  const getBadgeConfig = () => {
    switch (role) {
      case 'hr':
        return {
          label: 'HR Personnel',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: ShieldAlert
        };
      case 'manager':
        return {
          label: 'Manager',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          icon: Shield
        };
      case 'employee':
      default:
        return {
          label: 'Employee',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: UserCheck
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
};
