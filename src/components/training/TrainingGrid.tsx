import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTrainings, updateTrainingProgressThunk } from '../../store/slices/trainingSlice';
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Plus,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onOpenAddModal?: () => void;
  isHR?: boolean;
}

export const TrainingGrid: React.FC<Props> = ({ onOpenAddModal, isHR = false }) => {
  const dispatch = useAppDispatch();
  const trainings = useAppSelector(state => state.training.trainings);
  const user = useAppSelector(state => state.auth.user);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch]);

  const handleStartCourse = async (courseId: string) => {
    await dispatch(
      updateTrainingProgressThunk({
        id: courseId,
        status: 'in_progress',
        progressPercent: 50
      })
    );
  };

  const handleCompleteCourse = async (courseId: string) => {
    const res = await dispatch(
      updateTrainingProgressThunk({
        id: courseId,
        status: 'completed',
        progressPercent: 100,
        score: Math.floor(Math.random() * 11) + 90 // 90 - 100
      })
    );

    if (updateTrainingProgressThunk.fulfilled.match(res)) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Training & Skill Development</h3>
            <p className="text-xs text-slate-500">
              Corporate compliance, security certifications, and technical mastery paths
            </p>
          </div>
        </div>

        {isHR && onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainings.map(course => {
          const progress = user ? course.userProgress?.[user._id] : undefined;
          const status = progress?.status || 'not_started';
          const percent = progress?.progressPercent || 0;

          return (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-36 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-slate-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{course.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Modules count */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {course.modulesCount} Interactive Modules
                    </span>
                    {status === 'completed' && progress?.score && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        Score: {progress.score}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="pt-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 pt-1">
                {status === 'completed' ? (
                  <div className="py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Certified & Completed</span>
                  </div>
                ) : status === 'in_progress' ? (
                  <button
                    onClick={() => handleCompleteCourse(course._id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Final Exam (100%)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartCourse(course._id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Training Course</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
