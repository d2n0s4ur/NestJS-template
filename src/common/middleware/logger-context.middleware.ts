import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = req.get('user-agent') || '';
    const token = headers.authorization || '';
    const payload = this.jwtService.decode(token.replace('Bearer ', '')) as any;
    const userId = payload ? payload.id : null;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      // TODO: log to DB
      const logFormat = `[${method}] ${originalUrl} USER-${userId} ${statusCode} ${contentLength} - ${ip} ${userAgent}`;

      this.logger.http(logFormat);
    });

    next();
  }
}
