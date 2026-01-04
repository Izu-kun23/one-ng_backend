import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UploadProductImageDto {
  // Note: The actual file is handled by Multer interceptor, not the DTO body.
  // This DTO only validates the non-file fields.
  @ApiProperty({
    description: 'Whether this image should be set as primary',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
