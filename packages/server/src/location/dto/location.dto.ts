import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class locationDto {
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
