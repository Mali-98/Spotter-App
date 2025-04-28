import { IsString, IsInt, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    name: string;

    @IsString()
    goal: string;

    @IsInt()
    age: number;

    @IsString()
    gender: string;

    @IsNumber()
    height: number;

    @IsNumber()
    weight: number;

    @IsString()
    activityLevel: string;

    @IsOptional()
    @IsArray()
    preferences?: string[];

    @IsOptional()
    @IsArray()
    challenges?: string[];
}
