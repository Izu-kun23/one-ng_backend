import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UploadMultipleProductImagesDto {
  // Note: The actual files are handled by Multer interceptor, not the DTO body.
  // This DTO only validates the non-file fields.
  @ApiProperty({
    description: 'Index of the image to set as primary (0-based)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  primaryIndex?: number;
}
