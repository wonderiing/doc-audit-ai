import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { join } from 'path';


@Controller('text-extraction')
export class TextExtractionController {
  constructor(private readonly textExtractionService: TextExtractionService) {}


  @Post('parse-pdf/:id')
  parsePdf(@Param('id', ParseIntPipe) id: number) {
    return this.textExtractionService.parsePdf(id)
  }
}
