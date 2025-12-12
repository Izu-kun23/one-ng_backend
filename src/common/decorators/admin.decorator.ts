import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';

export function Admin() {
  return applyDecorators(UseGuards(AdminGuard), ApiBearerAuth());
}

