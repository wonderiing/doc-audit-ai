import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/common/dtos/paginatios.dto';

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

  private getJwtToken(payload: any): string {

    const token = this.jwtService.sign(payload)
    return token
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {

    const user = this.userRepository.create(registerUserDto)

    try {
      await this.userRepository.save(user)
      return user
    
    } catch(error) {

      this.handleDbExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<User[]> {

    const { limit = 5, offset = 0 } = paginationDto

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    })

    return users
  }

  async findOne(id: number): Promise<User> {

    const user = await this.userRepository.findOneBy({id})

    if (!user) throw new NotFoundException(`User with id ${id} was not found`)

    return user

  }

  async deactivateUser(id: number) {

    const user = await this.findOne(id)

    user.isActive = false

    return {
      message: `user with id ${id} was deactivated`,
      user
    }

  }

  private handleDbExceptions(error: any): never {

    if (error.code === '23505') throw new BadRequestException(`${error.detail}`)
    console.log(error)
    throw new InternalServerErrorException(`Something went wrong check server logs`)
  }
}
