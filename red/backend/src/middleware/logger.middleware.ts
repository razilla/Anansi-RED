// File: src/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const authToken = req.headers['authorization'] || 'No Authorization Header';

    // Log the token from Authorization header
    this.logger.log(`Method: ${method}, URL: ${originalUrl}, Token: ${authToken}`);

    const start = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - start;
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${responseTime}ms`);
    });

    next();
  }
}
