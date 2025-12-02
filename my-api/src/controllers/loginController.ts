import { Request, Response } from 'express';
import { loginUser } from '../services/loginUser.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email og password er påkrævet' });
    const result = await loginUser(email, password);
    res.status(200).json({
      message: 'Login succesfuld',
      user: result.user,
      token: result.token,
    });
  } catch (e: any) {
    console.error(e);
    res.status(401).json({ message: e.message || 'Login fejlede' });
  }
};
