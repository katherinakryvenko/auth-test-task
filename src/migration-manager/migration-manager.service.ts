import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationManagerService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.dataSource.runMigrations();
  }
}
