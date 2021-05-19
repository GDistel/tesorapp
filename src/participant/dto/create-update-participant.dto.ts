import { IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';

export class CreateOrUpdateParticipantDto {
    @IsNotEmpty()
    @Length(1, 40)
    name: string;

    @IsOptional()
    @Min(0)
    @Max(Number.MAX_VALUE)
    linkToUserId: number;
}
