import { IsEnum, isEnum, IsNumber, IsString } from "class-validator";
import { FileType } from "src/files/interfaces/file-type.interface";

export class UserInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;
}

export class FileInfoDto  {
  @IsNumber()
  id: number;

  @IsString()
  filename: string;

  @IsString()
  url: string;

  @IsEnum(FileType)
  type: FileType;
}

export class ProcessingPipelineResponseDto {
  file: FileInfoDto;

  user: UserInfoDto;
  

  @IsNumber()
  textExtractionId: number;

  @IsNumber()
  aiAnalysisId: number;

  @IsString()
  fileRawText: string;

  @IsString()
  aiAnalysisResponse: string;
}
