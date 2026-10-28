import { Response } from 'express';
import { LeaveModel, UserModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { LeaveStatus, LeaveType } from '../models/types';

const calculateDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields (leaveType, startDate, endDate, reason) are required.'
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date.'
      });
    }

    const totalDays = calculateDays(startDate, endDate);

    // Check available leave balance (for annual, sick, casual)
    const validTypes: LeaveType[] = ['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid'];
    if (!validTypes.includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type specified.'
      });
    }

    const currentBalances = user.leaveBalances;
    if (['annual', 'sick', 'casual'].includes(leaveType)) {
      const balance = (currentBalances as any)[leaveType] ?? 0;
      if (balance < totalDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient ${leaveType} leave balance. Available: ${balance} days, Requested: ${totalDays} days.`
        });
      }
    }

    const newLeave = await LeaveModel.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      department: user.department,
      managerId: user.managerId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason: reason.trim(),
      status: 'pending',
      reviewedBy: null,
      reviewerRole: null,
      reviewerComments: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: `Leave request of ${totalDays} day(s) submitted successfully. Your manager has been notified.`,
      leave: newLeave
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit leave application.'
    });
  }
};

export const getMyLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const leaves = await LeaveModel.find(l => l.userId === userId);
    leaves.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const user = await UserModel.findById(userId);

    return res.status(200).json({
      success: true,
      leaves,
      balances: user?.leaveBalances
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch personal leave requests.'
    });
  }
};

export const getTeamLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const manager = req.user!;
    // Finds leaves submitted by direct reports or within same department
    const leaves = await LeaveModel.find(
      l => l.managerId === manager._id || l.department === manager.department
    );
    leaves.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team leave requests.'
    });
  }
};

export const getAllLeaves = async (_req: AuthRequest, res: Response) => {
  try {
    const leaves = await LeaveModel.find();
    leaves.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch all company leaves.'
    });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments = '' } = req.body;
    const reviewer = req.user!;

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or cancelled.'
      });
    }

    const leave = await LeaveModel.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.'
      });
    }

    // Role check: Employee can only cancel their own pending leave; Manager or HR can approve/reject
    if (reviewer.role === 'employee') {
      if (leave.userId !== reviewer._id || status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Employees can only cancel their own pending requests.'
        });
      }
    }

    const previousStatus = leave.status;
    const updatedLeave = await LeaveModel.findByIdAndUpdate(id, {
      status: status as LeaveStatus,
      reviewedBy: reviewer.name,
      reviewerRole: reviewer.role,
      reviewerComments: comments.trim() || `Processed by ${reviewer.name} (${reviewer.role.toUpperCase()})`,
      updatedAt: new Date().toISOString()
    });

    // If newly approved, deduct leave balance from user
    if (status === 'approved' && previousStatus !== 'approved') {
      const applicant = await UserModel.findById(leave.userId);
      if (applicant && ['annual', 'sick', 'casual'].includes(leave.leaveType)) {
        const type = leave.leaveType as 'annual' | 'sick' | 'casual';
        const currentBal = applicant.leaveBalances[type] || 0;
        const newBal = Math.max(0, currentBal - leave.totalDays);
        await UserModel.findByIdAndUpdate(applicant._id, {
          leaveBalances: {
            ...applicant.leaveBalances,
            [type]: newBal
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Leave request marked as ${status.toUpperCase()}.`,
      leave: updatedLeave
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update leave request.'
    });
  }
};
