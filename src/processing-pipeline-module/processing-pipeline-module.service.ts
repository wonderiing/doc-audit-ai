import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { TextExtractionService } from 'src/text-extraction/text-extraction.service';
import { AiService } from 'src/ai/ai.service';
import { FilesService } from 'src/files/files.service';
import { FileType } from 'src/files/interfaces/file-type.interface';
import { ProcessingPipelineResponseDto } from './dto/response.dto';
import { mapToProcessingPipelineResponseDto } from './helper/mapper.helper';
import { PipelinePlainResponse } from './interfaces/proccess-pipeline-response.interface';

@Injectable()
export class ProcessingPipelineModuleService {


  constructor(
    private readonly textExtractionService: TextExtractionService,
    private readonly aiService: AiService,
    private readonly fileService: FilesService
  ) {}


  async createContractAnalysis(file: Express.Multer.File, user: User): Promise<ProcessingPipelineResponseDto> {
    
    const fileUploaded = await this.fileService.create(file, user)

    const { id, type  } = fileUploaded
    
    const textExtraction = await this.textExtractionService.parseFile(id, type as FileType)

    console.log(textExtraction.id)

    const {id: textId} = textExtraction


    const aiAnalysis = await this.aiService.analyzeContract(textId)

    const response: PipelinePlainResponse =  {
      fileUploaded,
      textExtraction,
      aiAnalysis  
    }

    const processPipelineReponseDto: ProcessingPipelineResponseDto = mapToProcessingPipelineResponseDto(response)

    return processPipelineReponseDto

  }


  async createDataAnalysis(file: Express.Multer.File, user: User): Promise<ProcessingPipelineResponseDto> {
    const fileUploaded = await this.fileService.create(file, user)

    const {id, type } = fileUploaded

    const textExtraction = await this.textExtractionService.parseFile(id, type as FileType)

    const {id: textId} = textExtraction

    const aiAnalysis = await this.aiService.analyzeData(textId)

    const response: PipelinePlainResponse = {
      fileUploaded,
      textExtraction,
      aiAnalysis
    }

    const processPipelineResponseDto: ProcessingPipelineResponseDto = mapToProcessingPipelineResponseDto(response)
    return processPipelineResponseDto
 }

}
