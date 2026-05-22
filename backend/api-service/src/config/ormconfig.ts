import { DataSource, DataSourceOptions } from 'typeorm';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is missing`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

function getOptionalIntEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  return value ? parseInt(value, 10) : defaultValue;
}

const nodeEnv = getOptionalEnvVar('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: getOptionalEnvVar('DATABASE_HOST', 'localhost'),
  port: getOptionalIntEnvVar('DATABASE_PORT', 25432),
  username: getOptionalEnvVar('DATABASE_USER', 'postgres'),
  password: getOptionalEnvVar('DATABASE_PASSWORD', 'postgres'),
  database: getOptionalEnvVar('DATABASE_NAME', 'ecommerce'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: !isProduction,
  logging: !isProduction,
  ssl: isProduction,
  extra: {
    max: getOptionalIntEnvVar('DATABASE_POOL_MAX', 20),
    min: getOptionalIntEnvVar('DATABASE_POOL_MIN', 5),
  },
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
};

export const dataSource = new DataSource(ormConfig);

export function validateOrmConfig(): void {
  const requiredVars = ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_NAME'];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.warn(`Optional environment variable ${varName} not set, using defaults`);
    }
  }
}