import { Request, Response } from 'express';

export interface Test {
  req: Request,
  res: Response,
  body: string,
}

export interface ParsedTest {
  test: {
    req: {
      headers: { [k: string]: any },
      method: string,
      body: string,
      query: { [k: string]: any },
      url: { [k: string]: any },
      params: { [k: string]: any },
    },
    res: {
      statusCode: number,
      body: string,
    },
  },
  description: string,
  tag: string,
}