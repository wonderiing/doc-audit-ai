import * as fs from 'fs'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as pdfParse from 'pdf-parse'
import { UploadFilesService } from 'src/upload-files/upload-files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TextExtraction } from './entities/text-extraction.entity';
import { Repository } from 'typeorm';
import { FileType } from 'src/upload-files/interfaces/file-type.interface';
import * as mammoth from 'mammoth'
import { cleanText } from './helper/cleanText.helper';

@Injectable()
export class TextExtractionService {

  constructor(
    private readonly uploadFileService: UploadFilesService,
    @InjectRepository(TextExtraction)
    private readonly textExtractionRepository: Repository<TextExtraction>
  ) {

  }

  //TODO: maybe colocarlo en helpers
  async getFileInfo(id: number, fileType: FileType) {
    const file = await this.uploadFileService.findOne(id)

    const path = this.uploadFileService.getStaticFileName(file.filename)

    if (file.type !== fileType) throw new BadRequestException(`File with id ${file.id} is not a ${fileType}`)

    return {path, file}
  }

  async parsePdf(id: number) {

    const {file, path} = await this.getFileInfo(id, FileType.pdf)

    const dataBuffer = fs.readFileSync(path)
    const {text} =  await pdfParse(dataBuffer)


    const textExtractionObject = this.textExtractionRepository.create({
      raw_text: cleanText(text),
      file
    })
    try {
      await this.textExtractionRepository.save(textExtractionObject)
      return textExtractionObject
    } catch(error) {
      console.log(error)
    }
  }

  async parseDocx(id: number) {

    const {path, file} = await this.getFileInfo(id, FileType.docx)
    
    const text = await mammoth.extractRawText({ path });

    if (!text) throw new InternalServerErrorException(`Couldnt parse file with name: ${file.filename} and extension: ${file.type}. Check server logs`)
    
      const textExtractionObject = this.textExtractionRepository.create({
        raw_text: cleanText(text.value),
        file
      })

    try {
      await this.textExtractionRepository.save(textExtractionObject)
      return textExtractionObject

    } catch (error) {
      console.log(error)
    }
  }
}
