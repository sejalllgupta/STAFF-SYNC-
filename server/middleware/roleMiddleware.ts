import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { Role } from '../models/types';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User session not verified.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Insufficient privileges. Allowed roles: [${allowedRoles.join(', ')}]. Current role: '${req.user.role}'.`
      });
    }

    next();
  };
};
