import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateVendorDto {
  @ApiProperty({ example: 'ABC Trading Company', required: false })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ example: 'Electronics, Clothing, Food', required: false })
  @IsString()
  @IsOptional()
  interests?: string;
}

