// src/audit/dto/create-audit-record.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AuditRecordStatus } from '../interfaces/auditRecordStatus.interface';

export class CreateAuditRecordDto {
  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsEnum(AuditRecordStatus)
  @IsOptional()
  status?: AuditRecordStatus;

  @IsNumber()
  fileId: number;


}
