import { Injectable, NestMiddleware, Request, Response } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: IncomingMessage, res: ServerResponse, next: () => void): any {
    res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE');
    res.statusCode = 200;

    next();
  }
}
