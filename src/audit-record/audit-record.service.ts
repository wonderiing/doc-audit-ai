import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuditRecordDto } from './dto/create-audit-record.dto';
import { UpdateAuditRecordDto } from './dto/update-audit-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditRecord } from './entities/audit-record.entity';
import { Repository } from 'typeorm';
import { AiAnalysis } from 'src/ai/entities/ai-analysis.entity';
import { User } from 'src/auth/entities/user.entity';
import { getPlainAuditRecord } from './helpers/getPlainAuditRecord';

@Injectable()
export class AuditRecordService {

  constructor(
    @InjectRepository(AuditRecord)
    private readonly auditRecordRepository: Repository<AuditRecord>,
    @InjectRepository(AiAnalysis)
    private readonly aiAnalysisRepository: Repository<AiAnalysis>
  ) {

  }

  async create(createAuditRecordDto: CreateAuditRecordDto, user: User) {

    const {notes, status, fileId} = createAuditRecordDto 

    const object = await this.aiAnalysisRepository.findOne({
      where: {text_extraction: {file: {id: fileId}}}
    })
    if (!object) throw new BadRequestException(`File with id ${fileId} was not found`)

    const file = object.text_extraction.file 


    const auditRecord = this.auditRecordRepository.create({
      notes,
      status,
      file,
      user,
      aiAnalysis: object
    })
    const plainAuditRecord = getPlainAuditRecord(auditRecord)
    console.log(plainAuditRecord)

    try {

      await this.auditRecordRepository.save(auditRecord)
      return plainAuditRecord

    } catch (error ){
      console.log(error)
    }

    return createAuditRecordDto
  }
}
