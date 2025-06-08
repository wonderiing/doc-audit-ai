import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from './guard/user-roles.guard';
import { RolesProtected } from './decorators/roles-protected.decorator';
import { UserRoles } from './interfaces/user-role.interface';
import { Auth } from './decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto ){
    return this.authService.login(loginUserDto)
  }

  @Get('private')
  @Auth(UserRoles.admin, UserRoles.user)
  private() {
    return 'private!'
  }

  @Get()
  @Auth(UserRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto)
  }

  @Delete('deactivate/:id')
  @Auth(UserRoles.admin)
  deactivateUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deactivateUser(id)
  } 

}
