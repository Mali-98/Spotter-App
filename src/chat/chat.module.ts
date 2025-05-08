import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatHistory } from './entities/chat-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistory, User])],
  controllers: [ChatController],
  providers: [ChatService, RolesGuard, JwtService],
})
export class ChatModule { }
