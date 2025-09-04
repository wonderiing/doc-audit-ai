import { Controller,Post, Param, ParseIntPipe, Get, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';
import { AiForecastRequestDto } from './dto/forecast-sales.request.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}



  /* 
  Receives a TextExtractionEntity id
  */
   @Post('data/:id')
   @Auth(UserRoles.auditor)
  aiAnalysisData(@Param('id', ParseIntPipe) id: number) {
    return this.aiService.analyzeData(id)
  }

  @Post('contract/:id')
  @Auth(UserRoles.auditor)
  aiAnalysisContract(@Param('id', ParseIntPipe) id: number) {
    return this.aiService.analyzeContract(id)
  }


  @Get(':fileId')
  @Auth()
  findOneByFileId(@Param('fileId', ParseIntPipe) id: number) {
    return this.aiService.findOneByFileId(id)
  }

  @Post('/forecast/')
  @Auth()
  forecastSales(@Body() aiForecastRequestDto: AiForecastRequestDto) {
   return this.aiService.forecastSales(aiForecastRequestDto)
  }
}
