import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileValidationPipe)
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG, PNG, GIF, etc.)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Profile image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file' })
  async uploadProfile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.uploadService.uploadProfileImage(user.id, file);
  }

  @Post('vendor/:vendorId/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload vendor logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (JPG, PNG, GIF, etc.)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Vendor logo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file' })
  @ApiResponse({ status: 403, description: 'Forbidden - not vendor owner' })
  async uploadVendorLogo(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.uploadService.uploadVendorLogo(vendorId, user.id, file);
  }

  @Post('product/:productId')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload product images (multiple, max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          maxItems: 10,
          items: {
            type: 'string',
            format: 'binary',
            description: 'Image file (JPG, PNG, GIF, etc.)',
          },
          description: 'Array of image files (maximum 10 files)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid files or too many files' })
  @ApiResponse({ status: 403, description: 'Forbidden - not product owner' })
  async uploadProductImages(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    return this.uploadService.uploadProductImages(productId, user.id, files);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Delete image (owner or admin only)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner or admin' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser() user: any,
  ) {
    const isAdmin = user.role === 'ADMIN';
    return this.uploadService.deleteImage(imageId, user.id, isAdmin);
  }
}

