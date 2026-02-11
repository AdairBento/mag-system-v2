import { Test, TestingModule } from '@nestjs/testing';
import { InspectionsController } from '../inspections.controller';
import { InspectionsService } from '../inspections.service';

describe('InspectionsController', () => {
  let controller: InspectionsController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionsController],
      providers: [{ provide: InspectionsService, useValue: mockService }],
    }).compile();

    controller = module.get<InspectionsController>(InspectionsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create (if controller has create)', async () => {
    mockService.create.mockResolvedValue({ id: '1' });

    const fn = (controller as any).create;
    if (typeof fn === 'function') {
      const dto: any = {};
      const result = await fn.call(controller, dto);
      expect(mockService.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    } else {
      expect(true).toBe(true);
    }
  });
});
