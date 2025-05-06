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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('users/:userId/advice')
export class AdviceUserController {
  constructor(private readonly adviceService: AdviceService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  getAdviceForUser(@Param('userId') userId: string, @Req() req) {
    if (userId !== req.user.sub) {
      throw new ForbiddenException();
    }
    return this.adviceService.getAdviceForUser(userId);
  }
}
