import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadFileDto, FileCategory } from './dto/upload-file.dto';
import { randomUUID } from 'crypto';

export interface FileMetadata {
  fileId: string;
  filename: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  url: string;
  createdAt: Date;
}

@Injectable()
export class StorageService {
  private readonly files = new Map<string, FileMetadata>();

  upload(dto: UploadFileDto): { fileId: string; url: string } {
    const fileId = randomUUID();
    const url = `/storage/files/${fileId}`;
    const metadata: FileMetadata = {
      fileId,
      filename: dto.filename,
      mimeType: dto.mimeType,
      size: dto.size,
      category: dto.category ?? FileCategory.OTHER,
      url,
      createdAt: new Date(),
    };
    this.files.set(fileId, metadata);
    return { fileId, url };
  }

  getFile(id: string): FileMetadata {
    const file = this.files.get(id);
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  listFiles(category?: FileCategory): FileMetadata[] {
    const all = Array.from(this.files.values());
    return category ? all.filter((f) => f.category === category) : all;
  }

  deleteFile(id: string): { deleted: boolean } {
    const exists = this.files.has(id);
    if (!exists) throw new NotFoundException(`File ${id} not found`);
    this.files.delete(id);
    return { deleted: true };
  }
}
