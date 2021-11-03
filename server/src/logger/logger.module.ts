import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './logger.schema';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'logs', schema: LogSchema }])],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
