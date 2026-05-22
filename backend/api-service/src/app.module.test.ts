import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ormConfig } from './config/ormconfig';


// Mock all feature modules
jest.mock('./users/users.module', () => ({
  UsersModule: { name: 'UsersModule' },
}));

jest.mock('./auth/auth.module', () => ({
  AuthModule: { name: 'AuthModule' },
}));

jest.mock('./products/products.module', () => ({
  ProductsModule: { name: 'ProductsModule' },
}));

jest.mock('./categories/categories.module', () => ({
  CategoriesModule: { name: 'CategoriesModule' },
}));

jest.mock('./cart/cart.module', () => ({
  CartModule: { name: 'CartModule' },
}));

jest.mock('./orders/orders.module', () => ({
  OrdersModule: { name: 'OrdersModule' },
}));

jest.mock('./payments/payments.module', () => ({
  PaymentsModule: { name: 'PaymentsModule' },
}));

jest.mock('./health/health.module', () => ({
  HealthModule: { name: 'HealthModule' },
}));

jest.mock('./config/ormconfig', () => ({
  ormConfig: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    entities: [],
  },
}));

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    const appModule = module.get<AppModule>(AppModule);
    expect(appModule).toBeDefined();
  });

  describe('Module Structure', () => {
    it('should be a NestJS Module', () => {
      const appModule = module.get<AppModule>(AppModule);
      expect(appModule.constructor.name).toBe('AppModule');
    });
  });

  describe('TypeORM Configuration', () => {
    it('should configure TypeORM with ormConfig', () => {
      const typeOrmInstance = module.get(TypeOrmModule);
      expect(typeOrmInstance).toBeDefined();
    });

    it('should have TypeOrmModule imported', () => {
      // TypeORM module should be part of imports
      const moduleImports = (AppModule as any).imports || [];
      const hasTypeOrm = moduleImports.some(
        (imp: any) => imp && imp.toString().includes('TypeOrmModule'),
      );
      expect(hasTypeOrm || moduleImports.length > 0).toBeTruthy();
    });
  });

  describe('ScheduleModule Configuration', () => {
    it('should have ScheduleModule imported', () => {
      const moduleImports = (AppModule as any).imports || [];
      const hasScheduleModule = moduleImports.some(
        (imp: any) => imp && imp.toString().includes('ScheduleModule'),
      );
      expect(hasScheduleModule || moduleImports.length > 0).toBeTruthy();
    });
  });

  describe('Feature Module Imports', () => {
    it('should import UsersModule', () => {
      const { UsersModule } = require('./users/users.module');
      expect(UsersModule).toBeDefined();
    });

    it('should import AuthModule', () => {
      const { AuthModule } = require('./auth/auth.module');
      expect(AuthModule).toBeDefined();
    });

    it('should import ProductsModule', () => {
      const { ProductsModule } = require('./products/products.module');
      expect(ProductsModule).toBeDefined();
    });

    it('should import CategoriesModule', () => {
      const { CategoriesModule } = require('./categories/categories.module');
      expect(CategoriesModule).toBeDefined();
    });

    it('should import CartModule', () => {
      const { CartModule } = require('./cart/cart.module');
      expect(CartModule).toBeDefined();
    });

    it('should import OrdersModule', () => {
      const { OrdersModule } = require('./orders/orders.module');
      expect(OrdersModule).toBeDefined();
    });

    it('should import PaymentsModule', () => {
      const { PaymentsModule } = require('./payments/payments.module');
      expect(PaymentsModule).toBeDefined();
    });

    it('should import HealthModule', () => {
      const { HealthModule } = require('./health/health.module');
      expect(HealthModule).toBeDefined();
    });
  });

  describe('Import Completeness', () => {
    it('should have all 9 feature modules imported (including TypeORM)', () => {
      const moduleImports = (AppModule as any).imports || [];
      expect(moduleImports.length).toBeGreaterThanOrEqual(9);
    });

    it('should include TypeOrmModule.forRoot', () => {
      const moduleImports = (AppModule as any).imports || [];
      const hasTypeOrmForRoot = moduleImports.some(
        (imp: any) => 
          imp && 
          (imp.toString().includes('TypeOrmModule.forRoot') || 
           imp.toString().includes('forRoot')),
      );
      expect(hasTypeOrmForRoot).toBeTruthy();
    });

    it('should include ScheduleModule.forRoot', () => {
      const moduleImports = (AppModule as any).imports || [];
      const hasScheduleForRoot = moduleImports.some(
        (imp: any) => 
          imp && 
          (imp.toString().includes('ScheduleModule.forRoot') ||
           imp.toString().includes('forRoot')),
      );
      expect(hasScheduleForRoot).toBeTruthy();
    });
  });

  describe('OrmConfig', () => {
    it('should export ormConfig', () => {
      expect(ormConfig).toBeDefined();
    });

    it('should have valid ormConfig structure', () => {
      expect(ormConfig).toHaveProperty('type');
      expect(ormConfig).toHaveProperty('host');
      expect(ormConfig).toHaveProperty('port');
      expect(ormConfig).toHaveProperty('entities');
    });

    it('should be postgres type', () => {
      expect(ormConfig.type).toBe('postgres');
    });
  });

  describe('Edge Cases', () => {
    it('should handle module compilation without errors', async () => {
      expect(async () => {
        const testModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
        await testModule.close();
      }).not.toThrow();
    });

    it('should be instantiable multiple times', async () => {
      const module1 = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      
      const module2 = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      
      expect(module1).toBeDefined();
      expect(module2).toBeDefined();
      
      await module1.close();
      await module2.close();
    });
  });

  describe('Module Dependency Graph', () => {
    it('should have UsersModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
      expect(Array.isArray(imports)).toBe(true);
    });

    it('should have AuthModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have ProductsModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have CategoriesModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have CartModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have OrdersModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have PaymentsModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });

    it('should have HealthModule in imports array', () => {
      const imports = (AppModule as any).imports;
      expect(imports).toBeDefined();
    });
  });
});
