import { Router } from 'express';
import { getDashboardStats } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

// Reports are restricted to HR
router.get('/dashboard-stats', authorizeRoles('hr'), getDashboardStats);

export default router;
