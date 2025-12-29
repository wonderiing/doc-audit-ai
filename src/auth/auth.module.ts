import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  imports: [ 
     ConfigModule,
     PassportModule.register({defaultStrategy: 'jwt'}),

    TypeOrmModule.forFeature([
      User
    ]),
    JwtModule.registerAsync({
      imports: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '3h'
          }
        }
      }
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  
        limit: 3,  
      },
    ]),

  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,
    TypeOrmModule,
  ]
})
export class AuthModule {}
