import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./config", () => ({
  isConfigured: vi.fn(() => true),
  CONFIG: { resolvdUrl: "https://resolvd.test", resolvdToken: "tok" },
}));

import { decide, type Approval } from "./api";

const BAD: Approval = {
  id: "",
  source: "resolvd",
  title: "x",
  detail: "",
  proposedAction: "",
  reason: null,
  createdAt: "",
};

describe("decide", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns false for an empty id without calling fetch", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(await decide(BAD, true)).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});