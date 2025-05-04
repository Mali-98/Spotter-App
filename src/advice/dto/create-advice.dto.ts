// src/advice/dto/create-advice.dto.ts
import { IsString, IsEnum, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { Goal } from 'src/profile/entities/profile.entity'; // Assuming Goal enum is in profile.entity.ts
import { Preference } from 'src/profile/enums/preference.enum';
import { Challenge } from 'src/profile/enums/challenge.enum';

export class CreateAdviceDto {
    @IsString()
    foodRecommendation: string;

    @IsString()
    supplementAdvice: string;

    @IsString()
    nutritionalInfo: string;

    @IsEnum(Goal)
    goal: Goal;

    @IsArray()
    @IsOptional()
    @IsEnum(Preference, { each: true })
    preferences?: Preference[];

    @IsArray()
    @IsOptional()
    @IsEnum(Challenge, { each: true })
    challenges?: Challenge[];
}
