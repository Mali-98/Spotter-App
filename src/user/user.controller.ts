import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { email, phoneNumber } = createUserDto;
    if (!email && !phoneNumber) {
      throw new Error('Either email or phone number must be provided.');
    }
    return this.userService.register(createUserDto);
  }

  @Post(':userId/profile')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.USER)
  async createProfile(
    @Param('userId') userId: string,
    @Body() createProfileDto: CreateProfileDto,
    @Req() req,
  ) {
    if (userId !== req.user.sub) {
      throw new ForbiddenException();
    }

    return this.userService.createProfile(userId, createProfileDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
