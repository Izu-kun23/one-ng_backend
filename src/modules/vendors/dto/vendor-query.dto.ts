import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class VendorQueryDto {
  @ApiProperty({ example: 'Electronics', required: false })
  @IsString()
  @IsOptional()
  interests?: string;
}

