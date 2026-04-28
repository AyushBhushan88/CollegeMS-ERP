import { UserRole } from '@campuscore/shared-constants';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {}

export interface AuthUser extends User {
  passwordHash: string;
}
