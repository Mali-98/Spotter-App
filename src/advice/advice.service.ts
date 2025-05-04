import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advice } from './entities/advice.entity';
import { DataSource, Repository } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class AdviceService {
  constructor(
    @InjectRepository(Advice)
    private readonly adviceRepo: Repository<Advice>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly dataSource: DataSource
  ) { }

  // Create a new advice record
  async create(createAdviceDto: CreateAdviceDto) {
    const advice = this.adviceRepo.create(createAdviceDto);  // Create a new advice entity from the DTO
    return await this.adviceRepo.save(advice);  // Save it to the database
  }

  findAll() {
    return `This action returns all advice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advice`;
  }

  update(id: number, updateAdviceDto: UpdateAdviceDto) {
    return `This action updates a #${id} advice`;
  }

  remove(id: number) {
    return `This action removes a #${id} advice`;
  }

  async getAdviceForUser(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    const { goal, preferences, challenges } = profile;

    return this.adviceRepo
      .createQueryBuilder('advice')
      .where('advice.goal = :goal', { goal })
      .andWhere(
        '(advice.preferences && ARRAY[:...preferences]::"Preference"[] OR advice.preferences IS NULL)',
        { preferences },
      )
      .andWhere(
        '(advice.challenges && ARRAY[:...challenges]::"Challenge"[] OR advice.challenges IS NULL)',
        { challenges },
      )
      .getMany();
  }
}
