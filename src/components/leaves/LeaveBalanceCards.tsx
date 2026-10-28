import React from 'react';
import { useAppSelector } from '../../store';
import { Calendar, HeartPulse, Coffee, UserMinus, Plus } from 'lucide-react';

interface Props {
  onOpenApplyModal: () => void;
}

export const LeaveBalanceCards: React.FC<Props> = ({ onOpenApplyModal }) => {
  const user = useAppSelector(state => state.auth.user);
  const balances = user?.leaveBalances || { annual: 20, sick: 10, casual: 5, unpaid: 0 };

  const cards = [
    {
      title: 'Annual Vacation',
      balance: balances.annual,
      total: 24,
      icon: Calendar,
      color: 'indigo',
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Medical / Sick',
      balance: balances.sick,
      total: 12,
      icon: HeartPulse,
      color: 'emerald',
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Casual Time-off',
      balance: balances.casual,
      total: 6,
      icon: Coffee,
      color: 'amber',
      accent: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      title: 'Unpaid / Special',
      balance: balances.unpaid,
      total: 0,
      icon: UserMinus,
      color: 'slate',
      accent: 'text-slate-600 bg-slate-100 border-slate-200'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Your Leave Quotas & Balances</h3>
        <button
          onClick={onOpenApplyModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for Leave</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => {
          const Icon = card.icon;
          const percentage = card.total > 0 ? Math.min(100, Math.round((card.balance / card.total) * 100)) : 100;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{card.title}</span>
                <div className={`p-1.5 rounded-lg border ${card.accent}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono">{card.balance}</span>
                <span className="text-xs text-slate-500">
                  {card.total > 0 ? `/ ${card.total} days` : 'days taken'}
                </span>
              </div>

              {card.total > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage > 50
                          ? 'bg-emerald-500'
                          : percentage > 20
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {percentage}% remaining this year
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
