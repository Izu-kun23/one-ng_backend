import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, user: any): Promise<{
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
    findConversation(userId: number, user: any): Promise<({
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
