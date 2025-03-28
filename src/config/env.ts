import dotenv from 'dotenv';
dotenv.config();

// console.log( process.env.NODE_ENV)

const NODE_ENV = process.env.NODE_ENV || 'LOCAL';

interface DBConfig {
    host: string;
    username: string;
    password: string;
    database: string;
}

const dbConfig: Record<string, DBConfig> = {
    'JEST': {
        host: process.env.PG_SQL_HOST_JEST || '',
        username: process.env.PG_SQL_USERNAME_JEST || '',
        password: process.env.PG_SQL_PASSWORD_JEST || '',
        database: process.env.PG_SQL_DATABASE_JEST || '',
    },
    'LOCAL': {
        host: process.env.PG_SQL_HOST_LOCAL || '',
        username: process.env.PG_SQL_USERNAME_LOCAL || '',
        password: process.env.PG_SQL_PASSWORD_LOCAL || '',
        database: process.env.PG_SQL_DATABASE_LOCAL || '',
    },
    'DEVELOPMENT': {
        host: process.env.PG_SQL_HOST_DEV || '',
        username: process.env.PG_SQL_USERNAME_DEV || '',
        password: process.env.PG_SQL_PASSWORD_DEV || '',
        database: process.env.PG_SQL_DATABASE_DEV || '',
    },
    'PRODUCTION': {
        host: process.env.PG_SQL_HOST_PROD || '',
        username: process.env.PG_SQL_USERNAME_PROD || '',
        password: process.env.PG_SQL_PASSWORD_PROD || '',
        database: process.env.PG_SQL_DATABASE_PROD || '',
    },
};
// console.log("dbConfig",dbConfig)
export const config = {
    NODE_ENV,
    DB_CONFIG: dbConfig[NODE_ENV],  // Defaults to local if NODE_ENV is undefined
    env_variables: {
        
    } 
};

export const JWT_SECRET = process.env.JWT_SECRET ||  "xyzabcdefghiahdn";