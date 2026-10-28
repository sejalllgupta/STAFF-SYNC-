import { Response } from 'express';
import { PerformanceModel, UserModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { Department } from '../models/types';

export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let reviews = await PerformanceModel.find();

    if (user.role === 'employee') {
      reviews = reviews.filter(r => r.employeeId === user._id);
    } else if (user.role === 'manager') {
      // Manager sees reviews for their department or team members, or their own reviews
      reviews = reviews.filter(
        r => r.reviewerId === user._id || r.employeeDepartment === user.department || r.employeeId === user._id
      );
    }
    // HR sees all reviews

    reviews.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve performance reviews.'
    });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const reviewer = req.user!;
    const {
      employeeId,
      reviewPeriod,
      ratings,
      strengths,
      areasForImprovement,
      goals = [],
      feedback
    } = req.body;

    if (!employeeId || !reviewPeriod || !ratings) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, review period, and ratings are required.'
      });
    }

    const employee = await UserModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const { productivity = 4, teamwork = 4, communication = 4, innovation = 4, leadership = 4 } = ratings;
    const overallScore = parseFloat(
      ((productivity + teamwork + communication + innovation + leadership) / 5).toFixed(1)
    );

    const newReview = await PerformanceModel.create({
      employeeId: employee._id,
      employeeName: employee.name,
      employeeDepartment: employee.department as Department,
      reviewerId: reviewer._id,
      reviewerName: reviewer.name,
      reviewerRole: reviewer.role,
      reviewPeriod,
      ratings: { productivity, teamwork, communication, innovation, leadership },
      overallScore,
      strengths: strengths?.trim() || 'Demonstrates strong work ethic.',
      areasForImprovement: areasForImprovement?.trim() || 'Continue expanding domain expertise.',
      goals: Array.isArray(goals) ? goals : [goals],
      feedback: feedback?.trim() || 'Keep exceeding expectations.',
      status: 'submitted',
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Performance appraisal submitted.',
      review: newReview
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review.'
    });
  }
};
