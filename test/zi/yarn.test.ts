import { parseZi } from "./../../src/parse";
import { expect, test } from "vitest";

const agent = "yarn";

const help = (arg: string, expected: string) => () => {
  expect(parseZi(agent, arg.split(" ").filter(Boolean))).toBe(expected);
};

test("empty", help("", "yarn install"));

test("single add", help("axios", "yarn add axios"));

test("multiple", help("eslint @types/node", "yarn add eslint @types/node"));

test("-D", help("eslint @types/node -D", "yarn add eslint @types/node -D"));

test("global", help("eslint ni -g", "yarn global add eslint ni"));

test("frozen", help("--frozen", "yarn install --frozen-lockfile"));
