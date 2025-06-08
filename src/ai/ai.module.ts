import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { ConfigModule } from '@nestjs/config';
import { TextExtractionModule } from 'src/text-extraction/text-extraction.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: [
    TextExtractionModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      AiAnalysis
    ]),
    PassportModule.register({defaultStrategy: 'jwt'})  ,
  ],
  exports: [
    TypeOrmModule,
    AiService
  ]
})
export class AiModule {}
