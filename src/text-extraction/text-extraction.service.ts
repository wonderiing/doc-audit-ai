import * as fs from 'fs'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as pdfParse from 'pdf-parse'
import { UploadFilesService } from 'src/upload-files/upload-files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TextExtraction } from './entities/text-extraction.entity';
import { Repository } from 'typeorm';
import { FileType } from 'src/upload-files/interfaces/file-type.interface';


@Injectable()
export class TextExtractionService {

  constructor(
    private readonly uploadFileService: UploadFilesService,
    @InjectRepository(TextExtraction)
    private readonly textExtractionRepository: Repository<TextExtraction>
  ) {

  }

  async parsePdf(id: number) {

    const file = await this.uploadFileService.findOne(id, FileType.pdf)


    const path = this.uploadFileService.getStaticFileName(file.filename)

    const dataBuffer = fs.readFileSync(path)

    const {text} =  await pdfParse(dataBuffer)

    const cleanText = text
          .replace(/\u0000/g, '')
          .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ''); 

    const textExtractionObject = this.textExtractionRepository.create({
      raw_text: cleanText,
      file
    })

    try {
      await this.textExtractionRepository.save(textExtractionObject)
      return textExtractionObject
    } catch(error) {
      console.log(error)
    }

  }
}
