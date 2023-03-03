import * as fs from 'fs';
import { getTag, parseUrl } from "./parsers";
import { ParsedTest, Test } from "./types";

const tests: Array<ParsedTest> = [];

export const addTestDescription = (state: Record<string, any>): void => {
  if (!tests[tests.length - 1].description) {
    tests[tests.length - 1].description = state.currentTestName;
    tests[tests.length - 1].tag = getTag(state.testPath);
  }
};

export const addTestResponse = (test: Test): void => {
  const { url, query, params } = parseUrl(test.req);
    const obj: ParsedTest = {
      test: {
        req: {
          headers: test.req.headers,
          method: test.req.method,
          body: test.req.body,
          query,
          url,
          params,
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

export const afterAll = () => {
  try {
    const info = fs.readFileSync('docs.json', 'utf8');
    const data = JSON.parse(info);
    fs.writeFileSync(
      'docs.json',
      JSON.stringify(data.swagger ? tests : [...data, ...tests])
    );
  } catch (e) {
    fs.writeFileSync('docs.json', JSON.stringify(tests));
  }
};

export const generateSwaggerDocs = (): string => {
  fs.writeFileSync('docs.json', JSON.stringify({ swagger: true }));
  return '';
};