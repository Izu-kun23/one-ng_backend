import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UploadProductImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file',
  })
  file: any;

  @ApiProperty({
    description: 'Whether this image should be set as primary',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
