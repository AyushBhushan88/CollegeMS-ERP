export const Permissions = {
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  STUDENTS_READ: 'students:read',
  STUDENTS_CREATE: 'students:create',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_MARK: 'attendance:mark',
  ATTENDANCE_UPDATE: 'attendance:update',

  FEES_READ: 'fees:read',
  FEES_PAY: 'fees:pay',
  FEES_MANAGE: 'fees:manage',

  EXAMS_READ: 'exams:read',
  EXAMS_MANAGE: 'exams:manage',
  EXAMS_MARK_ENTRY: 'exams:mark-entry',

  REPORTS_READ: 'reports:read',
  REPORTS_GENERATE: 'reports:generate',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
