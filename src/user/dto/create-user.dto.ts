import { IsOptional, IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateUserDto {
    @ValidateIf(o => !o.phoneNumber)
    @IsEmail()
    @IsOptional()
    email?: string;

    @ValidateIf(o => !o.email)
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsString()
    goal: string;
}
