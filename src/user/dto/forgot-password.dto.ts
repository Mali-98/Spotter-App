// dto/forgot-password.dto.ts
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ForgotPasswordDto {

  @IsNotEmpty()
  @IsPhoneNumber(null)
  phoneNumber: string;
}
