import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); //this will load my .env files. did not use configservcie cos this is happening outside nest js scope

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: ['dist/**/*entity.js'],
  migrations: ['dist/db/migrations/*.js'],
});
