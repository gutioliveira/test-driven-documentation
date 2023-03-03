import { Request } from 'express';

export const parseUrl = (req: Request) => {
  const url = {};
  const query = {};
  const params = {};
  return { url, query, params };
};

export const getTag = (testPath: string): string => {
  const pathSplited = testPath.split('/');
  return pathSplited[pathSplited.length - 1].split('.')[0];
};