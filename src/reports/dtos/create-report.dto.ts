import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  models: string;

  @IsNumber()
  @Min(1930)
  @Max(2025)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  milage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Max(0)
  @Max(1000000)
  price: number;
}
