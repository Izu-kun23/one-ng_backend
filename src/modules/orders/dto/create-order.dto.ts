import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsInt } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  sellerId: number;
}

