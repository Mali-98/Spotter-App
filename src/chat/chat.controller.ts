// src/chat/chat.controller.ts
import { Controller, Post, Body, Param, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }


  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  async chat(@Body('message') message: string, @Req() req) {
    const userId = req.user.sub; // Assuming the user ID is in the JWT token
    return {
      reply: await this.chatService.getChatResponse(message, userId),
    };
  }

  @Get('history/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  getHistory(@Param('userId') userId: string, @Req() req) {
    if (userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.chatService.getHistory(userId);
  }
}
