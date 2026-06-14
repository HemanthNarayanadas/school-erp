import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
let sequelize: Sequelize;

if (dbUrl) {
  console.log('Database Configuration: PostgreSQL detected.');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
  });
} else {
  const dbPath = path.join(process.cwd(), 'school_erp.db');
  console.log(`Database Configuration: No PostgreSQL URL provided. Falling back to SQLite: ${dbPath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
}

export { sequelize };
export default sequelize;
