import { Test, TestingModule } from '@nestjs/testing';
import { SinistrosController } from '../sinistros.controller';
import { SinistrosService } from '../sinistros.service';

describe('SinistrosController', () => {
  let controller: SinistrosController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinistrosController],
      providers: [{ provide: SinistrosService, useValue: mockService }],
    }).compile();
    controller = module.get<SinistrosController>(SinistrosController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const dto: any = {};
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('addDocument should call service.addDocument', async () => {
    mockService.addDocument.mockResolvedValue({ id: 'd1' });
    const dto: any = { type: 'PHOTO', url: 'http://example.com' };
    const result = await controller.addDocument('a1', dto);
    expect(mockService.addDocument).toHaveBeenCalledWith('a1', dto);
    expect(result).toBeDefined();
  });
});
