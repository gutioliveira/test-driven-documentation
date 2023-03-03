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
      url: string,
      params: { [k: string]: any },
      fullUrl: string,
    },
    res: {
      statusCode: number,
      body: string,
    },
  },
  description: string,
  tag: string,
}