import { Response } from 'express';
import { TrainingModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTrainings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const list = await TrainingModel.find(t => t.assignedRoles.includes(user.role));

    return res.status(200).json({
      success: true,
      trainings: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve training courses.'
    });
  }
};

export const createTraining = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category = 'Compliance',
      duration = '1 hour',
      modulesCount = 4,
      assignedRoles = ['employee', 'manager', 'hr'],
      thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.'
      });
    }

    const newTraining = await TrainingModel.create({
      title: title.trim(),
      description: description.trim(),
      category,
      duration,
      modulesCount: Number(modulesCount),
      assignedRoles,
      thumbnailUrl,
      userProgress: {}
    });

    return res.status(201).json({
      success: true,
      message: 'Training module added to curriculum.',
      training: newTraining
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create training course.'
    });
  }
};

export const updateTrainingProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, progressPercent, score } = req.body;
    const userId = req.user!._id;

    const course = await TrainingModel.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Training course not found.' });
    }

    const currentProgress = course.userProgress || {};
    const updatedProgress = {
      ...currentProgress,
      [userId]: {
        status: status || 'in_progress',
        progressPercent: progressPercent ?? (status === 'completed' ? 100 : 50),
        score: score ?? 100,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined
      }
    };

    const updated = await TrainingModel.findByIdAndUpdate(id, {
      userProgress: updatedProgress
    });

    return res.status(200).json({
      success: true,
      message: status === 'completed' ? 'Congratulations! Module completed.' : 'Progress saved.',
      training: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update module progress.'
    });
  }
};
