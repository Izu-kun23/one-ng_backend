import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vendor profile' })
  @ApiResponse({
    status: 201,
    description: 'Vendor profile created successfully',
    example: {
      id: 1,
      businessName: 'Tech Store',
      interests: 'Electronics, Gadgets',
      userId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already has a vendor profile',
    example: {
      statusCode: 409,
      message: 'User already has a vendor profile',
      error: 'Conflict',
    },
  })
  async create(@Body() createVendorDto: CreateVendorDto, @CurrentUser() user: any) {
    return this.vendorsService.create(user.id, createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all vendors' })
  @ApiQuery({ name: 'interests', required: false, description: 'Filter by interests' })
  @ApiResponse({
    status: 200,
    description: 'Vendors retrieved successfully',
    example: [
      {
        id: 1,
        businessName: 'Tech Store',
        interests: 'Electronics, Gadgets',
        userId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    ],
  })
  async findAll(@Query() query: VendorQueryDto) {
    return this.vendorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor retrieved successfully',
    example: {
      id: 1,
      businessName: 'Tech Store',
      interests: 'Electronics, Gadgets',
      userId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      logo: {
        id: 1,
        url: 'https://res.cloudinary.com/example/image/upload/v1/vendors/1/logo.jpg',
        publicId: 'vendors/1/logo',
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor profile' })
  @ApiResponse({ status: 200, description: 'Vendor profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @CurrentUser() user: any,
  ) {
    return this.vendorsService.update(id, user.id, updateVendorDto);
  }
}

