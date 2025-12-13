import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    example: {
      id: 1,
      total: 999.99,
      buyerId: 2,
      sellerId: 1,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      vendor: {
        id: 1,
        businessName: 'Tech Store',
        userId: 1,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor not found',
    example: {
      statusCode: 404,
      message: 'Vendor not found',
      error: 'Not Found',
    },
  })
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'List user orders' })
  @ApiQuery({ name: 'role', required: false, enum: ['buyer', 'seller', 'all'], description: 'Filter by role' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    example: [
      {
        id: 1,
        total: 999.99,
        buyerId: 2,
        sellerId: 1,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        vendor: {
          id: 1,
          businessName: 'Tech Store',
          userId: 1,
        },
      },
    ],
  })
  async findAll(@Query('role') role: 'buyer' | 'seller' | 'all', @CurrentUser() user: any) {
    return this.ordersService.findAll(user.id, role || 'all');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    example: {
      id: 1,
      total: 999.99,
      buyerId: 2,
      sellerId: 1,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      vendor: {
        id: 1,
        businessName: 'Tech Store',
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not order participant',
    example: {
      statusCode: 403,
      message: 'You are not authorized to view this order',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    example: {
      statusCode: 404,
      message: 'Order not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (seller only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not seller' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateStatus(id, user.id, updateOrderStatusDto);
  }
}

