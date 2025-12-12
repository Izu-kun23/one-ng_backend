import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, user: any): Promise<{
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
    findConversation(userId: number, user: any): Promise<({
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
    findUserConversations(user: any): Promise<{
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
