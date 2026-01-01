import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // REGISTER (NO FILE UPLOADS)
  // =========================
  async register(registerDto: RegisterDto) {
    const {
      email,
      phone,
      password,
      name,
      businessName,
      interests,
      businessPhone,
    } = registerDto;

    // 1️⃣ Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // 2️⃣ Validate required vendor fields
    if (!businessName || !interests || !businessPhone) {
      throw new BadRequestException(
        'Business info (name, interests, phone) is required for vendor registration',
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user + vendor atomically
    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          name,
          vendor: {
            create: {
              businessName,
              interests,
              businessPhone,
            },
          },
        },
        include: {
          vendor: true,
        },
      });

      if (!user.vendor) {
        throw new InternalServerErrorException('Vendor creation failed');
      }

      return user;
    });

    // 5️⃣ Fetch clean response
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
            businessPhone: true,
            logo: {
              select: {
                id: true,
                url: true,
                publicId: true,
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

    // 6️⃣ Generate JWT
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  // =========================
  // LOGIN
  // =========================
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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

  // =========================
  // LOGOUT
  // =========================
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

  // =========================
  // VALIDATE USER
  // =========================
  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });
  }
}