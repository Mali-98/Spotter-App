import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdviceModule } from './advice/advice.module';
import { Advice } from './advice/entities/advice.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <-- This is required
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Profile, Advice],
      synchronize: true,
    }), UserModule, ProfileModule, AuthModule, AdviceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
