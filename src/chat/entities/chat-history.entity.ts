// src/chat/entities/chat-history.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class ChatHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.chatHistories, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    user: User;

    @Column()
    role: string; // 'user' or 'assistant'

    @Column('text')
    message: string;

    @CreateDateColumn()
    createdAt: Date;
}
