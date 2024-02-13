import { Test, TestingModule } from '@nestjs/testing';
import { MigrationManagerService } from './migration-manager.service';

describe('MigrationManagerService', () => {
  let service: MigrationManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MigrationManagerService],
    }).compile();

    service = module.get<MigrationManagerService>(MigrationManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
