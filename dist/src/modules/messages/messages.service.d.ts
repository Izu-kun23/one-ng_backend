import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(senderId: number, createMessageDto: CreateMessageDto): Promise<{
        sender: {
            email: string;
            name: string;
            id: number;
        };
        receiver: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        body: string;
        timestamp: Date;
        senderId: number;
        receiverId: number;
    }>;
    findConversation(userId: number, otherUserId: number): Promise<({
        sender: {
            email: string;
            name: string;
            id: number;
        };
        receiver: {
            email: string;
            name: string;
            id: number;
        };
    } & {
        id: number;
        body: string;
        timestamp: Date;
        senderId: number;
        receiverId: number;
    })[]>;
    findUserConversations(userId: number): Promise<{
        partner: any;
        lastMessage: {
            id: any;
            body: any;
            timestamp: any;
            senderId: any;
            receiverId: any;
        };
        unreadCount: any;
    }[]>;
}
