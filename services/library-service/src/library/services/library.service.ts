import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto, AddBookCopyDto, IssueBookDto, ReturnBookDto } from '../dto/library.dto';
import { BookStatus } from '@campuscore/database';
import { EventBusService } from '../../event-bus/event-bus.service';

@Injectable()
export class LibraryService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async createBook(dto: CreateBookDto) {
    const existing = await this.prisma.book.findUnique({
      where: { isbn: dto.isbn },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.book.create({
      data: dto,
    });
  }

  async addBookCopy(bookId: string, dto: AddBookCopyDto) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const existingCopy = await this.prisma.bookCopy.findUnique({
      where: { accessionNumber: dto.accessionNumber },
    });

    if (existingCopy) throw new BadRequestException('Accession number already exists');

    return this.prisma.bookCopy.create({
      data: {
        bookId,
        accessionNumber: dto.accessionNumber,
        location: dto.location,
        status: BookStatus.AVAILABLE,
      },
    });
  }

  async findAllBooks() {
    return this.prisma.book.findMany({
      include: {
        _count: {
          select: { copies: true }
        }
      }
    });
  }

  async findBookDetails(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        copies: true,
      },
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async issueBook(dto: IssueBookDto) {
    const copy = await this.prisma.bookCopy.findUnique({
      where: { accessionNumber: dto.accessionNumber },
      include: { book: true }
    });

    if (!copy) throw new NotFoundException('Book copy not found');
    if (copy.status !== BookStatus.AVAILABLE) {
      throw new BadRequestException(`Book is currently ${copy.status.toLowerCase()}`);
    }

    if (!dto.studentId && !dto.employeeId) {
      throw new BadRequestException('Either studentId or employeeId must be provided');
    }

    let userEmail = '';
    let userName = '';

    if (dto.studentId) {
      const student = await this.prisma.student.findUnique({
        where: { id: dto.studentId },
        include: { user: true }
      });
      userEmail = student?.user.email || '';
      userName = `${student?.user.firstName} ${student?.user.lastName}`;
    } else {
      const employee = await this.prisma.employeeProfile.findUnique({
        where: { id: dto.employeeId },
        include: { user: true }
      });
      userEmail = employee?.user.email || '';
      userName = `${employee?.user.firstName} ${employee?.user.lastName}`;
    }

    const result = await this.prisma.client.$transaction(async (tx) => {
      // Update copy status
      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: BookStatus.ISSUED },
      });

      // Create issue record
      return tx.issueRecord.create({
        data: {
          bookCopyId: copy.id,
          studentId: dto.studentId,
          employeeId: dto.employeeId,
          dueDate: new Date(dto.dueDate),
        },
      });
    });

    await this.eventBus.publish('library.events', 'book.issued', {
      issueId: result.id,
      bookTitle: copy.book.title,
      accessionNumber: copy.accessionNumber,
      userEmail,
      userName,
      dueDate: dto.dueDate,
    });

    return result;
  }

  async returnBook(dto: ReturnBookDto) {
    const copy = await this.prisma.bookCopy.findUnique({
      where: { accessionNumber: dto.accessionNumber },
      include: {
        book: true,
        issues: {
          where: { returnDate: null },
          orderBy: { issueDate: 'desc' },
          take: 1,
          include: {
            student: { include: { user: true } },
            employee: { include: { user: true } },
          }
        },
      },
    });

    if (!copy) throw new NotFoundException('Book copy not found');
    if (copy.status !== BookStatus.ISSUED || copy.issues.length === 0) {
      throw new BadRequestException('Book is not currently issued');
    }

    const issue = copy.issues[0];
    const returnDate = new Date();
    let fineAmount = 0;

    // Simple fine calculation: 5 units per day after due date
    if (returnDate > issue.dueDate) {
      const diffTime = Math.abs(returnDate.getTime() - issue.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 5;
    }

    const result = await this.prisma.client.$transaction(async (tx) => {
      // Update copy status
      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: BookStatus.AVAILABLE },
      });

      // Update issue record
      return tx.issueRecord.update({
        where: { id: issue.id },
        data: {
          returnDate,
          fineAmount,
        },
      });
    });

    const user = issue.student ? issue.student.user : issue.employee?.user;

    if (user) {
      await this.eventBus.publish('library.events', 'book.returned', {
        issueId: issue.id,
        bookTitle: copy.book.title,
        accessionNumber: copy.accessionNumber,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        fineAmount,
      });
    }

    return result;
  }

  async getRecentIssues() {
    return this.prisma.issueRecord.findMany({
      take: 10,
      orderBy: { issueDate: 'desc' },
      include: {
        bookCopy: {
          include: { book: true }
        },
        student: { include: { user: true } },
        employee: { include: { user: true } },
      }
    });
  }
}
