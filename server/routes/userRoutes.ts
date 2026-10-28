import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// Directory access: Employees, Managers, and HR
router.get('/', getUsers);
router.get('/:id', getUserById);

// Update user: Self (contact info) or HR (all fields)
router.put('/:id', updateUser);

// HR Personnel only operations
router.post('/', authorizeRoles('hr'), createUser);
router.delete('/:id', authorizeRoles('hr'), deleteUser);

export default router;
