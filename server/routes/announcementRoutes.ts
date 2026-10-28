import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

// All authenticated roles can read announcements
router.get('/', getAnnouncements);

// HR only can post and delete
router.post('/', authorizeRoles('hr'), createAnnouncement);
router.delete('/:id', authorizeRoles('hr'), deleteAnnouncement);

export default router;
