// src/profile/user-profile.controller.ts
import { Controller, Post, Param, Body, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service'; // Assume service is named like this
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('users/:userId/profile')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
export class UserProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.USER)
    async create(
        @Param('userId') userId: string,
        @Body() createProfileDto: CreateProfileDto,
        @Req() req,
    ) {
        if (userId !== req.user.sub) {
            throw new ForbiddenException();
        }

        return this.profileService.createProfile(userId, createProfileDto);
    }
}
