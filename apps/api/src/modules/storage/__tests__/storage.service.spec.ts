import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from '../storage.service';
import { FileCategory } from '../dto/upload-file.dto';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();
    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('upload should return fileId and url', () => {
    const dto: any = {
      filename: 'contract.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      category: FileCategory.CONTRACT,
    };
    const result = service.upload(dto);
    expect(result.fileId).toBeDefined();
    expect(result.url).toContain(result.fileId);
  });

  it('getFile should return uploaded file metadata', () => {
    const { fileId } = service.upload({
      filename: 'test.jpg',
      mimeType: 'image/jpeg',
      size: 512,
      category: FileCategory.PHOTO,
    } as any);
    const file = service.getFile(fileId);
    expect(file.fileId).toBe(fileId);
    expect(file.category).toBe(FileCategory.PHOTO);
  });

  it('listFiles should filter by category', () => {
    service.upload({
      filename: 'a.pdf',
      mimeType: 'application/pdf',
      size: 100,
      category: FileCategory.CONTRACT,
    } as any);
    service.upload({
      filename: 'b.jpg',
      mimeType: 'image/jpeg',
      size: 200,
      category: FileCategory.PHOTO,
    } as any);
    const contracts = service.listFiles(FileCategory.CONTRACT);
    expect(contracts.every((f) => f.category === FileCategory.CONTRACT)).toBe(true);
  });

  it('deleteFile should remove the file', () => {
    const { fileId } = service.upload({
      filename: 'del.pdf',
      mimeType: 'application/pdf',
      size: 100,
    } as any);
    const result = service.deleteFile(fileId);
    expect(result.deleted).toBe(true);
    expect(() => service.getFile(fileId)).toThrow();
  });
});
