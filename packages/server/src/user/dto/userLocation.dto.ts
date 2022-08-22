import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UserLocationDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsNumber()
  locationId!: number;

  @IsBoolean()
  isActive!: boolean;
}
