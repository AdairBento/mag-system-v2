import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Damage, InspectionPhoto } from '@mag-system/database';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class VistoriasService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Damages ───────────────────────────────────────────────────────────────
  async createDamage(dto: CreateDamageDto): Promise<Damage> {
    return this.prisma.damage.create({
      data: {
        inspectionId: dto.inspectionId,
        description: dto.description,
        severity: dto.severity,
        location: dto.location,
        estimatedCost: dto.estimatedCost ?? null,
      },
    });
  }

  async findDamagesByInspection(inspectionId: string): Promise<Damage[]> {
    return this.prisma.damage.findMany({ where: { inspectionId } });
  }

  async updateDamage(id: string, dto: UpdateDamageDto): Promise<Damage> {
    return this.prisma.damage.update({ where: { id }, data: dto as any });
  }

  async removeDamage(id: string): Promise<Damage> {
    return this.prisma.damage.delete({ where: { id } });
  }

  // ── Photos ────────────────────────────────────────────────────────────────
  async createPhoto(dto: CreatePhotoDto): Promise<InspectionPhoto> {
    return this.prisma.inspectionPhoto.create({
      data: {
        inspectionId: dto.inspectionId,
        url: dto.url,
        description: dto.description ?? null,
      },
    });
  }

  async findPhotosByInspection(inspectionId: string): Promise<InspectionPhoto[]> {
    return this.prisma.inspectionPhoto.findMany({ where: { inspectionId } });
  }

  async removePhoto(id: string): Promise<InspectionPhoto> {
    return this.prisma.inspectionPhoto.delete({ where: { id } });
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  async getInspectionSummary(inspectionId: string) {
    const [damages, photos] = await Promise.all([
      this.prisma.damage.findMany({ where: { inspectionId } }),
      this.prisma.inspectionPhoto.count({ where: { inspectionId } }),
    ]);

    const totalCost = damages.reduce((sum, d) => sum + Number(d.estimatedCost ?? 0), 0);

    return {
      damages: { count: damages.length, totalCost },
      photos: { count: photos },
    };
  }
}
