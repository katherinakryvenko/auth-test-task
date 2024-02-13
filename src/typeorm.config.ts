import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export function getTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',

    host: config.get('POSTGRES_HOST'),
    port: parseInt(config.get('POSTGRES_PORT')),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DATABASE'),
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    entities: [join(__dirname, '**', '*.entity{.ts,.js}')],

    migrationsTableName: 'migration',

    migrations: [
      join(__dirname, '**', '/migration/*.ts'),
      join(__dirname, '**', '/migration/*.js'),
    ],
  };
}
