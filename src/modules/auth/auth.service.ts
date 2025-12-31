import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone, password, name, businessName, interests, businessPhone, businessLogo } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Validate business info for vendor registration
    if (!businessName || !interests || !businessPhone || !businessLogo) {
      throw new BadRequestException(
        'All business info (name, interests, phone, logo) is required for vendor registration',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload business logo to Cloudinary
    let logoUploadResult;
    try {
      logoUploadResult = await this.cloudinaryService.uploadImage(businessLogo, 'vendor-logos');
    } catch (error) {
      throw new BadRequestException('Failed to upload business logo');
    }

    // Create user and vendor profile, then attach logo once vendor id exists
    const createdUser = await this.prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          name,
          vendor: {
            create: {
              businessName,
              interests,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
          vendor: {
            select: {
              id: true,
              businessName: true,
              interests: true,
            },
          },
        },
      });

      if (!userRecord.vendor) {
        throw new InternalServerErrorException('Failed to create vendor profile');
      }

      await tx.image.create({
        data: {
          url: logoUploadResult.url,
          publicId: logoUploadResult.publicId,
          entityType: 'vendor',
          entityId: userRecord.vendor.id,
          isPrimary: true,
          vendor: {
            connect: {
              id: userRecord.vendor.id,
            },
          },
        },
      });

      return userRecord;
    });

    const user = await this.prisma.user.findUnique({
      where: { id: createdUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            interests: true,
            logo: {
              select: {
                id: true,
                url: true,
                publicId: true,
                entityType: true,
                isPrimary: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new InternalServerErrorException('Failed to retrieve created user');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    };
  }

  async logout(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    return user;
  }
}

