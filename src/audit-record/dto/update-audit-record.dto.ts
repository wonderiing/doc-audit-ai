import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditRecordDto } from './create-audit-record.dto';

export class UpdateAuditRecordDto extends PartialType(CreateAuditRecordDto) {}
