// src/advice/advice-user.controller.ts
import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdviceService } from './advice.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users/:userId/advice')
export class AdviceUserController {
  constructor(private readonly adviceService: AdviceService) {}

  @Get()
  @UseGuards(RolesGuard)
  getAdviceForUser(@Param('userId') userId: string, @Req() req) {
    if (userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.adviceService.getAdviceForUser(userId);
  }
}
