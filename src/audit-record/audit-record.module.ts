import { Module } from '@nestjs/common';
import { AuditRecordService } from './audit-record.service';
import { AuditRecordController } from './audit-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditRecord } from './entities/audit-record.entity';
import { AiAnalysis } from 'src/ai/entities/ai-analysis.entity';
import { AiModule } from 'src/ai/ai.module';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuditRecordController],
  providers: [AuditRecordService],
  imports: [
    TypeOrmModule.forFeature([
      AuditRecord
    ]),
    AiModule,
    PassportModule.register({defaultStrategy: 'jwt'})  ,
  ],
  exports: [
    AuditRecordService
  ]
})
export class AuditRecordModule {}
