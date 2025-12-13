import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (vendor only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    example: {
      id: 1,
      title: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      price: 999.99,
      stock: 50,
      vendorId: 1,
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
      message: 'User does not have a vendor profile',
      error: 'Not Found',
    },
  })
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with search and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    example: {
      data: [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          description: 'Latest iPhone with advanced features',
          price: 999.99,
          stock: 50,
          vendorId: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      },
    },
  })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    example: {
      id: 1,
      title: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      price: 999.99,
      stock: 50,
      vendorId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      vendor: {
        id: 1,
        businessName: 'Tech Store',
        userId: 1,
      },
      images: [
        {
          id: 1,
          url: 'https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg',
          publicId: 'products/1/image1',
          isPrimary: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get all products by vendor ID' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findByVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    return this.productsService.findByVendor(vendorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (owner only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.update(id, user.id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (owner only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.productsService.remove(id, user.id);
  }
}

