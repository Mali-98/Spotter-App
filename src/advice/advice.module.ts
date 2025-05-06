import { Module } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './entities/advice.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { AdviceUserController } from './user-advice.controller';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Advice, Profile])], // Register AdviceRepository here
  controllers: [AdviceController, AdviceUserController],
  providers: [AdviceService, RolesGuard, JwtService],
})
export class AdviceModule { }
