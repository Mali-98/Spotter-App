import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    name: string;

    @Column()
    goal: string;

    @Column()
    age: number;

    @Column()
    gender: string;

    @Column('float')
    height: number; // in cm

    @Column('float')
    weight: number; // in kg

    @Column()
    activityLevel: string; // sedentary, moderate, active

    @Column("text", { array: true, nullable: true })
    preferences: string[]; // optional dietary preferences

    @Column("text", { array: true, nullable: true })
    challenges: string[]; // allergies, injuries, etc.

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
