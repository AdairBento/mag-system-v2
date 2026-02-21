import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Setting } from '@mag-system/database';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { FilterSettingDto } from './dto/filter-setting.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSettingDto): Promise<Setting> {
    return this.prisma.setting.create({
      data: {
        key: dto.key,
        value: dto.value,
        type: dto.type ?? 'string',
      },
    });
  }

  async findAll(filter: FilterSettingDto): Promise<PaginatedResult<Setting>> {
    const { skip = 0, take = 10, search } = filter || {};
    const where: any = {};
    if (search) where.key = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.setting.findMany({ where, skip, take }),
      this.prisma.setting.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({ where: { id } });
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string, type?: string): Promise<Setting> {
    return this.prisma.setting.upsert({
      where: { key },
      create: { key, value, type: type ?? 'string' },
      update: { value, ...(type ? { type } : {}) },
    });
  }

  async update(id: string, dto: UpdateSettingDto): Promise<Setting> {
    return this.prisma.setting.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Setting> {
    return this.prisma.setting.delete({ where: { id } });
  }
}
