import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'ABC Trading Company' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'Electronics, Clothing, Food' })
  @IsString()
  @IsNotEmpty()
  interests: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  businessPhone: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Business logo image file' })
  businessLogo: any;
}

