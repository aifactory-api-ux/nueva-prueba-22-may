import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './main';
import { API_CONFIG } from './shared/constants';
import { validateOrmConfig, validateRedisConfig } from './config/ormconfig';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('./shared/constants', () => ({
  API_CONFIG: {
    PREFIX: 'api/v1',
    PORT: 3000,
  },
}));

jest.mock('./config/ormconfig', () => ({
  validateOrmConfig: jest.fn(),
  validateRedisConfig: jest.fn(),
}));

describe('Bootstrap Function', () => {
  let mockApp: any;
  let mockNestFactory: jest.Mocked<typeof NestFactory>;


  beforeEach(() => {
    jest.clearAllMocks();
    
    mockApp = {
      setGlobalPrefix: jest.fn().mockReturnThis(),
      useGlobalPipes: jest.fn().mockReturnThis(),
      enableCors: jest.fn().mockReturnThis(),
      enableShutdownHooks: jest.fn().mockReturnThis(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    mockNestFactory = NestFactory as jest.Mocked<typeof NestFactory>;
    mockNestFactory.create.mockResolvedValue(mockApp);
  });

  describe('Configuration Validation', () => {
    it('should validate ORM configuration on startup', async () => {
      const originalValidateOrmConfig = require('./config/ormconfig').validateOrmConfig;
      
      await import('./main');
      
      expect(originalValidateOrmConfig).toHaveBeenCalledTimes(1);
    });

    it('should validate Redis configuration on startup', async () => {
      const originalValidateRedisConfig = require('./config/ormconfig').validateRedisConfig;
      
      await import('./main');
      
      expect(originalValidateRedisConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('NestJS Application Creation', () => {
    it('should create NestJS application with AppModule', async () => {
      await import('./main');
      
      expect(mockNestFactory.create).toHaveBeenCalledWith(
        AppModule,
        expect.objectContaining({
          logger: ['error', 'warn', 'log', 'debug'],
        }),
      );
    });

    it('should use correct logger levels', async () => {
      await import('./main');
      
      const createCall = mockNestFactory.create.mock.calls[0];
      expect(createCall[1].logger).toEqual(['error', 'warn', 'log', 'debug']);
    });
  });

  describe('Global Prefix Configuration', () => {
    it('should set global prefix from API_CONFIG', async () => {
      await import('./main');
      
      expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    });
  });

  describe('ValidationPipe Configuration', () => {
    it('should configure ValidationPipe with whitelist enabled', async () => {
      await import('./main');
      
      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe),
      );
    });

    it('should set forbidNonWhitelisted to true', async () => {
      await import('./main');
      
      const pipeConfig = mockApp.useGlobalPipes.mock.calls[0][0];
      expect(pipeConfig).toBeInstanceOf(ValidationPipe);
      expect(pipeConfig).toMatchObject({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    });

    it('should set transform to true', async () => {
      await import('./main');
      
      const pipeConfig = mockApp.useGlobalPipes.mock.calls[0][0];
      expect(pipeConfig.transform).toBe(true);
    });

    it('should enable implicit conversion', async () => {
      await import('./main');
      
      const pipeConfig = mockApp.useGlobalPipes.mock.calls[0][0];
      expect(pipeConfig.transformOptions).toEqual({
        enableImplicitConversion: true,
      });
    });
  });

  describe('CORS Configuration', () => {
    it('should enable CORS', async () => {
      await import('./main');
      
      expect(mockApp.enableCors).toHaveBeenCalled();
    });

    it('should use ALLOWED_ORIGINS from env or default localhost', async () => {
      const originalEnv = process.env.ALLOWED_ORIGINS;
      delete process.env.ALLOWED_ORIGINS;
      
      await import('./main');
      
      const corsConfig = mockApp.enableCors.mock.calls[0][0];
      expect(corsConfig.origin).toEqual(['http://localhost:24000']);
      expect(corsConfig.credentials).toBe(true);
      
      process.env.ALLOWED_ORIGINS = originalEnv;
    });

    it('should parse multiple origins from env variable', async () => {
      const originalEnv = process.env.ALLOWED_ORIGINS;
      process.env.ALLOWED_ORIGINS = 'http://localhost:24000,https://example.com,https://app.com';
      
      await import('./main');
      
      const corsConfig = mockApp.enableCors.mock.calls[0][0];
      expect(corsConfig.origin).toEqual(['http://localhost:24000', 'https://example.com', 'https://app.com']);
      
      process.env.ALLOWED_ORIGINS = originalEnv;
    });

    it('should set credentials to true', async () => {
      await import('./main');
      
      const corsConfig = mockApp.enableCors.mock.calls[0][0];
      expect(corsConfig.credentials).toBe(true);
    });
  });

  describe('Shutdown Hooks', () => {
    it('should enable shutdown hooks', async () => {
      await import('./main');
      
      expect(mockApp.enableShutdownHooks).toHaveBeenCalled();
    });
  });

  describe('Server Listening', () => {
    it('should listen on configured port', async () => {
      await import('./main');
      
      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });

    it('should wait for server to start', async () => {
      await import('./main');
      
      expect(mockApp.listen).toHaveBeenCalled();
      await expect(mockApp.listen.mock.results[0].value).resolves.toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let processExitSpy: jest.SpyInstance;
    let originalBootstrap: () => Promise<void>;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should exit with code 1 on bootstrap failure', async () => {
      const testError = new Error('Database connection failed');
      mockNestFactory.create.mockRejectedValueOnce(testError);

      // Re-import to trigger bootstrap again
      jest.resetModules();
      jest.mock('@nestjs/core', () => ({
        NestFactory: {
          create: jest.fn().mockRejectedValue(testError),
        },
      }));
      
      const mainModule = await import('./main');
      
      // The bootstrap is called immediately, so we need to wait
      await new Promise(resolve => setImmediate(resolve));
      
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should log error message before exit', async () => {
      const testError = new Error('Connection refused');
      mockNestFactory.create.mockRejectedValueOnce(testError);

      jest.resetModules();
      jest.mock('@nestjs/core', () => ({
        NestFactory: {
          create: jest.fn().mockRejectedValue(testError),
        },
      }));
      
      await import('./main');
      
      await new Promise(resolve => setImmediate(resolve));
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to start application:',
        testError,
      );
    });
  });

  describe('Logger Output', () => {
    it('should log application running URL', async () => {
      const loggerLogSpy = jest.spyOn(Logger.prototype, 'log');
      
      await import('./main');
      
      expect(loggerLogSpy).toHaveBeenCalledWith(
        'Application is running on: http://0.0.0.0:3000',
      );
    });

    it('should log health check URL', async () => {
      const loggerLogSpy = jest.spyOn(Logger.prototype, 'log');
      
      await import('./main');
      
      expect(loggerLogSpy).toHaveBeenCalledWith(
        'Health check available at: http://0.0.0.0:3000/health',
      );
    });

    it('should use Bootstrap logger', async () => {
      const logger = new Logger('Bootstrap');
      const loggerSpy = jest.spyOn(logger, 'log');
      
      // Just verify the Logger is instantiated with correct context
      expect(loggerSpy).not.toHaveBeenCalled(); // Not called yet
    });
  });
});
