import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UploadMultipleProductImagesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of product image files',
  })
  @IsArray()
  images: any[];

  @ApiProperty({
    description: 'Index of the image to set as primary (0-based)',
    required: false,
  })
  @IsOptional()
  primaryIndex?: number;
}
