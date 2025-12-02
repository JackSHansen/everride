import { Request, Response } from 'express';
import { loginUser, AuthError } from '../services/loginUser.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email og password er påkrævet' });

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: 'Login succesfuld',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Login fejlede' });
  }
};
