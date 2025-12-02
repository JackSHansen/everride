import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) throw new AuthError('Ugyldige legitimationsoplysninger', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AuthError('Ugyldige legitimationsoplysninger', 401);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const { password: _pw, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
