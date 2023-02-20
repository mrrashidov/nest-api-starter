import type { Knex } from 'knex';

const { DB_NAME, DB_USER, DB_PASSWORD, DB_CLIENT, DB_PORT } = process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: DB_CLIENT,
    connection: {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      port: parseInt(DB_PORT),
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './database/seeds',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
  staging: {
    client: DB_CLIENT,
    connection: {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './database/seeds',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
  production: {
    client: DB_CLIENT,
    connection: {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './database/seeds',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
};

module.exports = config;
