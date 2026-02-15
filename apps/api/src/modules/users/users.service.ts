import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectPublic = {
    id: true,
    email: true,
    name: true,
    role: true,
    status: true,
    failedLoginAttempts: true,
    lockedUntil: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  } as const;

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const created = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role ?? UserRole.OPERATOR,
        status: dto.status ?? UserStatus.ACTIVE,
      },
      select: this.selectPublic,
    });

    return new User(created);
  }

  async findAll(includeDeleted = false): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: this.selectPublic,
    });
    return users.map((u) => new User(u));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: this.selectPublic,
    });
    if (!user) throw new NotFoundException('Usuário #' + id + ' não encontrado');
    return new User(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: this.selectPublic,
    });
    return user ? new User(user) : null;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    if (dto.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing && existing.id !== id)
        throw new ConflictException('Email já em uso por outro usuário');
    }

    const data: {
      email?: string;
      name?: string;
      role?: UserRole;
      status?: UserStatus;
      passwordHash?: string;
    } = {};

    if (dto.email !== undefined) data.email = dto.email;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: this.selectPublic,
    });

    return new User(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.selectPublic,
    });
    if (!user) throw new NotFoundException('Usuário #' + id + ' não encontrado');
    if (!user.deletedAt) throw new BadRequestException('Usuário não está deletado');

    const restored = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.selectPublic,
    });

    return new User(restored);
  }
}
