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
    // checking if authorization header exists. procced with code
    //  execution if it does, throw an error if it does not and
    // terminate the request
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'authentication token missing or expired',
      );
    }
    // parsing out the token from the req header
    const token = authHeader.split(' ')[1]; //
    // checking if token exists
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // attaching the token to the request for later use
    req['access_token'] = token;

    next();
  }
}
