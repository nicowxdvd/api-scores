import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetScoreQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  rut: string;
}
