import { NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

export class AsyncRequestHeaderMiddleware implements NestMiddleware {
  use(req: IncomingMessage, res: ServerResponse, next: () => void): any {
    let accessControlHeaders = res.getHeader('Access-Control-Allow-Headers');
    accessControlHeaders += ', Async-Request';
    res.setHeader('Access-Control-Allow-Headers', accessControlHeaders);

    next();
  }
}
