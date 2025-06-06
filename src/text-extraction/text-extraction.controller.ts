import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';



@Controller('text-extraction')
@Auth(UserRoles.auditor)
export class TextExtractionController {
  constructor(private readonly textExtractionService: TextExtractionService) {}
  
  /*
    Recieves a fileId
  */
  
  @Get('parse-pdf/:id')
  parsePdf(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parsePdf(id)
  }
  
  @Get('parse-docx/:id')
  parseDocx(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseDocx(id)
  }
  
  @Get('parse-csv/:id')
  parseCsv(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseCsv(id)
  }
  
  @Get('parse-excel/:id')
  parseExcel(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parseExcel(id)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.findOne(id)
  }
}
