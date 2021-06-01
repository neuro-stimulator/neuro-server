import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(HttpLoggerMiddleware.name);

  use(req: any, _res: any, next: () => void): void {
    const { body, params, query } = req;
    const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const start = Date.now();

    this.logger.verbose('---------------------------------------------------------------------------------');
    this.logger.verbose(`request method: ${req.method}`);
    this.logger.verbose(`request url: ${requestUrl}`);
    this.logger.verbose(`request body: ${JSON.stringify(body)}`);
    this.logger.verbose(`request query: ${JSON.stringify(query)}`);
    this.logger.verbose(`request params: ${JSON.stringify(params)}`);
    this.logger.verbose('---------------------------------------------------------------------------------');
    _res.on('finish', () => {
      const delta = Date.now() - start;
      this.logger.verbose(`request time: ${delta} ms`);
      this.logger.verbose('=================================================================================');
    });
    next();
  }
}
