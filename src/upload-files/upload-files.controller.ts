import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { CreateFileDocumentDto } from './dto/create-file-document.dto';
import { UpdateFileDocumentDto } from './dto/update-upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { FileType } from './interfaces/file-type.interface';

@Controller('upload-files')
export class UploadFilesController {
  constructor(
    private readonly uploadFilesService: UploadFilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('files/:fileName')
  findFile(
    @Res() res: Response,
    @Param('fileName') fileName: string
  ) {
    const path = this.uploadFilesService.getStaticFileName(fileName)
    
    res.sendFile(path)
  }

  @Post()
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: {fileSize: 10000000},
    storage: diskStorage({
      destination: './static/files',
      filename: fileNamer
    })
  }) )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,

  ) {
    return this.uploadFilesService.create(file)
  }


}
