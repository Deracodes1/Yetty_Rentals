import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const now = new Date();
    const formattedTime = now.toISOString();
    const apiRequestDetails = {
      time: formattedTime,
      method: req.method,
      url: req.url,
    };
    console.log(`A request just hit our Api`, apiRequestDetails);
    next();
  }
}
