import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFileDocumentDto } from './dto/create-file-document.dto';
import { FileType } from './interfaces/file-type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDocument } from './entities/file-document.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';
import {extname} from 'path'
import { TextExtractionService } from 'src/text-extraction/text-extraction.service';


//TODO: Patch method for audited docx and exceptions for findOne
@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(FileDocument)
    private readonly fileDocumentRepository: Repository<FileDocument>,
    private readonly configService: ConfigService,
  ) {

  }
  private readonly logger = new Logger(FilesService.name)
  

   async create( file: Express.Multer.File, user: User) {

    if (!file) throw new BadRequestException(`File was not found`)
    const {filename} = file

    const secureUrl = `${ this.configService.get('HOST_API')}/files/see-file/${filename}`
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
      where: {is_active: true},
      select: {user: {createdAt: false}}
    })

    return files

  }

  async findOne(id: number) {

    const file = await this.fileDocumentRepository.findOne({
      where: {id, is_active: true},
    }) 

    if (!file) throw new NotFoundException(`File with id ${id} was not found`)

    return file

  }

  async delete(id: number) {

    const file = await this.findOne(id)

    file.is_active = false

    await this.fileDocumentRepository.save(file)
  }

    handleDbExceptions(error: any) {
    this.logger.error('DB Exception', error.stack);
    if (error.code === '23505') throw new BadRequestException(`File id: ${error.detail}. `)
    console.log(error)
    throw new InternalServerErrorException(`Something went wrong check logs`)
  }
}
