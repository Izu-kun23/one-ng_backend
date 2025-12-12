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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const file_validation_pipe_1 = require("../../common/pipes/file-validation.pipe");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadProfile(file, user) {
        return this.uploadService.uploadProfileImage(user.id, file);
    }
    async uploadVendorLogo(vendorId, file, user) {
        return this.uploadService.uploadVendorLogo(vendorId, user.id, file);
    }
    async uploadProductImages(productId, files, user) {
        return this.uploadService.uploadProductImages(productId, user.id, files);
    }
    async deleteImage(imageId, user) {
        const isAdmin = user.role === 'ADMIN';
        return this.uploadService.deleteImage(imageId, user.id, isAdmin);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UsePipes)(file_validation_pipe_1.FileValidationPipe),
    (0, swagger_1.ApiOperation)({ summary: 'Upload user profile picture' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profile image uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid file' }),
    __param(0, (0, common_1.UploadedFile)(file_validation_pipe_1.FileValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProfile", null);
__decorate([
    (0, common_1.Post)('vendor/:vendorId/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload vendor logo' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vendor logo uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid file' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not vendor owner' }),
    __param(0, (0, common_1.Param)('vendorId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadVendorLogo", null);
__decorate([
    (0, common_1.Post)('product/:productId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload product images (multiple, max 10)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product images uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid files or too many files' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImages", null);
__decorate([
    (0, common_1.Delete)(':imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image (owner or admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not owner or admin' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Image not found' }),
    __param(0, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteImage", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('upload'),
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map