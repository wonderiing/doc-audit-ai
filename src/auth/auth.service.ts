import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginUserDto: LoginUserDto) {

    const {password, email} = loginUserDto

    const user = await this.userRepository.findOne(
      {
        where: {email},
        select: { id: true, email: true, roles: true, password: true }
      }
    )

    if (!user) throw new NotFoundException(`User with id email $${email} is not registered`)

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Invalid credentials`)

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  private getJwtToken(payload: any) {

    const token = this.jwtService.sign(payload)
    return token
  }

  async register(registerUserDto: RegisterUserDto) {

    const user = this.userRepository.create(registerUserDto)


    try {
      await this.userRepository.save(user)
      return user
    
    } catch(error) {

      this.handleDbExceptions(error)
    }

    return registerUserDto
  }

  private handleDbExceptions(error: any) {

    if (error.code === '23505') throw new BadRequestException(`${error.detail}`)
    console.log(error)
    throw new InternalServerErrorException(`Something went wrong check server logs`)
  }
}
