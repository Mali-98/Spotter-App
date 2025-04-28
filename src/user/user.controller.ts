import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { email, phoneNumber } = createUserDto;
    if (!email && !phoneNumber) {
      throw new Error('Either email or phone number must be provided.');
    }
    return this.userService.register(createUserDto);
  }

  @Post(':userId/profile')
  async createProfile(
    @Param('userId') userId: string,
    @Body() createProfileDto: CreateProfileDto
  ) {
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
