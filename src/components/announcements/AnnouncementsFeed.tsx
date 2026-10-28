import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAnnouncements, deleteAnnouncementThunk } from '../../store/slices/announcementSlice';
import { Megaphone, Pin, Trash2, Calendar, Tag, Plus, AlertCircle } from 'lucide-react';

interface Props {
  onOpenCreateModal?: () => void;
  isHR?: boolean;
}

export const AnnouncementsFeed: React.FC<Props> = ({ onOpenCreateModal, isHR = false }) => {
  const dispatch = useAppDispatch();
  const announcements = useAppSelector(state => state.announcement.announcements);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Policy':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Event':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Company Announcements</h3>
            <p className="text-xs text-slate-500">Corporate notices, policy updates, and townhall events</p>
          </div>
        </div>

        {isHR && onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      {/* Feed list */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No announcements broadcasted yet.
          </div>
        ) : (
          announcements.map(item => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all ${
                item.isPinned ? 'border-indigo-200 ring-1 ring-indigo-500/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        <Pin className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                        Pinned Notice
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${getPriorityStyle(
                        item.priority
                      )}`}
                    >
                      Priority: {item.priority}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      Target: {item.targetDepartment}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h4>
                </div>

                {isHR && (
                  <button
                    onClick={() => dispatch(deleteAnnouncementThunk(item._id))}
                    title="Delete notice"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>By {item.authorName}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
