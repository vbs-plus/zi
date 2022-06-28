import { parseZi } from "./../../src/parse";
import { expect, test } from "vitest";
const agent = "npm";

const help = (arg: string, expected: string) => () => {
  expect(parseZi(agent, arg.split(" ").filter(Boolean))).toBe(expected);
};

test("empty", help("", "npm i"));

test("single add", help("axios", "npm i axios"));

test("multiple", help("eslint @types/node", "npm i eslint @types/node"));

test("-D", help("eslint @types/node -D", "npm i eslint @types/node -D"));

test("global", help("eslint -g", "npm i -g eslint"));

test("frozen", help("--frozen", "npm ci"));
