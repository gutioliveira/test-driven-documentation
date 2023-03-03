import { Request, Response, NextFunction } from 'express';
import { addTestResponse } from '../test-setup';

export const docGenerator = (shouldDocumentate: boolean) => (req: Request, res: Response, next: NextFunction) => {
  if (shouldDocumentate) {
    const send = res.send;
    res.send = (c: object) => {
      res.send = send;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        addTestResponse({ req, res, body: JSON.stringify(c) });
      }
      return res.send(c);
    };
  }
  next();
};