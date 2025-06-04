import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';



@Controller('text-extraction')
@Auth(UserRoles.auditor)
export class TextExtractionController {
  constructor(private readonly textExtractionService: TextExtractionService) {}
  
  
  @Post('parse-pdf/:id')
  parsePdf(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parsePdf(id)
  }
  
  @Post('parse-docx/:id')
  parseDocx(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseDocx(id)
  }
  
  @Post('parse-csv/:id')
  parseCsv(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseCsv(id)
  }
  
  @Post('parse-excel/:id')
  parseExcel(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseExcel(id)
  }
}
