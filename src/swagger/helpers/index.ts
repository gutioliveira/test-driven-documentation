import { ParsedTest } from "../../types";

const getParameters = ({query, params, headers}: any) => {
  const parameters: Array<any> = [];
  Object.keys(query || {}).forEach((key) => {
    parameters.push({
      name: key,
      in: 'query',
      required: false,
      schema: {
        type: 'string',
      },
    });
  });
  Object.keys(params || {}).forEach((key) => {
    parameters.push({
      name: key,
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    });
  });
  Object.keys(headers || {})
    .filter((key) => {
      const shouldFilter: any = {
        'accept-encoding': true,
        host: true,
        connection: true,
        'content-type': true,
        'content-length': true,
      };
      return !shouldFilter[key];
    })
    .forEach((key) => {
      parameters.push({
        name: key,
        in: 'headers',
        required: true,
        schema: {
          type: 'string',
        },
      });
    });
  return parameters;
};

const navigateObject = (body: any): any => {
  const object: any = {};
  Object.keys(body).forEach((key) => {
    if (Array.isArray(body[key])) {
      object[key] = defineObject(body[key]);
    } else if (typeof body[key] === 'object') {
      object[key] = {
        properties: navigateObject(body[key]),
      };
    } else {
      object[key] = { type: typeof body[key] };
    }
  });
  return object;
};

const navigateArray = (arr: any): any => {
  return arr.map((item: any) => {
    return defineObject(item);
  });
};

const addPath = (doc: ParsedTest, config: any) => ({
  tags: [doc.tag],
  description: doc.description,
  parameters: getParameters(
    {
      query: doc.test.req.query,
      params: doc.test.req.params,
      headers: doc.test.req.headers
    }
  ),
  ...(Object.keys(doc.test.req.body).length > 0
    ? {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: defineObject(doc.test.req.body),
            },
          },
        },
      }
    : {}),
  responses: {
    [doc.test.res.statusCode]: {
      content: {
        'application/json': {
          schema: defineObject(JSON.parse(doc.test.res.body)),
        },
      },
    },
  },
});

const defineObject = (body: any): any => {
  if (typeof body === 'object' && !body) {
    return { type: null };
  }
  if (!Array.isArray(body) && typeof body === 'object') {
    return {
      type: 'object',
      properties: navigateObject(body),
    };
  }
  if (Array.isArray(body)) {
    return {
      type: 'array',
      items: {
        anyOf: navigateArray(body),
      },
    };
  }
  return { type: typeof body };
};

const getConfig = (doc: ParsedTest): any => {
  const configObject: any = {
    showQueryParamsUrl: 'true'
  };
  try {
    const splited = doc.description.split('@docs');
    // test name @docs showQueryParams=false
    const config = splited[1].trim();
    doc.description = splited[0];
    if (config) {
      const params = config.split(' ');
      params.forEach((param) => {
        const [key, value] = param.split('=');
        configObject[key] = value;
      });
      return configObject;
    }
  } catch (e) {
    return configObject;
  }
};

const getUrl = (doc: ParsedTest, config: any) => {
  if (config.showQueryParamsUrl === 'true') {
    return doc.test.req.fullUrl;
  } else {
    return doc.test.req.url;
  }
};

export const manipulateSwagger = (swagger: any, doc: ParsedTest): void => {
  const config = getConfig(doc);
  const url = getUrl(doc, config);
  if (swagger.paths[url]) {
    if (
      !swagger.paths[url][doc.test.req.method.toLowerCase()]
    ) {
      swagger.paths[url][doc.test.req.method.toLowerCase()] =
        addPath(doc, config);
    }
  } else {
    swagger.paths[url] = {
      [doc.test.req.method.toLowerCase()]: addPath(doc, config),
    };
  }
}