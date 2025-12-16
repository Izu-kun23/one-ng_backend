import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Allow the API (and Swagger) to boot even if DATABASE_URL isn't set yet.
    // In production you should set DATABASE_URL; otherwise DB-backed endpoints will fail.
    if (!process.env.DATABASE_URL) {
      this.logger.warn('DATABASE_URL is not set. Skipping Prisma connection on startup.');
      return;
    }
    try {
      await this.$connect();
    } catch (err) {
      this.logger.error('Failed to connect to database on startup.', err as any);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

