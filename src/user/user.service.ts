import {
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
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
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
    newEmail: string,
    phoneNumber: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new NotFoundException(
        'No user found with the provided phone number.',
      );
    }

    // Update email if needed
    user.email = newEmail;
    await this.userRepository.save(user);

    const token = randomBytes(3).toString('hex'); // 6-character code

    await this.tokenRepository.save({
      email: newEmail,
      phoneNumber,
      token,
    });

    await this.emailService.sendEmail({
      from: process.env.SMTP_DEMO_EMAIL,
      to: newEmail,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        user: user.email,
        code: token,
      },
    });

    return { message: 'A reset code has been sent to your email.' };
  }

  async resetPassword(
    email: string,
    phoneNumber: string,
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const record = await this.tokenRepository.findOne({
      where: { email, phoneNumber, token },
    });

    if (!record) {
      throw new ForbiddenException('Invalid token or user details.');
    }

    const user = await this.userRepository.findOne({
      where: { email, phoneNumber },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashed });

    //await this.tokenRepository.delete(record.id); // optional: delete token after use

    return { message: 'Password has been reset.' };
  }
}
