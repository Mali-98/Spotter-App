import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'spotter_user',
      password: 'spotter_pass',
      database: 'spotter_db',
      entities: [User, Profile],
      synchronize: true,
    }), UserModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
