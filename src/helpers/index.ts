import { Request } from 'express';

export const parseUrl = (req: Request) => {
  let url: string, query;
  let fullUrl = req.originalUrl;

  const params = req.params;

  if (Object.keys(req.query || {}).length) {
    query = req.query;
  }

  url = req.originalUrl;

  const paramsKeys = Object.keys(params);

  if (paramsKeys.length > 0) {
    paramsKeys.forEach((key) => {
      url = url.replace(params[key], `{${key}}`);
    });
  }

  if (query) {
    url = url.split('?')[0];
  }

  return { url, query, params, fullUrl };
};

export const getTag = (testPath: string): string => {
  const pathSplited = testPath.split('/');
  return pathSplited[pathSplited.length - 1].split('.')[0];
};