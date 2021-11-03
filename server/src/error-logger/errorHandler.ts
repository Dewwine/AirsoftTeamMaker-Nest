import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Scope,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLogDocument } from './error-logger.schema';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  // constructor(@InjectModel('errors') private errorLogModel: Model<ErrorLogDocument>) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string =
      exception instanceof HttpException
        ? exception.message
        : 'INTERNAL SERVER ERROR';

    console.log({
      statusCode: status,
      path: request.url,
      message,
    });

    // const log = new this.errorLogModel({
    //   method: req.method,
    //   request: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    // });

    // try {
    //   await log.save();
    // } catch (err) {
    //   console.log(err);
    // }
  }
}
