import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { createTrainingThunk } from '../../store/slices/trainingSlice';
import { X, GraduationCap, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTrainingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Compliance' | 'Technical' | 'Soft Skills' | 'Cybersecurity' | 'Leadership'>('Technical');
  const [duration, setDuration] = useState('1 hour');
  const [modulesCount, setModulesCount] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const res = await dispatch(
      createTrainingThunk({
        title,
        description,
        category,
        duration,
        modulesCount,
        assignedRoles: ['employee', 'manager', 'hr'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      })
    );

    if (createTrainingThunk.fulfilled.match(res)) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
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
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Training Course</h3>
              <p className="text-xs text-slate-400">Enroll new curriculum into employee learning tracks</p>
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
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. AI Prompt Engineering for Product Teams"
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
                <option value="Technical">Technical</option>
                <option value="Compliance">Compliance</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Leadership">Leadership</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 45 mins"
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Modules</label>
              <input
                type="number"
                min={1}
                max={20}
                value={modulesCount}
                onChange={e => setModulesCount(Number(e.target.value))}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Syllabus outline, learning goals, and key takeaways..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
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
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Adding...' : 'Add Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
