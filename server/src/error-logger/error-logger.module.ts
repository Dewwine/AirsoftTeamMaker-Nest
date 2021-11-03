import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorLogSchema } from './error-logger.schema';
import { AllExceptionsFilter } from './errorHandler';
// import { ErrorLoggerMiddleware } from './middleware/error-logger.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'errors', schema: ErrorLogSchema }]),
  ],
})
export class ErrorLoggerModule {}
// export class ErrorLoggerModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ErrorLoggerMiddleware).forRoutes('*');
//   }
// }
