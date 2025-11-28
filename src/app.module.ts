import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [DatabaseModule, CacheModule, AuthModule, HealthModule, AgentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
