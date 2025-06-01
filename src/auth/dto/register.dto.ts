import { IsArray, IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserRoles } from "../interfaces/user-role.interface";

export class RegisterUserDto {

    @IsString()
    @MinLength(9)
    fullName: string


    @IsEmail()
    @MinLength(8)
    email: string

    @IsStrongPassword()
    @MinLength(8)
    password: string

    @IsOptional()
    @IsArray()
    roles?: string[]
} 