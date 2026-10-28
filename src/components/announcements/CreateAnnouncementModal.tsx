import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { createAnnouncementThunk } from '../../store/slices/announcementSlice';
import { X, Megaphone, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'General' | 'Policy' | 'Urgent' | 'Event' | 'Holiday'>('General');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetDepartment, setTargetDepartment] = useState('All');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const res = await dispatch(
      createAnnouncementThunk({
        title,
        content,
        category,
        priority,
        targetDepartment,
        isPinned
      })
    );

    if (createAnnouncementThunk.fulfilled.match(res)) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
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
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Broadcast Announcement</h3>
              <p className="text-xs text-slate-400">Post a corporate bulletin to workforce channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Notice Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Q4 All-Hands Townhall & Innovation Awards"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="General">General</option>
                <option value="Policy">Policy</option>
                <option value="Urgent">Urgent</option>
                <option value="Event">Event</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Audience</label>
              <select
                value={targetDepartment}
                onChange={e => setTargetDepartment(e.target.value)}
                className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="All">All Staff</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">HR</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Provide announcement details, links, schedules, and guidance..."
              rows={4}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinNotice"
              checked={isPinned}
              onChange={e => setIsPinned(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="pinNotice" className="text-xs text-slate-700 font-medium cursor-pointer">
              Pin this announcement to top of feed
            </label>
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
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Publish Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
