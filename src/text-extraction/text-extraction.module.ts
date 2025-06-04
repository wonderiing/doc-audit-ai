import { Module } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { TextExtractionController } from './text-extraction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextExtraction } from './entities/text-extraction.entity';
import { UploadFilesModule } from 'src/upload-files/upload-files.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [TextExtractionController],
  providers: [TextExtractionService],
  imports: [
    TypeOrmModule.forFeature([
      TextExtraction
    ]),
    UploadFilesModule,
    PassportModule.register({defaultStrategy: 'jwt'})  ,
  ]
})
export class TextExtractionModule {}
