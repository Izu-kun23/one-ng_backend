import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, UploadedFiles, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UploadProductImageDto } from './dto/upload-product-image.dto';
import { UploadMultipleProductImagesDto } from './dto/upload-multiple-product-images.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

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
      images: [],
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
    try {
      this.logger.log('Creating product with DTO:', createProductDto);
      const result = await this.productsService.create(user.id, createProductDto);
      this.logger.log('Product created successfully:', result?.id);
      return result;
    } catch (error) {
      this.logger.error('Product creation failed:', error.response?.data || error.message);
      throw error;
    }
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
          images: [
            {
              id: 1,
              url: 'https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg',
              publicId: 'products/1/image1',
              isPrimary: true,
              entityType: 'product',
              entityId: 1,
            },
          ],
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
    try {
      this.logger.log('Updating product with DTO:', updateProductDto);
      const result = await this.productsService.update(id, user.id, updateProductDto);
      return result;
    } catch (error) {
      this.logger.error('Product update failed:', error.response?.data || error.message);
      throw error;
    }
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

  // Image management endpoints
  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single image to a product (owner only)' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async uploadImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadProductImageDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.uploadImage(productId, user.id, file, uploadDto.isPrimary);
  }

  @Post(':id/images/multiple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple images to a product (owner only)' })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async uploadMultipleImages(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: UploadMultipleProductImagesDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.uploadMultipleImages(productId, user.id, files, uploadDto.primaryIndex);
  }

  @Patch('images/:imageId/primary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set an image as primary (owner only)' })
  @ApiResponse({ status: 200, description: 'Primary image updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async setPrimaryImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser() user: any,
  ) {
    return this.productsService.setPrimaryImage(imageId, user.id);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product image (owner only)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async removeImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser() user: any,
  ) {
    return this.productsService.removeImage(imageId, user.id);
  }
}

