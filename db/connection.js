import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME || 'factus_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS !== undefined ? process.env.DB_PASS : '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  logging: console.log,
  pool: { max: 5, min: 0, idle: 10000 }
});

export default sequelize;
