import { UserRole, Gender, Category } from '@campuscore/shared-constants';
import { z } from 'zod';

export const commonSchemas = {
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number. Must be 10 digits.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  enrollmentNumber: z.string().min(5).max(30),
  date: z.coerce.date(),
  amount: z.number().positive(),
  zipCode: z.string().regex(/^[0-9]{6}$/, 'Invalid ZIP code. Must be 6 digits.'),
};

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: commonSchemas.zipCode,
});

export const loginSchema = z.object({
  email: commonSchemas.email,
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: commonSchemas.phone.optional(),
  role: z.nativeEnum(UserRole),
});

export const studentCreateSchema = z.object({
  userId: commonSchemas.id,
  enrollmentNumber: commonSchemas.enrollmentNumber,
  programId: commonSchemas.id,
  branchId: commonSchemas.id,
  batchYear: z.number().int().min(2000).max(2100),
  currentSemester: z.number().int().min(1).max(12),
  admissionDate: commonSchemas.date,
  category: z.nativeEnum(Category),
  dateOfBirth: commonSchemas.date,
  gender: z.nativeEnum(Gender),
  permanentAddress: addressSchema,
  correspondenceAddress: addressSchema,
  guardianName: z.string().min(1),
  guardianPhone: commonSchemas.phone,
  guardianEmail: commonSchemas.email.optional().nullable(),
  guardianRelation: z.string().min(1),
});
