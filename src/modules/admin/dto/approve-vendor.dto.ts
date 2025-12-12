import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveVendorDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  approved: boolean;
}

