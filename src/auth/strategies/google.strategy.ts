import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-google-oauth20";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { VerifiedCallback } from "passport-jwt";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";


export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService
    ) {

        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('HOST_API') + '/auth/google/callback',
            scope: ['email', 'profile'],
            passReqToCallback: true,
        })
    }
    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifiedCallback
    ): Promise<any>{
        
        try {

            const {name, emails, photo} = profile

            const email = emails[0].value

            let user = await this.userRepository.findOne({
                where: {email}
            })

            if (user) {
                
                if (!user.isActive) 
                    throw new BadRequestException(`User is inactive`)

                if (!user.googleId) 
                    user.googleId = profile.id
                    await this.userRepository.save(user);


            } else {
                user = this.userRepository.create({
                    email,
                    googleId: profile.id,
                    fullName: name.givenName,
                    password: null
                })
                await this.userRepository.save(user)
            }
            return user
        
        } catch(error) {
            done(error, null)
        }

    }

}