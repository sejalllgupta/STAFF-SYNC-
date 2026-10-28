import { Router } from 'express';
import {
  getTodayAttendance,
  clockIn,
  clockOut,
  getMyHistory,
  getTeamAttendance,
  getCompanyAttendance
} from '../controllers/attendanceController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

// Employee actions
router.get('/today', getTodayAttendance);
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/my-history', getMyHistory);

// Manager team monitoring
router.get('/team', authorizeRoles('manager', 'hr'), getTeamAttendance);

// HR company-wide tracking
router.get('/company', authorizeRoles('hr'), getCompanyAttendance);

export default router;
