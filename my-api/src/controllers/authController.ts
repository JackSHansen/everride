import { Request, Response } from 'express';

export const getAuthenticatedUser = (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Ikke autoriseret' });
  return res.json({ user });
};
