import { Controller, Get, Post, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Receiver not found' })
  @ApiResponse({ status: 403, description: 'Cannot send message to yourself' })
  async create(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: any) {
    return this.messagesService.create(user.id, createMessageDto);
  }

  @Get('thread/:userId')
  @ApiOperation({ summary: 'Get conversation thread with a specific user' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: any,
  ) {
    return this.messagesService.findConversation(user.id, userId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all user conversations' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  async findUserConversations(@CurrentUser() user: any) {
    return this.messagesService.findUserConversations(user.id);
  }
}

