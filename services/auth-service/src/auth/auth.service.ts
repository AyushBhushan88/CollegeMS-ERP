import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { prisma } from '@campuscore/database';
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from '@campuscore/shared-utils';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  private readonly authenticator = (otplib as any).authenticator ?? otplib;
  constructor(private configService: ConfigService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const user = await prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: registerDto.role as any,
      },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      return {
        mfaRequired: true,
        email: user.email,
      };
    }

    const token = this.generateJwt(user);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async enableMfa(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const secret = this.authenticator.generateSecret();
    const otpauthUrl = this.authenticator.keyuri(email, 'CampusCore', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    await prisma.user.update({
      where: { email },
      data: {
        twoFactorSecret: secret,
      },
    });

    return {
      secret,
      qrCodeUrl,
    };
  }

  async verifyMfa(verifyMfaDto: VerifyMfaDto) {
    const user = await prisma.user.findUnique({
      where: { email: verifyMfaDto.email },
    });

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('MFA not enabled or user not found');
    }

    const isValid = this.authenticator.verify({
      token: verifyMfaDto.token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    if (!user.isTwoFactorEnabled) {
      await prisma.user.update({
        where: { email: user.email },
        data: { isTwoFactorEnabled: true },
      });
    }

    const token = this.generateJwt(user);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private generateJwt(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return generateToken(
      payload,
      this.configService.get<string>('JWT_SECRET') || 'secret',
      this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    );
  }
}
