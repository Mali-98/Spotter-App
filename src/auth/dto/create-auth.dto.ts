// src/auth/dto/login.dto.ts
import { IsString, ValidateIf, IsEmail } from 'class-validator';

export class CreateAuthDto {
  @ValidateIf((o) => !o.phoneNumber)
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  phoneNumber?: string;

  @IsString()
  password: string;
}
