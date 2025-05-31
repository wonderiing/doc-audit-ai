import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { CreateFileDocumentDto } from './dto/create-file-document.dto';
import { FileType } from './interfaces/file-type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDocument } from './entities/file-document.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadFilesService {

  constructor(
    @InjectRepository(FileDocument)
    private readonly fileDocumentRepository: Repository<FileDocument>,
    private readonly configService: ConfigService
  ) {

  }

  getStaticFileName(fileName: string) {

    const path = join(__dirname, '../../static/files', fileName)

    if (!existsSync(path)) {
      throw new BadRequestException(`No File found with name ${fileName}`)
    }
    return path
   }

   async create( file: Express.Multer.File) {
    
    const {mimetype, filename} = file

    const secureUrl = `${ this.configService.get('HOST_API')}/upload-files/files/${filename}`
    const type = mimetype.split('/')[1] as FileType

    const createFileDocumentDto: CreateFileDocumentDto = {
      filename,
      url: secureUrl,
      type
    }
    
    try {

      const fileDocument = this.fileDocumentRepository.create(createFileDocumentDto)
      await this.fileDocumentRepository.save(fileDocument)
      return fileDocument
    } catch(error) {
      
      throw new InternalServerErrorException(`Something went wrong check server logs`)
    }
    

  }
}
