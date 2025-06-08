import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res, Query, ParseIntPipe, ParseFilePipeBuilder } from '@nestjs/common';
import { FilesService } from './files.service';
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
import { UserRoles } from 'src/auth/interfaces/user-role.interface';
import { getStaticFileName } from './helpers/getStaticFileName';
import { AuthUploadFile } from 'src/common/decorators/auth-uploadfile.decorator';

@Controller('files')
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('see-file/:fileName')
  findFile(
    @Res() res: Response,
    @Param('fileName') fileName: string
  ) {
    const path = getStaticFileName(fileName)
    
    res.sendFile(path)
  }

  @Post()
  @AuthUploadFile()
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.fileService.create(file, user)
  }

  @Get()
  @Auth()
  findAll(@Query() pagintaionDto: PaginationDto){
    return this.fileService.findAll(pagintaionDto)
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.findOne(id)
  }

  @Delete(':id')
  @Auth(UserRoles.admin, UserRoles.auditor)
  delete(@Param('id', ParseIntPipe)id: number) {
    return this.fileService.delete(id)
  }


}
