import { promises as fs } from 'fs'
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse'
import { FilesService } from 'src/files/files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TextExtraction } from './entities/text-extraction.entity';
import { Repository } from 'typeorm';
import { FileType } from 'src/files/interfaces/file-type.interface';
import * as mammoth from 'mammoth'
import { cleanText } from './helper/cleanText.helper';
import * as XLSX from 'xlsx'
import { getStaticFileName } from 'src/files/helpers/getStaticFileName';
import { extname } from 'path';


@Injectable()
export class TextExtractionService {

  constructor(
    private readonly fileService: FilesService,
    @InjectRepository(TextExtraction)
    private readonly textExtractionRepository: Repository<TextExtraction>,
  ) {

  }
  private readonly logger = new Logger(TextExtractionService.name)


  async findTextExtractionByFileId(id: number): Promise<TextExtraction> {

    const textExtraction = await this.textExtractionRepository.findOne({
      where: { file: { id } },
      loadRelationIds: true
    })

    if (!textExtraction) throw new NotFoundException(`File with id ${id} has no text-extraction`)

    return textExtraction
  }

  async getFileInfo(id: number, fileType: FileType) {
    const file = await this.fileService.findOne(id)

    const path = getStaticFileName(file.filename)

    if (file.type !== fileType) throw new BadRequestException(`File with id ${file.id} is not a ${fileType}`)

    return { path, file }
  }

  async parsePdf(id: number): Promise<TextExtraction> {

    const { file, path } = await this.getFileInfo(id, FileType.pdf)

    const dataBuffer = await fs.readFile(path)
    const { text } = await pdfParse(dataBuffer)


    const textExtraction = this.textExtractionRepository.create({
      raw_text: cleanText(text),
      file
    })
    try {
      await this.textExtractionRepository.save(textExtraction)
      return textExtraction
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  async parseDocx(id: number): Promise<TextExtraction> {

    const { path, file } = await this.getFileInfo(id, FileType.docx)

    const text = await mammoth.extractRawText({ path });

    if (!text) throw new InternalServerErrorException(`Couldnt parse file with name: ${file.filename} and extension: ${file.type}. Check server logs`)

    const textExtraction = this.textExtractionRepository.create({
      raw_text: cleanText(text.value),
      file
    })

    try {
      await this.textExtractionRepository.save(textExtraction)
      return textExtraction

    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  async parseCsv(id: number): Promise<TextExtraction> {

    const { path, file } = await this.getFileInfo(id, FileType.csv)

    const csvText = await fs.readFile(path, 'latin1')

    if (!csvText) throw new BadRequestException(`Couldnt parse csv with id ${id}`)

    const textExtraction = this.textExtractionRepository.create({
      raw_text: csvText,
      file
    })

    try {
      await this.textExtractionRepository.save(textExtraction)
      return textExtraction
    } catch (error) {
      this.handleDbExceptions(error)
    }

  }

  async parseExcel(id: number): Promise<TextExtraction> {

    const { path, file } = await this.getFileInfo(id, FileType.xlsx)

    const fileBuffer = await fs.readFile(path);

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    let data: string = ''

    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      data += `\nHoja: ${sheetName}\n` + csvData

    });

    const textExtraction = this.textExtractionRepository.create({
      raw_text: data,
      file
    })

    try {
      await this.textExtractionRepository.save(textExtraction)
      return textExtraction
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }


  async parseFile(id: number, fileType: FileType): Promise<TextExtraction> {
    switch (fileType) {
      case FileType.pdf:
        return this.parsePdf(id);
      case FileType.docx:
        return this.parseDocx(id);
      case FileType.csv:
        return this.parseCsv(id);
      case FileType.xlsx:
        return this.parseExcel(id);
      default:
        throw new BadRequestException(`Unsupported file type: ${fileType}`);
    }
  }

  async findOne(id: number): Promise<TextExtraction> {

    const textExtraction = await this.textExtractionRepository.findOneBy({
      id
    })

    if (!textExtraction) throw new BadRequestException(`Text Extraction with id ${id} was not found`)

    return textExtraction
  }

  handleDbExceptions(error: any): never {
    this.logger.error('DB Exception', error.stack);
    if (error.code === '23505') throw new BadRequestException(`Already parsed file with id: ${error.detail}. `)
    throw new InternalServerErrorException(`Something went wrong check logs`)
  }


}
