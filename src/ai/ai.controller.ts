import { Controller,Post, Param, ParseIntPipe, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}



  /* 
  Receives a TextExtractionEntity id
  */
  @Post(':id')
  @Auth(UserRoles.auditor)
  aiAnalysis(@Param('id', ParseIntPipe) id: number) {
    return this.aiService.analyzeTextExtraction(id)
  }

  @Get(':fileId')
  @Auth()
  findOneByFileId(@Param('fileId', ParseIntPipe) id: number) {
    return this.aiService.findOneByFileId(id)
  }
}
