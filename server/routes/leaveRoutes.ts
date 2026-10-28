import { Router } from 'express';
import {
  applyLeave,
  getMyLeaves,
  getTeamLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

// Employee actions
router.post('/', applyLeave);
router.get('/my', getMyLeaves);

// Manager team review
router.get('/team', authorizeRoles('manager', 'hr'), getTeamLeaves);

// HR all leaves review
router.get('/all', authorizeRoles('hr'), getAllLeaves);

// Status update (approve/reject/cancel)
router.patch('/:id/status', updateLeaveStatus);

export default router;
