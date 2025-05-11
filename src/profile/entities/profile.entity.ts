import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Preference } from '../enums/preference.enum';
import { Challenge } from '../enums/challenge.enum';

export enum Goal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    MAINTENANCE = 'maintenance',
}

export enum ActivityLevel {
    SEDENTARY = 'sedentary',
    MODERATE = 'moderate',
    ACTIVE = 'active',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: Goal,
    })
    goal: Goal;

    @Column()
    age: number;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    gender: Gender;

    @Column('float')
    height: number;

    @Column('float')
    weight: number;

    @Column({
        type: 'enum',
        enum: ActivityLevel,
    })
    activityLevel: ActivityLevel;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
