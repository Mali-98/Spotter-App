// entities/password-reset-token.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
