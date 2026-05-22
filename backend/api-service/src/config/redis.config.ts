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

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: number;
  connectTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const redisConfig: RedisConfig = {
  host: getOptionalEnvVar('REDIS_HOST', 'localhost'),
  port: getOptionalIntEnvVar('REDIS_PORT', 26379),
  password: getOptionalEnvVar('REDIS_PASSWORD', undefined),
  db: getOptionalIntEnvVar('REDIS_DB', 0),
  keyPrefix: getOptionalEnvVar('REDIS_KEY_PREFIX', 'ecommerce:'),
  ttl: getOptionalIntEnvVar('REDIS_TTL', 604800),
  connectTimeout: getOptionalIntEnvVar('REDIS_CONNECT_TIMEOUT', 10000),
  retryAttempts: getOptionalIntEnvVar('REDIS_RETRY_ATTEMPTS', 3),
  retryDelay: getOptionalIntEnvVar('REDIS_RETRY_DELAY', 1000),
};

export function getRedisUrl(): string {
  const { host, port, password, db } = redisConfig;
  if (password) {
    return `redis://:${password}@${host}:${port}/${db}`;
  }
  return `redis://${host}:${port}/${db}`;
}

export function validateRedisConfig(): void {
  if (!redisConfig.host) {
    throw new Error('Redis host is required');
  }
  if (redisConfig.port <= 0 || redisConfig.port > 65535) {
    throw new Error('Redis port must be a valid port number');
  }
  if (redisConfig.ttl <= 0) {
    throw new Error('Redis TTL must be a positive number');
  }
}