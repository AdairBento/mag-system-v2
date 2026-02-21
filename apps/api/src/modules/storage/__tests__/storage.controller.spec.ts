import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from '../storage.controller';
import { StorageService } from '../storage.service';

describe('StorageController', () => {
  let controller: StorageController;

  const mockService: any = {
    upload: jest.fn(),
    getFile: jest.fn(),
    listFiles: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [{ provide: StorageService, useValue: mockService }],
    }).compile();
    controller = module.get<StorageController>(StorageController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('upload should call service.upload', () => {
    mockService.upload.mockReturnValue({ fileId: 'f1', url: '/storage/files/f1' });
    const dto: any = { filename: 'test.pdf', mimeType: 'application/pdf', size: 1024 };
    const result = controller.upload(dto);
    expect(mockService.upload).toHaveBeenCalledWith(dto);
    expect(result.fileId).toBe('f1');
  });

  it('listFiles should call service.listFiles', () => {
    mockService.listFiles.mockReturnValue([]);
    const result = controller.listFiles();
    expect(mockService.listFiles).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
