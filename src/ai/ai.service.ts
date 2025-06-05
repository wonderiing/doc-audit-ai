import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TextExtractionService } from 'src/text-extraction/text-extraction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { Repository } from 'typeorm';
import { analyzeFileText } from './helpers/aiAnalysis.helper';
import { plainToInstance } from 'class-transformer';
import { AiAnalysisResponseDto } from './dto/ai-anlysis-response.dto';
import { getPlainObject } from './helpers/getPlainObject.helper';

@Injectable()
export class AiService {
  constructor(
    private readonly textExtractionService: TextExtractionService,
    @InjectRepository(AiAnalysis)
    private readonly aiAnalysisRepository: Repository<AiAnalysis>
  ){

  }


  async findExistingAnalysis(textExtractionId: number) {
    return this.aiAnalysisRepository.findOne({
      where: {text_extraction: {id: textExtractionId}}
    })
  }

  async analyzeTextExtraction(id: number) {

  const textExtraction = await this.textExtractionService.findOne(id)
  
  const existingAnalysis = await this.findExistingAnalysis(textExtraction.id) 
  if (existingAnalysis) {
    throw new BadRequestException(`File with id ${id} has already been analyzed.`);
  }

  const aiResponse = await analyzeFileText(textExtraction.raw_text)

    const aiAnalysis = this.aiAnalysisRepository.create({
      ai_response: aiResponse,
      text_extraction: textExtraction
    })
    try {
      await this.aiAnalysisRepository.save(aiAnalysis)
      const response = getPlainObject(aiAnalysis)
      return response
    } catch(error) {
      this.handleDbExceptions(error)
    }
  }

  handleDbExceptions(error: any) {
      if (error.code === '23505') throw new BadRequestException(`Already analyzed file with id: ${error.detail}. `)
      console.log(error)
      throw new InternalServerErrorException(`Something went wrong check logs`)
    }
}
