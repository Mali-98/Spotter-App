import { IsString, IsInt, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Goal, ActivityLevel, Gender } from '../entities/profile.entity';
import { Preference } from '../enums/preference.enum';
import { Challenge } from '../enums/challenge.enum';

export class CreateProfileDto {
    @IsString()
    name: string;

    @IsEnum(Goal)
    goal: Goal;

    @IsInt()
    age: number;

    @IsEnum(Gender)
    gender: Gender;

    @IsNumber()
    height: number;

    @IsNumber()
    weight: number;

    @IsEnum(ActivityLevel)
    activityLevel: ActivityLevel;

    @IsOptional()
    @IsArray()
    @IsEnum(Preference, { each: true })
    preferences?: Preference[];

    @IsOptional()
    @IsArray()
    @IsEnum(Challenge, { each: true })
    challenges?: Challenge[];
}
