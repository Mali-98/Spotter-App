// src/advice/advice-user.controller.ts
import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';

@Controller('users/:userId/advice')
export class AdviceUserController {
    constructor(private readonly adviceService: AdviceService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAdviceForUser(@Param('userId') userId: string, @User() user: any,) {
        if (userId !== user.id) {
            throw new ForbiddenException();
        }
        return this.adviceService.getAdviceForUser(userId);
    }
}
