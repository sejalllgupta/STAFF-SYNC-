import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { Department, Role } from '../models/types';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = req.user!;
    let users = await UserModel.find();

    if (currentUser.role === 'employee') {
      // Employees see colleague directory with safe fields
      return res.status(200).json({
        success: true,
        users: users.map(({ password, ...u }) => u)
      });
    }

    if (currentUser.role === 'manager') {
      // Managers see their team and department
      const team = users.filter(
        u => u.managerId === currentUser._id || u.department === currentUser.department
      );
      return res.status(200).json({
        success: true,
        users: team.map(({ password, ...u }) => u)
      });
    }

    // HR sees full directory
    return res.status(200).json({
      success: true,
      users: users.map(({ password, ...u }) => u)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user directory.',
      error: error instanceof Error ? error.message : 'Unknown'
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password, ...userSafe } = user;
    return res.status(200).json({ success: true, user: userSafe });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user.' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      password = 'StaffSync@2026',
      role = 'employee',
      department = 'Engineering',
      designation,
      managerId,
      phone
    } = req.body;

    if (!name || !email || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and designation are required.'
      });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    const newUser = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: bcrypt.hashSync(password, 10),
      role: role as Role,
      department: department as Department,
      designation: designation.trim(),
      managerId: managerId || null,
      phone: phone || '+1 (555) 000-0000',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      leaveBalances: { annual: 20, sick: 10, casual: 5, unpaid: 0 }
    });

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: userSafe
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user record.'
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const userToUpdate = await UserModel.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Permission check: HR can update anything; Users can only update their own contact details
    if (currentUser.role !== 'hr' && currentUser._id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only update your own profile.'
      });
    }

    const updates: any = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    // Only HR can update role, department, designation, status, and leave balances
    if (currentUser.role === 'hr') {
      if (req.body.role) updates.role = req.body.role;
      if (req.body.department) updates.department = req.body.department;
      if (req.body.designation) updates.designation = req.body.designation;
      if (req.body.status) updates.status = req.body.status;
      if (req.body.managerId !== undefined) updates.managerId = req.body.managerId;
      if (req.body.leaveBalances) updates.leaveBalances = req.body.leaveBalances;
    }

    const updated = await UserModel.findByIdAndUpdate(id, updates);
    const { password: _, ...safeUpdated } = updated!;

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      user: safeUpdated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile.'
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'User removed successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};
