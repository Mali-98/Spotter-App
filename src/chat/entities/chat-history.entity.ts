// src/chat/entities/chat-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string; // optional, only if you track users

    @Column()
    role: string; // 'user' or 'assistant'

    @Column('text')
    message: string;

    @CreateDateColumn()
    createdAt: Date;
}
