import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res, Query, ParseIntPipe } from '@nestjs/common';
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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';

@Controller('upload-files')
export class UploadFilesController {
  constructor(
    private readonly uploadFilesService: UploadFilesService,
    private readonly configService: ConfigService
  ) {}

  //TODO: protect this route
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
  @Auth()
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.uploadFilesService.create(file, user)
  }

  @Get()
  findAll(@Query() pagintaionDto: PaginationDto){
    return this.uploadFilesService.findAll(pagintaionDto)
  }


}
