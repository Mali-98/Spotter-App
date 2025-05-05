import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdviceService } from './advice.service';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('advice')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Post()
  create(@Body() createAdviceDto: CreateAdviceDto) {
    return this.adviceService.create(createAdviceDto);
  }

  @Get()
  findAll() {
    return this.adviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdviceDto: UpdateAdviceDto) {
    return this.adviceService.update(+id, updateAdviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adviceService.remove(+id);
  }
}
