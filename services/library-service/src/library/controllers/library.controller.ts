import { Controller, Post, Body, Param } from '@nestjs/common';
import { LibraryService } from '../services/library.service';
import { CreateBookDto, IssueBookDto } from '../dto/library.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('books')
  async createBook(@Body() data: CreateBookDto) {
    return this.libraryService.createBook(data);
  }

  @Post('issue')
  async issueBook(@Body() data: IssueBookDto) {
    return this.libraryService.issueBook(data);
  }

  @Post('return/:bookId')
  async returnBook(@Param('bookId') bookId: string) {
    return this.libraryService.returnBook(bookId);
  }
}
