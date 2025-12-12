import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'ABC Trading Company' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'Electronics, Clothing, Food', required: false })
  @IsString()
  @IsOptional()
  interests?: string;
}

