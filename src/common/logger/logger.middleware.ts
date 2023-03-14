import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, body, params, query } = request;
      const { statusCode, statusMessage } = response;

      if (statusCode >= 500) {
        const requestParams = JSON.stringify({
          body,
          params,
          query,
        });

        const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}. Params: ${requestParams}`;

        return this.logger.error(message);
      }
    });

    next();
  }
}
