import * as fs from 'fs';
import { getTag } from "../helpers";

const afterEach = (state: Record<string, any>): void => {
  try {
    if (!tests[tests.length - 1].description) {
      tests[tests.length - 1].description = state.currentTestName;
      tests[tests.length - 1].tag = getTag(state.testPath);
    }
  } catch (e) {
  }
};

const afterAll = (path: string) => {
  try {
    const info = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(info);
    fs.writeFileSync(
      path,
      JSON.stringify(!Array.isArray(data) ? tests : [...data, ...tests])
    );
  } catch (e) {
    fs.writeFileSync(path, JSON.stringify(tests));
  }
};

export const testSetup = {
  afterEach,
  afterAll
};
 