import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDocumentDto } from './create-file-document.dto';

export class UpdateFileDocumentDto extends PartialType(CreateFileDocumentDto) {}
