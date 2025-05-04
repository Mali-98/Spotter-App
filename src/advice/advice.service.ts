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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const profile = await queryRunner.manager.findOne(Profile, {
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        throw new NotFoundException('Profile not found for this user');
      }

      const { goal, preferences = [], challenges = [] } = profile;

      const result = await queryRunner.query(
        `
        SELECT *
        FROM advice
        WHERE goal = $1
          AND (preferences::text[] && $2::text[] OR preferences IS NULL)
          AND (challenges::text[] && $3::text[] OR challenges IS NULL)
        `,
        [goal, preferences, challenges],
      );

      return result;
    } finally {
      await queryRunner.release();
    }
  }
}
