import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async findOneByFileId(fileId: number) {
    
    const aiAnalysis = await this.aiAnalysisRepository.findOne({
      where: {text_extraction: {file: {id: fileId}}},
      loadRelationIds: true, 

    })

    if (!aiAnalysis) throw new NotFoundException(`Analyze with file id ${fileId} was not found, file may not be analyzed yet`)
    
    return aiAnalysis
  }

  async findAnalysisByTextExtractionId(textExtractionId: number): Promise<AiAnalysis | null> {
    const aiAnalysis = await this.aiAnalysisRepository.findOne({
      where: {text_extraction: {id: textExtractionId}}
    })

    return aiAnalysis
  }

  async analyzeTextExtraction(id: number): Promise<AiAnalysisResponseDto> {

  const textExtraction = await this.textExtractionService.findOne(id)
  
  const existingAnalysis = await this.findAnalysisByTextExtractionId(textExtraction.id) 
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

  handleDbExceptions(error: any): never {
      if (error.code === '23505') throw new BadRequestException(`Already analyzed file with id: ${error.detail}. `)
      console.error(error)
      throw new InternalServerErrorException(`Something went wrong check logs`)
    }
}
