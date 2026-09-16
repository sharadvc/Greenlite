import { describe, expect, it } from "vitest";

import { relativeTime } from "./time";

describe("relativeTime", () => {
  it("renders minutes for recent timestamps", () => {
    const result = relativeTime(new Date(Date.now() - 5 * 60000).toISOString());
    expect(result).toMatch(/^5m ago$/);
  });

  it("falls back to 'recently' for invalid createdAt", () => {
    expect(relativeTime("garbage")).toBe("recently");
    expect(relativeTime("")).toBe("recently");
  });
});