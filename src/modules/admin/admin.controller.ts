import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminQueryDto } from './dto/admin-query.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ApproveVendorDto } from './dto/approve-vendor.dto';
import { Admin } from '../../common/decorators/admin.decorator';

@ApiTags('admin')
@Controller('admin')
@Admin()
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(@Query() query: AdminQueryDto) {
    return this.adminService.getAllUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
  ) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban/unban user (admin only)' })
  @ApiResponse({ status: 200, description: 'User ban status updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() banUserDto: BanUserDto,
  ) {
    return this.adminService.banUser(id, banUserDto);
  }

  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors (admin only)' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async getAllVendors(@Query() query: AdminQueryDto) {
    return this.adminService.getAllVendors(query);
  }

  @Patch('vendors/:id/approve')
  @ApiOperation({ summary: 'Approve/reject vendor (admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor approval status updated' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async approveVendor(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveVendorDto: ApproveVendorDto,
  ) {
    return this.adminService.approveVendor(id, approveVendorDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products (admin only)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getAllProducts(@Query() query: AdminQueryDto) {
    return this.adminService.getAllProducts(query);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getAllOrders(@Query() query: AdminQueryDto) {
    return this.adminService.getAllOrders(query);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get system analytics (admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}

