import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: '12345',
  database: 'mediumcloneAppDb',
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  synchronize: true,
};

export default config;
