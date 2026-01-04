import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadMultipleProductImagesDto {
  // Note: The actual files are handled by Multer interceptor, not the DTO body.
  // This DTO only validates the non-file fields.
  @ApiProperty({
    description: 'Index of the image to set as primary (0-based)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  primaryIndex?: number;
}
