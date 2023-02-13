import { DataSource } from 'typeorm';
import ormConfig from '@app/orm.config';

export default new DataSource(ormConfig);
