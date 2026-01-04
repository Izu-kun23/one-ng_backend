import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(senderId: number, createMessageDto: CreateMessageDto): Promise<{
        receiver: {
            name: string;
            email: string;
            id: number;
        };
        sender: {
            name: string;
            email: string;
            id: number;
        };
    } & {
        id: number;
        receiverId: number;
        body: string;
        timestamp: Date;
        senderId: number;
    }>;
    findConversation(userId: number, otherUserId: number): Promise<({
        receiver: {
            name: string;
            email: string;
            id: number;
        };
        sender: {
            name: string;
            email: string;
            id: number;
        };
    } & {
        id: number;
        receiverId: number;
        body: string;
        timestamp: Date;
        senderId: number;
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
