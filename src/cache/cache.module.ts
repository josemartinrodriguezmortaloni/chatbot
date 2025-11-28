import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisService } from './redis.service';

@Module({
  providers: [CacheService, RedisService]
})
export class CacheModule {}
