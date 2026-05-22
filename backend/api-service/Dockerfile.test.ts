import * as fs from 'fs';
import * as path from 'path';

describe('Dockerfile Validation', () => {
  const dockerfilePath = path.join(__dirname, 'Dockerfile');
  let dockerfileContent: string;


  beforeAll(() => {
    if (fs.existsSync(dockerfilePath)) {
      dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
    } else {
      dockerfileContent = '';
    }
  });


  describe('Dockerfile Existence', () => {
    it('should have a Dockerfile in the api-service directory', () => {
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });
  });

  describe('Base Image', () => {
    it('should use Node.js 20.x base image', () => {
      if (!dockerfileContent) return;
      
      const hasNode20 = dockerfileContent.includes('node:20') ||
                         dockerfileContent.includes('node:20-alpine') ||
                         dockerfileContent.includes('node:20-slim');
      expect(hasNode20).toBe(true);
    });

    it('should specify exact version tag', () => {
      if (!dockerfileContent) return;
      
      const versionPattern = /node:20\.\d+\.\d+/;
      expect(dockerfileContent).toMatch(versionPattern);
    });
  });

  describe('Working Directory', () => {
    it('should set working directory', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('WORKDIR');
    });

    it('should set working directory to /app', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('WORKDIR /app');
    });
  });


  describe('Package Installation', () => {
    it('should copy package files before installing dependencies', () => {
      if (!dockerfileContent) return;
      
      const packageJsonIndex = dockerfileContent.indexOf('package');
      const npmInstallIndex = dockerfileContent.indexOf('npm install');
      
      if (packageJsonIndex !== -1 && npmInstallIndex !== -1) {
        expect(packageJsonIndex).toBeLessThan(npmInstallIndex);
      }
    });

    it('should use npm ci for production builds', () => {
      if (!dockerfileContent) return;
      
      const isProductionBuild = dockerfileContent.includes('npm ci') ||
                                dockerfileContent.includes('npm install --production');
      expect(isProductionBuild).toBe(true);
    });

    it('should install dependencies before copying source code', () => {
      if (!dockerfileContent) return;
      
      const packageFiles = ['package.json', 'package-lock.json'];
      const npmInstallIndex = dockerfileContent.indexOf('npm install');
      
      for (const file of packageFiles) {
        const fileIndex = dockerfileContent.indexOf(file);
        if (fileIndex !== -1 && npmInstallIndex !== -1) {
          expect(fileIndex).toBeLessThan(npmInstallIndex);
        }
      }
    });
  });

  describe('Production Optimization', () => {
    it('should include NODE_ENV=production', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('NODE_ENV=production');
    });

    it('should run npm ci without dev dependencies for production', () => {
      if (!dockerfileContent) return;
      
      // Should either use npm ci or npm install --omit=dev
      const hasOptimizedInstall = dockerfileContent.includes('npm ci') ||
                                  dockerfileContent.includes('--omit=dev');
      expect(hasOptimizedInstall).toBe(true);
    });
  });

  describe('Source Code Handling', () => {
    it('should copy all source files after dependency installation', () => {
      if (!dockerfileContent) return;
      
      const npmInstallIndex = dockerfileContent.indexOf('npm install');
      const srcCopyIndex = dockerfileContent.indexOf('src');
      
      if (npmInstallIndex !== -1 && srcCopyIndex !== -1) {
        expect(npmInstallIndex).toBeLessThan(srcCopyIndex);
      }
    });

    it('should copy the entire application directory', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('COPY . /app');
    });
  });

  describe('Build Artifacts', () => {
    it('should build TypeScript before production image', () => {
      if (!dockerfileContent) return;
      
      const hasBuildStep = dockerfileContent.includes('npm run build') ||
                           dockerfileContent.includes('tsc');
      expect(hasBuildStep).toBe(true);
    });

    it('should run build after source copy but before final image', () => {
      if (!dockerfileContent) return;
      
      const srcIndex = dockerfileContent.indexOf('src');
      const buildIndex = dockerfileContent.indexOf('build');
      
      if (srcIndex !== -1 && buildIndex !== -1) {
        expect(srcIndex).toBeLessThan(buildIndex);
      }
    });
  });

  describe('Exposed Port', () => {
    it('should expose port 3000', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('EXPOSE 3000');
    });
  });

  describe('Health Check', () => {
    it('should include HEALTHCHECK instruction', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('HEALTHCHECK');
    });

    it('should check health endpoint', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('/health');
    });

    it('should set reasonable health check interval', () => {
      if (!dockerfileContent) return;
      
      const healthCheckIntervalPattern = /--interval=\d+s/;
      expect(dockerfileContent).toMatch(healthCheckIntervalPattern);
    });

    it('should set reasonable health check timeout', () => {
      if (!dockerfileContent) return;
      
      const healthCheckTimeoutPattern = /--timeout=\d+s/;
      expect(dockerfileContent).toMatch(healthCheckTimeoutPattern);
    });

    it('should set reasonable health check retries', () => {
      if (!dockerfileContent) return;
      
      const healthCheckRetriesPattern = /--retries=\d+/;
      expect(dockerfileContent).toMatch(healthCheckRetriesPattern);
    });
  });

  describe('User and Permissions', () => {
    it('should not run as root for security', () => {
      if (!dockerfileContent) return;
      
      const hasNonRootUser = dockerfileContent.includes('USER node') ||
                             dockerfileContent.includes('USER app');
      expect(hasNonRootUser).toBe(true);
    });
  });

  describe('Entrypoint', () => {
    it('should have CMD or ENTRYPOINT instruction', () => {
      if (!dockerfileContent) return;
      
      const hasEntrypoint = dockerfileContent.includes('ENTRYPOINT') ||
                            dockerfileContent.includes('CMD');
      expect(hasEntrypoint).toBe(true);
    });

    it('should start node server', () => {
      if (!dockerfileContent) return;
      
      expect(dockerfileContent).toContain('node');
    });
  });

  describe('Security Best Practices', () => {
    it('should use .dockerignore file', () => {
      const dockerignorePath = path.join(__dirname, '.dockerignore');
      expect(fs.existsSync(dockerignorePath)).toBe(true);
    });

    it('should exclude node_modules from Docker image', () => {
      const dockerignorePath = path.join(__dirname, '.dockerignore');
      
      if (fs.existsSync(dockerignorePath)) {
        const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf-8');
        expect(dockerignoreContent).toContain('node_modules');
      }
    });

    it('should exclude .git directory', () => {
      const dockerignorePath = path.join(__dirname, '.dockerignore');
      
      if (fs.existsSync(dockerignorePath)) {
        const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf-8');
        expect(dockerignoreContent).toContain('.git');
      }
    });

    it('should exclude environment files from production image', () => {
      const dockerignorePath = path.join(__dirname, '.dockerignore');
      
      if (fs.existsSync(dockerignorePath)) {
        const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf-8');
        expect(dockerignoreContent).toContain('.env');
      }
    });
  });

  describe('Multi-stage Build (Optional)', () => {
    it('should consider multi-stage build for smaller image size', () => {
      if (!dockerfileContent) return;
      
      const hasMultiStage = dockerfileContent.includes('FROM') &&
                            dockerfileContent.split('FROM').length > 2;
      
      // Multi-stage is optional but recommended
      // If not present, still valid as long as base image is alpine/slim
      if (!hasMultiStage) {
        const isSmallBase = dockerfileContent.includes('alpine') ||
                            dockerfileContent.includes('slim');
        expect(isSmallBase).toBe(true);
      }
    });
  });

  describe('Dockerfile Syntax', () => {
    it('should be valid Dockerfile syntax', () => {
      if (!dockerfileContent) return;
      
      // Basic syntax checks
      expect(dockerfileContent.trim().length).toBeGreaterThan(0);
      expect(dockerfileContent).toMatch(/^FROM/m);
    });

    it('should not have RUN commands with apt-get update without cache cleanup', () => {
      if (!dockerfileContent) return;
      
      // Check for proper cleanup patterns
      if (dockerfileContent.includes('apt-get update')) {
        expect(dockerfileContent).toContain('apt-get clean');
        expect(dockerfileContent).toContain('rm -rf /var/lib/apt/lists/*');
      }
    });
  });
});
