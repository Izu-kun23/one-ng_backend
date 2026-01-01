import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  // Vendor business info (optional for non-vendors)
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

  // @ApiProperty({ type: 'string', format: 'binary', description: 'Business logo image file', required: false })
  // @IsOptional()
  // businessLogo?: any;
}

