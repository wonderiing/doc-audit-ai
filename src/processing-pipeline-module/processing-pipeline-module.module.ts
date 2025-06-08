import { Module } from '@nestjs/common';
import { ProcessingPipelineModuleService } from './processing-pipeline-module.service';
import { ProcessingPipelineModuleController } from './processing-pipeline-module.controller';
import { TextExtractionModule } from 'src/text-extraction/text-extraction.module';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';
import { AiModule } from 'src/ai/ai.module';
import { AuditRecordModule } from 'src/audit-record/audit-record.module';

@Module({
  controllers: [ProcessingPipelineModuleController],
  providers: [ProcessingPipelineModuleService],
  imports: [
    TextExtractionModule,
    FilesModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    AiModule,
    AuditRecordModule
  ]
})
export class ProcessingPipelineModuleModule {}
