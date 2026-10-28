import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPerformanceReviews } from '../../store/slices/performanceSlice';
import { Award, Star, Target, MessageSquare, Plus, User, Calendar } from 'lucide-react';

interface Props {
  onOpenCreateModal?: () => void;
  canReview?: boolean;
}

export const PerformanceReviewsList: React.FC<Props> = ({ onOpenCreateModal, canReview = false }) => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(state => state.performance.reviews);
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchPerformanceReviews());
  }, [dispatch]);

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(score)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Performance & Appraisal Reviews</h3>
            <p className="text-xs text-slate-500">
              Objective competency ratings, quarterly OKR tracking, and structured manager evaluations
            </p>
          </div>
        </div>

        {canReview && onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Conduct Review</span>
          </button>
        )}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No appraisal records found.
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {review.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{review.employeeName}</h4>
                    <p className="text-xs text-slate-500">
                      {review.employeeDepartment} • Review Period: {review.reviewPeriod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 font-mono">
                      {review.overallScore} / 5.0
                    </span>
                    <div className="mt-0.5">{renderStars(review.overallScore)}</div>
                  </div>
                </div>
              </div>

              {/* Competency breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Productivity</span>
                  <span className="font-bold text-slate-800">{review.ratings.productivity}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Teamwork</span>
                  <span className="font-bold text-slate-800">{review.ratings.teamwork}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Communication</span>
                  <span className="font-bold text-slate-800">{review.ratings.communication}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Innovation</span>
                  <span className="font-bold text-slate-800">{review.ratings.innovation}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Leadership</span>
                  <span className="font-bold text-slate-800">{review.ratings.leadership}/5</span>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-800 block mb-1">Key Strengths</span>
                  <p className="text-slate-600 leading-relaxed">{review.strengths}</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-800 block mb-1">Growth Opportunities</span>
                  <p className="text-slate-600 leading-relaxed">{review.areasForImprovement}</p>
                </div>
              </div>

              {/* Goals */}
              {review.goals && review.goals.length > 0 && (
                <div className="text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    Target OKRs & Milestones
                  </span>
                  <ul className="space-y-1 pl-4 list-disc text-slate-600">
                    {review.goals.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback and Reviewer signature */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic text-slate-500">"{review.feedback}"</span>
                <span className="whitespace-nowrap">
                  Reviewed by {review.reviewerName} ({review.reviewerRole.toUpperCase()})
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
