import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ unique: true, nullable: true })
    phoneNumber: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: 'user' })
    role: string;

    @Column()
    goal: string;
}
