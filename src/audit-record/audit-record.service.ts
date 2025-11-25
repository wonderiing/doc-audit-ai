import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAuditRecordDto } from './dto/create-audit-record.dto';
import { UpdateAuditRecordDto } from './dto/update-audit-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditRecord } from './entities/audit-record.entity';
import { Repository } from 'typeorm';
import { AiAnalysis } from 'src/ai/entities/ai-analysis.entity';
import { User } from 'src/auth/entities/user.entity';
import { getPlainAuditRecord } from './helpers/getPlainAuditRecord';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';
import { ResponseAuditRecordDto } from './dto/response-audit-record.dto';

@Injectable()
export class AuditRecordService {

  constructor(
    @InjectRepository(AuditRecord)
    private readonly auditRecordRepository: Repository<AuditRecord>,
    @InjectRepository(AiAnalysis)
    private readonly aiAnalysisRepository: Repository<AiAnalysis>
  ) {

  }
  private readonly logger = new Logger(AuditRecordService.name)


  async findAll(paginationDto: PaginationDto): Promise<ResponseAuditRecordDto[]> {

    const { limit = 5, offset = 0 } = paginationDto

    const auditRecords = await this.auditRecordRepository.find({
      take: limit,
      skip: offset,
      relations: ['file', 'user', 'aiAnalysis']
    })

    const auditRecordResponseDto = auditRecords.map((auditRecord) => getPlainAuditRecord(auditRecord))

    return auditRecordResponseDto
  }

  async findOne(id: number): Promise<AuditRecord> {

    const auditRecord = await this.auditRecordRepository.findOne({
      where: { id },
      relations: ['file', 'user', 'aiAnalysis']
    })

    if (!auditRecord)
      throw new NotFoundException(`Audit Record with id ${id} was not found`)

    return auditRecord
  }

  async findByUser(user: User, paginationDto: PaginationDto): Promise<AuditRecord[]> {

    const { id } = user
    const { limit = 5, offset = 0 } = paginationDto


    const userAuditRecord = await this.auditRecordRepository.find({
      take: limit,
      skip: offset,
      relations: ['file'],
      where: { user: { id } }
    })

    return userAuditRecord

  }

  async create(createAuditRecordDto: CreateAuditRecordDto, user: User): Promise<ResponseAuditRecordDto> {

    const { notes, status, fileId } = createAuditRecordDto

    const aiAnalysis = await this.aiAnalysisRepository.findOne({
      where: { text_extraction: { file: { id: fileId } } }
    })
    if (!aiAnalysis) throw new BadRequestException(`File with id ${fileId} was not found`)

    const file = aiAnalysis.text_extraction.file

    const auditRecord = this.auditRecordRepository.create({
      notes,
      status,
      file,
      user,
      aiAnalysis
    })
    try {
      await this.auditRecordRepository.save(auditRecord)
      const plainAuditRecord = getPlainAuditRecord(auditRecord)
      return plainAuditRecord

    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  async update(id: number, updateAuditRecordDto: UpdateAuditRecordDto): Promise<AuditRecord> {

    const auditRecord = await this.auditRecordRepository.preload({
      id,
      ...updateAuditRecordDto
    })
    if (!auditRecord) throw new NotFoundException(`Audit record with id ${id} was not found`)

    try {
      await this.auditRecordRepository.save(auditRecord)
      return auditRecord
    } catch (error) {
      this.handleDbExceptions(error)
    }

  }

  async delete(id: number): Promise<void> {
    const auditRecord = await this.findOne(id)
    await this.auditRecordRepository.remove(auditRecord)
  }

  handleDbExceptions(error: any): never {
    this.logger.error('DB Exception', error.stack);
    if (error.code === '23505') throw new BadRequestException(`Already audited file: ${error.detail}. `)
    throw new InternalServerErrorException(`Something went wrong check logs`)
  }
}
