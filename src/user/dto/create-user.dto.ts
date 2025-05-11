import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  ValidateIf,
  IsEnum,
  IsDateString
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email?: string;

  @IsString()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional() // optional so default can apply in entity
  role?: UserRole;

  @IsDateString()
  dateOfBirth?: string; // ISO 8601 format (YYYY-MM-DD)
}
