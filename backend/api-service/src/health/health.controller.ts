import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; service: string; version: string } {
    return {
      status: 'ok',
      service: 'api-service',
      version: '1.0.0',
    };
  }
}