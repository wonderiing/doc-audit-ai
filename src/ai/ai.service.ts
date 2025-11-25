import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TextExtractionService } from 'src/text-extraction/text-extraction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { Repository } from 'typeorm';
import { analyzeLegalContract } from './helpers/aiAnalysis.helper';
import { plainToInstance } from 'class-transformer';
import { AiAnalysisResponseDto } from './dto/ai-anlysis-response.dto';
import { getPlainObject } from './helpers/getPlainObject.helper';
import { analazyData } from './helpers/aiDataAnalysis.helper';
import { anonymizeContract } from './helpers/anonymizeContracts.helper';
import { FileDocument } from 'src/files/entities/file-document.entity';
import { promises as fs } from 'fs';
import { FormData, File } from 'formdata-node';
import { AiForecastRequestDto } from './dto/forecast-sales.request.dto';




@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly textExtractionService: TextExtractionService,
    @InjectRepository(AiAnalysis)
    private readonly aiAnalysisRepository: Repository<AiAnalysis>,
    @InjectRepository(FileDocument)
    private readonly fileDocumentRepository: Repository<FileDocument>
  ) {

  }

  async findOneByFileId(fileId: number) {

    const aiAnalysis = await this.aiAnalysisRepository.findOne({
      where: { text_extraction: { file: { id: fileId } } },
      loadRelationIds: true,

    })

    if (!aiAnalysis) throw new NotFoundException(`Analyze with file id ${fileId} was not found, file may not be analyzed yet`)

    return aiAnalysis
  }

  async findAnalysisByTextExtractionId(textExtractionId: number): Promise<AiAnalysis | null> {
    const aiAnalysis = await this.aiAnalysisRepository.findOne({
      where: { text_extraction: { id: textExtractionId } }
    })

    return aiAnalysis
  }


  async forecastSales(aiForecastRequestDto: AiForecastRequestDto) {

    const { fileId, level, n_days } = aiForecastRequestDto

    const file = await this.fileDocumentRepository.findOne({
      where: { id: fileId, is_active: true }
    });

    if (!file) {
      throw new NotFoundException(`Archivo con id ${fileId} no encontrado`);
    }

    if (!['.csv', '.xlsx'].some(ext => file.filename.toLowerCase().endsWith(ext))) {
      throw new BadRequestException('Solo se permiten archivos CSV o XLSX para forecast');
    }

    const buffer = await fs.readFile(file.path);

    const formData = new FormData();
    formData.append(
      'file',
      new File([buffer], file.filename, {
        type: file.filename.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    );
    formData.append('level', level);
    formData.append('n_days', n_days);

    const forecastServiceUrl = process.env.FORECAST_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${forecastServiceUrl}/predict-sales/`, {
      method: 'POST',
      body: formData as any,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new BadRequestException(`Error en forecast service: ${error}`);
    }

    return await response.json();
  }



  async analyzeContract(id: number): Promise<AiAnalysisResponseDto> {
    const textExtraction = await this.textExtractionService.findOne(id);

    const existingAnalysis = await this.findAnalysisByTextExtractionId(textExtraction.id);
    if (existingAnalysis) {
      throw new BadRequestException(`File with id ${id} has already been analyzed.`);
    }

    const anonymizedText = anonymizeContract(textExtraction.raw_text);

    const aiResponse = await analyzeLegalContract(anonymizedText);

    const aiAnalysis = this.aiAnalysisRepository.create({
      ai_response: aiResponse,
      text_extraction: textExtraction
    });

    try {
      await this.aiAnalysisRepository.save(aiAnalysis);
      const response = getPlainObject(aiAnalysis);
      return response;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }



  async analyzeData(id: number): Promise<AiAnalysisResponseDto> {

    const textExtraction = await this.textExtractionService.findOne(id)

    const existingAnalysis = await this.findAnalysisByTextExtractionId(textExtraction.id)
    if (existingAnalysis) {
      throw new BadRequestException(`File with id ${id} has already been analyzed.`);
    }

    const aiResponse = await analazyData(textExtraction.raw_text)

    const aiAnalysis = this.aiAnalysisRepository.create({
      ai_response: aiResponse,
      text_extraction: textExtraction
    })
    try {
      await this.aiAnalysisRepository.save(aiAnalysis)
      const response = getPlainObject(aiAnalysis)
      return response
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  handleDbExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(`Already analyzed file with id: ${error.detail}. `)
    this.logger.error('DB Exception', error.stack);
    throw new InternalServerErrorException(`Something went wrong check logs`)
  }
}
