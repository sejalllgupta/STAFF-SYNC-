import { Response } from 'express';
import { AnnouncementModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let list = await AnnouncementModel.find();

    // Filter by department if targeted
    list = list.filter(
      a => a.targetDepartment === 'All' || a.targetDepartment === user.department
    );

    // Sort: pinned items first, then by createdAt descending
    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });

    return res.status(200).json({
      success: true,
      announcements: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcements.'
    });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const author = req.user!;
    const { title, content, category = 'General', priority = 'medium', targetDepartment = 'All', isPinned = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.'
      });
    }

    const newAnnouncement = await AnnouncementModel.create({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      targetDepartment,
      authorName: author.name,
      authorId: author._id,
      isPinned: Boolean(isPinned),
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Company announcement broadcasted successfully.',
      announcement: newAnnouncement
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement.'
    });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await AnnouncementModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Announcement deleted.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting announcement.' });
  }
};
