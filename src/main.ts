import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { z } from 'zod';
import { RedisClientType, createClient } from 'redis';
const logger = new Logger('Main');
export const RedisClientOn: RedisClientType = createClient({
  url: process?.env?.REDIS_URL
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process?.env?.REDIS_URL) {
    RedisClientOn.on('error', (err) => console.log('Redis client Error', err));
    await RedisClientOn.connect().then(() => { logger.debug('Connection Started with Redis') });
  }
  await app.listen(3000);
}
bootstrap();
