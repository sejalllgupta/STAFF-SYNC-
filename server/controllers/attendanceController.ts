import { Response } from 'express';
import { AttendanceModel, UserModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { AttendanceStatus, WorkLocation } from '../models/types';

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodayAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const today = getTodayDateString();

    const record = await AttendanceModel.findOne(
      att => att.userId === userId && att.date === today
    );

    return res.status(200).json({
      success: true,
      hasClockedIn: !!record,
      hasClockedOut: !!(record && record.clockOut),
      attendance: record
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve today’s attendance status.'
    });
  }
};

export const clockIn = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const today = getTodayDateString();

    // Enforce one attendance record per employee per day
    const existing = await AttendanceModel.findOne(
      att => att.userId === user._id && att.date === today
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked in for today.'
      });
    }

    const { workLocation = 'Office', notes = '' } = req.body;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Check if late (after 09:15 AM)
    const isLate = currentHour > 9 || (currentHour === 9 && currentMinutes > 15);
    const status: AttendanceStatus = isLate ? 'late' : 'present';

    const newRecord = await AttendanceModel.create({
      userId: user._id,
      userName: user.name,
      department: user.department,
      date: today,
      clockIn: now.toISOString(),
      clockOut: null,
      durationHours: 0,
      status,
      workLocation: workLocation as WorkLocation,
      notes: notes.trim()
    });

    return res.status(201).json({
      success: true,
      message: `Clock-in recorded successfully at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Status: ${status.toUpperCase()}.`,
      attendance: newRecord
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Clock-in failed.'
    });
  }
};

export const clockOut = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const today = getTodayDateString();

    const existing = await AttendanceModel.findOne(
      att => att.userId === user._id && att.date === today
    );

    if (!existing) {
      return res.status(400).json({
        success: false,
        message: 'No clock-in record found for today. Please clock in first.'
      });
    }

    if (existing.clockOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked out for today.'
      });
    }

    const now = new Date();
    const inTime = new Date(existing.clockIn).getTime();
    const outTime = now.getTime();
    const durationHours = parseFloat(((outTime - inTime) / (1000 * 60 * 60)).toFixed(2));

    let finalStatus = existing.status;
    // If worked less than 4 hours, mark as half day
    if (durationHours < 4 && existing.status !== 'absent') {
      finalStatus = 'half_day';
    }

    const updated = await AttendanceModel.findByIdAndUpdate(existing._id, {
      clockOut: now.toISOString(),
      durationHours,
      status: finalStatus,
      notes: req.body.notes ? `${existing.notes ? existing.notes + ' | ' : ''}Clock-out note: ${req.body.notes}` : existing.notes
    });

    return res.status(200).json({
      success: true,
      message: `Clock-out recorded successfully. Total active duration: ${durationHours} hours.`,
      attendance: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Clock-out failed.'
    });
  }
};

export const getMyHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const history = await AttendanceModel.find(att => att.userId === userId);
    // Sort descending by date
    history.sort((a, b) => (a.date < b.date ? 1 : -1));

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance history.'
    });
  }
};

export const getTeamAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const manager = req.user!;
    const teamUsers = await UserModel.find(
      u => u.managerId === manager._id || u.department === manager.department
    );
    const teamUserIds = new Set(teamUsers.map(u => u._id));

    const records = await AttendanceModel.find(att => teamUserIds.has(att.userId));
    records.sort((a, b) => (a.date < b.date ? 1 : -1));

    return res.status(200).json({
      success: true,
      teamAttendance: records
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch team attendance.'
    });
  }
};

export const getCompanyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { department, date, status } = req.query;

    let records = await AttendanceModel.find();

    if (department && department !== 'All') {
      records = records.filter(r => r.department === department);
    }
    if (date) {
      records = records.filter(r => r.date === date);
    }
    if (status && status !== 'All') {
      records = records.filter(r => r.status === status);
    }

    records.sort((a, b) => (a.date < b.date ? 1 : -1));

    return res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve company attendance.'
    });
  }
};
