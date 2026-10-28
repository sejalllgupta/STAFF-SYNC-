import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createPerformanceReviewThunk } from '../../store/slices/performanceSlice';
import { X, Award, Star, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateReviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(state => state.employee.employees);

  const [employeeId, setEmployeeId] = useState(employees[0]?._id || '');
  const [reviewPeriod, setReviewPeriod] = useState('Q4 2026');
  const [productivity, setProductivity] = useState(4);
  const [teamwork, setTeamwork] = useState(4);
  const [communication, setCommunication] = useState(4);
  const [innovation, setInnovation] = useState(4);
  const [leadership, setLeadership] = useState(3);
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [goalText, setGoalText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    setIsSubmitting(true);
    const goalsArray = goalText
      .split('\n')
      .map(g => g.trim())
      .filter(Boolean);

    const res = await dispatch(
      createPerformanceReviewThunk({
        employeeId,
        reviewPeriod,
        ratings: {
          productivity,
          teamwork,
          communication,
          innovation,
          leadership
        },
        strengths: strengths.trim() || 'Strong technical commitment and execution.',
        areasForImprovement: areasForImprovement.trim() || 'Proactive cross-functional communication.',
        goals: goalsArray.length > 0 ? goalsArray : ['Deliver key quarterly roadmap objectives'],
        feedback: feedback.trim() || 'Great performance throughout this evaluation period.'
      })
    );

    if (createPerformanceReviewThunk.fulfilled.match(res)) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Conduct Performance Review</h3>
              <p className="text-xs text-slate-400">Evaluate employee competency and set future OKRs</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Select Team Member
              </label>
              <select
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white"
                required
              >
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.department} - {emp.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Review Cycle
              </label>
              <input
                type="text"
                value={reviewPeriod}
                onChange={e => setReviewPeriod(e.target.value)}
                placeholder="e.g. Q4 2026 or Annual 2026"
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          {/* Star Competency Ratings */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
            <span className="text-xs font-bold text-slate-900 block">
              Competency Ratings (1 to 5 Stars)
            </span>

            {[
              { label: 'Productivity & Velocity', val: productivity, set: setProductivity },
              { label: 'Teamwork & Collaboration', val: teamwork, set: setTeamwork },
              { label: 'Communication Clarity', val: communication, set: setCommunication },
              { label: 'Innovation & Problem Solving', val: innovation, set: setInnovation },
              { label: 'Ownership & Leadership', val: leadership, set: setLeadership }
            ].map(metric => (
              <div key={metric.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-700">{metric.label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => metric.set(num)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          num <= metric.val
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 fill-slate-100'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-1 font-bold text-slate-700 font-mono w-4">{metric.val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Primary Strengths
              </label>
              <textarea
                value={strengths}
                onChange={e => setStrengths(e.target.value)}
                placeholder="Highlight standout accomplishments and competencies..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Areas for Growth
              </label>
              <textarea
                value={areasForImprovement}
                onChange={e => setAreasForImprovement(e.target.value)}
                placeholder="Actionable constructive suggestions..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Goals / Target OKRs (one per line)
            </label>
            <textarea
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              placeholder="e.g. Spearhead automated CI/CD deployment pipeline&#10;Lead 2 technical guild workshops"
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Executive Feedback Summary
            </label>
            <input
              type="text"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Final concluding remarks for the appraisal record..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
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
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Appraisal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
