import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsInt, MinLength, IsArray } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiProperty({ example: 'Latest iPhone with advanced features', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 50, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'New product images to add (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  newImages?: any[];

  @ApiProperty({
    description: 'Index of the new primary image (0-based, optional)',
    required: false,
  })
  @IsOptional()
  newPrimaryImageIndex?: number;

  @ApiProperty({
    description: 'Array of image IDs to remove (optional)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  removeImageIds?: number[];
}

