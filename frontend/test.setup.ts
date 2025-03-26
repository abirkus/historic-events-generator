import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/dom";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

/* 
 By assigning vi to global.jest, we make Vitest's mocking functions available under the jest namespace, 
 which can be useful for compatibility with existing test suites or libraries that rely on Jest's mocking API
 as well as dom assertion and RTL
*/
// @ts-expect-error: Assign Vitest's mocking functions to global.jest. Missing properties
global.jest = vi;

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

afterEach(() => {
  cleanup();
});
