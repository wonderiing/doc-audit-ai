import { plainToInstance } from "class-transformer";
import { ProcessingPipelineResponseDto, FileInfoDto, UserInfoDto } from "../dto/response.dto";
import type { PipelinePlainResponse } from "../interfaces/proccess-pipeline-response.interface";

export function mapToProcessingPipelineResponseDto(response: PipelinePlainResponse): ProcessingPipelineResponseDto {
  const fileData = response.fileUploaded;
  const userData = fileData.user;
  const textExtraction = response.textExtraction;
  const aiAnalysis = response.aiAnalysis;

  const dto = new ProcessingPipelineResponseDto();

  dto.file = plainToInstance(FileInfoDto, {
    id: fileData.id,
    filename: fileData.filename,
    url: fileData.url,
    type: fileData.type, 
  });

  dto.user = plainToInstance(UserInfoDto, {
    id: userData.id,
    email: userData.email,
  });

  dto.textExtractionId = textExtraction.id;
  dto.aiAnalysisId = aiAnalysis.id;
  dto.fileRawText = textExtraction.raw_text;
  dto.aiAnalysisResponse = aiAnalysis.aiResponse;

  return dto;
}
