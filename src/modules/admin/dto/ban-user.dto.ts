import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BanUserDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  banned: boolean;
}

