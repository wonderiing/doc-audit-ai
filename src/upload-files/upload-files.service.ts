import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { CreateFileDocumentDto } from './dto/create-file-document.dto';
import { FileType } from './interfaces/file-type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDocument } from './entities/file-document.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';
import {extname} from 'path'


//TODO: Patch method for audited docx and exceptions for findOne
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

   async create( file: Express.Multer.File, user: User) {

    if (!file) throw new BadRequestException(`File was not found`)
    const {mimetype, filename} = file

    const secureUrl = `${ this.configService.get('HOST_API')}/upload-files/files/${filename}`
    const type = extname(file.originalname).toLowerCase() as FileType

    const createFileDocumentDto: CreateFileDocumentDto = {
      filename,
      url: secureUrl,
      type
    }
    try {

      const fileDocument = this.fileDocumentRepository.create({
        user,
        ...createFileDocumentDto
      })
      await this.fileDocumentRepository.save(fileDocument)
      return fileDocument
    } catch(error) {
      console.log(error)
      throw new InternalServerErrorException(`Something went wrong check server logs`)
    }
  
  }

  async findAll(paginationDto: PaginationDto) {

    const {limit = 5, offset = 0} = paginationDto

    const files = await this.fileDocumentRepository.find({
      take: limit,
      skip: offset,
      select: {user: {createdAt: false}}
    })

    return files

  }

  async findOne(id: number) {

    const file = await this.fileDocumentRepository.findOne({
      where: {id},
    }) 

    if (!file) throw new NotFoundException(`File with id ${id} was not found`)

    return file

  }
}
