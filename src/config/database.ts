import { DataSource, EntitySchema } from 'typeorm';
import logger from '../utils/logger';
import { config } from './env';
import * as Entities from '../entities'
import * as Migrations from '../migrations';

// Read the database configuration from config.json
let databaseConfig = config.DB_CONFIG;

let pgSQl_dataSource: DataSource | null = null;

const connectDB = async (options?: { journeyId?: string }) => {
  const { journeyId } = options || {};

  try {
    if (!databaseConfig) {
      throw new Error('Database configuration not found. Check your config file.');
    }

    // Log database connection attempt with journeyId
    logger.info(`[${journeyId || 'Unknown'}] Attempting to connect to pgSql...`);
    const entities = Object.values(Entities) as (string | Function | EntitySchema<any>)[];
    pgSQl_dataSource = new DataSource({
      type: 'postgres',
      host: databaseConfig.host,
      port: 5432, // Adjust port if necessary
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities : [...Object.values(entities)],
      migrations: [...Object.values(Migrations)],
      synchronize: false, // Use synchronize: true only in development, to auto-create database schema
      // timezone: 'Asia/Kolkata',
      logging: config.NODE_ENV === 'PRODUCTION' ? false: true,
      extra: {
        connectionLimit: 10, // Adjust based on your application's needs
      },
      // the below line saved my life 
      ...((config.NODE_ENV === 'DEVELOPMENT' || config.NODE_ENV === 'PRODUCTION') && {
        ssl: {
          rejectUnauthorized: false, // Similar to pg Pool
        },
      }),
    });

    // Initialize the connection
    await pgSQl_dataSource.initialize();
    console.log('pgSQL connected successfully');

    // Log successful connection with journeyId
    logger.info(`[${journeyId || databaseConfig.database}] pgSQL connected`);
    return pgSQl_dataSource;
  } catch (err) {
    // Log connection error with journeyId
    logger.error(`[${journeyId || databaseConfig.database}] pgSQL connection error: ${(err as Error).message}`);
    process.exit(1); // Exit process on connection error
  }
};

const getDataSource = () => {
  if (!pgSQl_dataSource) {
    throw new Error('DataSource is not initialized. Call connectDB first.');
  }
  return pgSQl_dataSource;
};

const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseConfig.host,
  port: 5432,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [...Object.values(Entities)],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false,
  logging: ["query", "error"],
  ...((config.NODE_ENV === 'DEVELOPMENT' || config.NODE_ENV === 'PRODUCTION') && {
    ssl: {
      rejectUnauthorized: false, // Similar to pg Pool
    },
  }),
});

export { connectDB, getDataSource, AppDataSource};
