import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ValidateIf((o) => !o.phoneNumber)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional() // optional so default can apply in entity
  role?: UserRole;
}
