import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Log, LogDocument } from '../logger.schema';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@InjectModel('logs') private logModel: Model<LogDocument>) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const log = new this.logModel({
      method: req.method,
      request: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    });

    try {
      await log.save();
    } catch (err) {
      console.log(err);
    }

    console.log(
      `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
    );
    next();
  }
}
