import { PipeTransform } from '@nestjs/common';
export declare class FileValidationPipe implements PipeTransform {
    private readonly maxSize;
    private readonly allowedMimeTypes;
    transform(file: Express.Multer.File): Express.Multer.File;
}
