import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // 1. Unified check: Must exist, start with Bearer, and have a non-empty string after it
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authentication token missing or invalid format',
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // 2. Attach for the next layers (Guards/Controllers)
    req['access_token'] = token;
    next();
  }
}
