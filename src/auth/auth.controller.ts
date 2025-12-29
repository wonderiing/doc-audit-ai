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
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import {Throttle, ThrottlerGuard} from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard) 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get('google') 
  @UseGuards(AuthGuard('google'))
  async googleAuth() {

  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto ){
    return this.authService.login(loginUserDto)
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



  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @GetUser() user: User
  ) {
    return this.authService.loginGoogle(user)
  }

}
