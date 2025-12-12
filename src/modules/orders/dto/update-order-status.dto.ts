import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'confirmed', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] })
  @IsString()
  @IsIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  status: string;
}

