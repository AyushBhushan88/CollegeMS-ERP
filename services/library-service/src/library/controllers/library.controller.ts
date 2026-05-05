import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LibraryService } from '../services/library.service';
import { CreateBookDto, IssueBookDto, AddBookCopyDto, ReturnBookDto } from '../dto/library.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  async findAllBooks() {
    return this.libraryService.findAllBooks();
  }

  @Get('books/:id')
  async findBookDetails(@Param('id') id: string) {
    return this.libraryService.findBookDetails(id);
  }

  @Post('books')
  async createBook(@Body() data: CreateBookDto) {
    return this.libraryService.createBook(data);
  }

  @Post('books/:id/copies')
  async addBookCopy(@Param('id') id: string, @Body() data: AddBookCopyDto) {
    return this.libraryService.addBookCopy(id, data);
  }

  @Get('recent-issues')
  async getRecentIssues() {
    return this.libraryService.getRecentIssues();
  }

  @Post('issue')
  async issueBook(@Body() data: IssueBookDto) {
    return this.libraryService.issueBook(data);
  }

  @Post('return')
  async returnBook(@Body() data: ReturnBookDto) {
    return this.libraryService.returnBook(data);
  }
}
