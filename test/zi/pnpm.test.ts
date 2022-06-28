import { parseZi } from "./../../src/parse";
import { expect, test } from "vitest";
const agent = "pnpm";

const help = (arg: string, expected: string) => () => {
  expect(parseZi(agent, arg.split(" ").filter(Boolean))).toBe(expected);
};

test("empty", help("", "pnpm i"));

test("single add", help("axios", "pnpm add axios"));

test("multiple", help("eslint @types/node", "pnpm add eslint @types/node"));

test("-D", help("-D eslint @types/node", "pnpm add -D eslint @types/node"));

test("global", help("eslint -g", "pnpm add -g eslint"));

test("frozen", help("--frozen", "pnpm i --frozen-lockfile"));

test("forward1", help("--anything", "pnpm i --anything"));
test("forward2", help("-a", "pnpm i -a"));
