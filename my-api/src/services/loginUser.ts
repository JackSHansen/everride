import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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

  if (!user) throw new Error('Bruger findes ikke');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Forkert password');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const { password: _pw, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
