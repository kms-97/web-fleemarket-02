import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsOptional()
  @IsNumberString()
  code?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;
}
