import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileDocument } from './entities/file-document.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TextExtractionModule } from 'src/text-extraction/text-extraction.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    TypeOrmModule.forFeature([FileDocument]),
    ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'})  ,
    JwtModule,
    
  ],
  exports: [
    FilesService,
    TypeOrmModule
  ]
})
export class FilesModule {}
