import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { EmailService } from 'src/common/email.service';
import { randomBytes } from 'crypto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(PasswordResetToken)
    private tokenRepository: Repository<PasswordResetToken>,
    private readonly emailService: EmailService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { password, dateOfBirth, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth), // Convert string to Date object
    });

    return this.userRepository.save(user);
  }


  findAll() {
    return this.userRepository.find();
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(userId, updateUserDto);
    return this.findOne(userId);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    await this.userRepository.remove(user);
  }

  async forgotPassword(
    phoneNumber: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new NotFoundException(
        'No user found with the provided phone number.',
      );
    }

    const token = randomBytes(3).toString('hex'); // 6-character code

    await this.tokenRepository.save({
      email: user.email,
      phoneNumber,
      token,
    });

    await this.emailService.sendEmail({
      from: process.env.SMTP_DEMO_EMAIL,
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        user: user.email,
        code: token,
      },
    });

    return { message: 'A reset code has been sent to your email.' };
  }


  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = dto;

    const tokenEntry = await this.tokenRepository.findOne({ where: { token } });

    if (!tokenEntry) {
      throw new NotFoundException('Invalid or expired reset token.');
    }

    const isExpired =
      Date.now() - new Date(tokenEntry.createdAt).getTime() >
      24 * 60 * 60 * 1000; //last for a day
    if (isExpired) {
      await this.tokenRepository.delete({ token }); // cleanup
      throw new BadRequestException('Reset token has expired.');
    }

    const { email, phoneNumber } = tokenEntry;

    const user = await this.userRepository.findOne({
      where: { email, phoneNumber },
    });

    if (!user) {
      throw new NotFoundException('User associated with this token not found.');
    }

    user.password = await this.hashPassword(newPassword);
    await this.userRepository.save(user);

    await this.tokenRepository.delete({ token });

    return { message: 'Password has been successfully reset.' };
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(password, 10);
  }
}
