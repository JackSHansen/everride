import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Authorization header mangler' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authorization format skal være: Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Ugyldig eller udløbet token' });
  }
};

export const authorizeRoles =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const role = String(user.role || '');
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
