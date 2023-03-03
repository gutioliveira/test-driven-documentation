import { Request, Response, NextFunction } from 'express';
import { parseUrl } from '../helpers';
import { ParsedTest, Test } from '../types';

const addTestResponse = (test: Test): void => {
  const { url, query, params, fullUrl } = parseUrl(test.req);
  const obj: ParsedTest = {
    test: {
      req: {
        headers: test.req.headers,
        method: test.req.method,
        body: test.req.body,
        query,
        url,
        params,
        fullUrl
      },
      res: {
        statusCode: test.res.statusCode,
        body: test.body,
      },
    },
    description: '',
    tag: '',
  };
  tests.push(obj);
};

export const docMiddleware = (shouldDocumentate: boolean) => (req: Request, res: Response, next: NextFunction) => {
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