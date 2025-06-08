import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProcessingPipelineModuleService } from './processing-pipeline-module.service';
import { fileFilter } from 'src/files/helpers/fileFilter';
import { fileNamer } from 'src/files/helpers/fileNamer';
import { diskStorage } from 'multer';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUploadFile } from 'src/common/decorators/auth-uploadfile.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';

@Controller('processing-pipeline-module')
export class ProcessingPipelineModuleController {
  constructor(private readonly processingPipelineModuleService: ProcessingPipelineModuleService) {}

  @Post()
  @AuthUploadFile(UserRoles.auditor)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.processingPipelineModuleService.create(file, user)
  }
}
