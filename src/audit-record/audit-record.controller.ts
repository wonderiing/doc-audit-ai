import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { AuditRecordService } from './audit-record.service';
import { CreateAuditRecordDto } from './dto/create-audit-record.dto';
import { UpdateAuditRecordDto } from './dto/update-audit-record.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRoles } from 'src/auth/interfaces/user-role.interface';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';

@Controller('audit-record')
export class AuditRecordController {
  constructor(private readonly auditRecordService: AuditRecordService) {}

  @Post()
  @Auth(UserRoles.auditor)
  create(@Body() createAuditRecordDto: CreateAuditRecordDto, @GetUser() user: User) {
    return this.auditRecordService.create(createAuditRecordDto, user)
  }

  @Patch(':id')
  @Auth(UserRoles.auditor)
  update(@Body() updateAuditRecordDto: UpdateAuditRecordDto, @Param('id', ParseIntPipe) id: number) {
    return this.auditRecordService.update(id, updateAuditRecordDto)
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditRecordService.findOne(id)
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.auditRecordService.findAll(paginationDto)
  }

  @Delete(':id')
  @Auth(UserRoles.admin, UserRoles.auditor) 
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.auditRecordService.delete(id)
  }


}
