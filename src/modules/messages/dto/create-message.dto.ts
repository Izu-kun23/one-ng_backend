import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  receiverId: number;

  @ApiProperty({ example: 'Hello, I am interested in your product' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  body: string;
}

