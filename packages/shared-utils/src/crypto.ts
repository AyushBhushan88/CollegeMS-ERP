import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
};

export const generateToken = (
  payload: any,
  secret: string,
  expiresIn: string | number = '1d',
): string => {
  return jwt.sign(payload, secret as jwt.Secret, { expiresIn: expiresIn as any });
};

export const verifyToken = <T>(token: string, secret: string): T | null => {
  try {
    return jwt.verify(token, secret as jwt.Secret) as T;
  } catch (error) {
    return null;
  }
};
