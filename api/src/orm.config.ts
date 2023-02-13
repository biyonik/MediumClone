import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TagEntity } from './tag/tag.entity';
import { UserEntity } from './user/user.entity';

const entitiesList = [TagEntity, UserEntity];

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: '12345',
  database: 'mediumcloneAppDb',
  entities: entitiesList,
  migrations: ['src/migrations/**/*{.js,.ts}'],
  subscribers: ['src/subscribers/**/*{.js,.ts}'],
  synchronize: true,
};

export default config;
