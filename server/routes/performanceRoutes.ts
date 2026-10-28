import { Router } from 'express';
import { getReviews, createReview } from '../controllers/performanceController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

// Employees, Managers, HR
router.get('/', getReviews);

// Managers and HR can submit appraisals
router.post('/', authorizeRoles('manager', 'hr'), createReview);

export default router;
