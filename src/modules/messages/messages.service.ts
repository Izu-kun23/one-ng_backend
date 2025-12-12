import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(senderId: number, createMessageDto: CreateMessageDto) {
    // Verify receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: createMessageDto.receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (senderId === createMessageDto.receiverId) {
      throw new ForbiddenException('Cannot send message to yourself');
    }

    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: createMessageDto.receiverId,
        body: createMessageDto.body,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findConversation(userId: number, otherUserId: number) {
    // Verify other user exists
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: {
        timestamp: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findUserConversations(userId: number) {
    // Get all unique conversation partners
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Group by conversation partner and get latest message
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      } else {
        const conversation = conversationsMap.get(partnerId);
        if (message.timestamp > conversation.lastMessage.timestamp) {
          conversation.lastMessage = message;
        }
      }

      // Count unread messages (messages received but not sent)
      if (message.receiverId === userId) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    return Array.from(conversationsMap.values()).map((conv) => ({
      partner: conv.partner,
      lastMessage: {
        id: conv.lastMessage.id,
        body: conv.lastMessage.body,
        timestamp: conv.lastMessage.timestamp,
        senderId: conv.lastMessage.senderId,
        receiverId: conv.lastMessage.receiverId,
      },
      unreadCount: conv.unreadCount,
    }));
  }
}

