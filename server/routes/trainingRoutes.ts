import { Router } from 'express';
import {
  getTrainings,
  createTraining,
  updateTrainingProgress
} from '../controllers/trainingController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getTrainings);
router.patch('/:id/progress', updateTrainingProgress);

// HR only can add new courses
router.post('/', authorizeRoles('hr'), createTraining);

export default router;
