import { BookStatus } from '@campuscore/shared-constants';

export interface Book {
  id: string;
  title: string;
  isbn: string;
  author: string;
  publisher: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCopy {
  id: string;
  bookId: string;
  accessionNumber: string;
  status: BookStatus;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueRecord {
  id: string;
  bookCopyId: string;
  studentId?: string | null;
  employeeId?: string | null;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  fineAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
