// src/advice/entities/advice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Goal } from 'src/profile/entities/profile.entity';
import { Preference } from 'src/profile/enums/preference.enum';
import { Challenge } from 'src/profile/enums/challenge.enum';

@Entity()
export class Advice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Goal,
    })
    goal: Goal;

    @Column({
        type: 'enum',
        enum: Preference,
        array: true,
        nullable: true,
    })
    preferences: Preference[];

    @Column({
        type: 'enum',
        enum: Challenge,
        array: true,
        nullable: true,
    })
    challenges: Challenge[];

    @Column('text')
    foodRecommendation: string;

    @Column('text', { nullable: true })
    supplementAdvice: string;

    @Column('text', { nullable: true })
    nutritionalInfo: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
