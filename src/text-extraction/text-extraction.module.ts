import { Module } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { TextExtractionController } from './text-extraction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextExtraction } from './entities/text-extraction.entity';
import { FilesModule } from 'src/files/files.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [TextExtractionController],
  providers: [TextExtractionService],
  imports: [
    TypeOrmModule.forFeature([
      TextExtraction
    ]),
    FilesModule,
    PassportModule.register({defaultStrategy: 'jwt'})  ,
  ]
})
export class TextExtractionModule {}
