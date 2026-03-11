'use server';

import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db-connect';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || 'key';

export interface ConfirmEmailData {
  token: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

interface User {
  email: string;
  password: string;
}

export async function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function register(data: {
  email: string;
  password: string;
  role?: string;
}): Promise<User | { error: string }> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const response = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || 'ADMIN',
      },
    });

    return response;
  } catch (error) {
    console.log('💥 Erreur dans register:', error);
    throw new Error('Registration failed');
  }
}

export async function getOneAdmin() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    return admin;
  } catch (error) {
    console.log('💥 Erreur:', error);
    throw new Error('verify failed');
  }
}

export const login = async (data: User) => {
  try {
    const result = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const isPasswordValid = result
      ? await bcrypt.compare(data.password, result.password)
      : false;

    if (!result || !isPasswordValid) {
      throw new Error('Connexion echouée');
    }

    return result;
  } catch (err) {
    console.error('💥Erreur dans login:', err);
    return { error: 'Veuillez vérifier vos identifiants et réessayer' };
  }
};

export const getAllUsers = async () => {
  try {
    const res = await prisma.user.findMany();

    return res;
  } catch (error) {
    return [];
  }
};
