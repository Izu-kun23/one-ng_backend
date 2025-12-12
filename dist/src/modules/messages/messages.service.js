"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(senderId, createMessageDto) {
        const receiver = await this.prisma.user.findUnique({
            where: { id: createMessageDto.receiverId },
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Receiver not found');
        }
        if (senderId === createMessageDto.receiverId) {
            throw new common_1.ForbiddenException('Cannot send message to yourself');
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
    async findConversation(userId, otherUserId) {
        const otherUser = await this.prisma.user.findUnique({
            where: { id: otherUserId },
        });
        if (!otherUser) {
            throw new common_1.NotFoundException('User not found');
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
    async findUserConversations(userId) {
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
            }
            else {
                const conversation = conversationsMap.get(partnerId);
                if (message.timestamp > conversation.lastMessage.timestamp) {
                    conversation.lastMessage = message;
                }
            }
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map