import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./config", () => ({
  isConfigured: vi.fn(() => true),
  CONFIG: { resolvdUrl: "https://resolvd.test", resolvdToken: "tok" },
}));

import { fetchApprovals, type Approval } from "./api";

const GOOD: Approval = {
  id: "a1",
  source: "resolvd",
  title: "Refund",
  detail: "…",
  proposedAction: "…",
  reason: null,
  createdAt: "2026-06-08T09:00:00Z",
};

describe("fetchApprovals", () => {
  afterEach(() => vi.restoreAllMocks());

  it("drops malformed approval items", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ approvals: [{ id: null }, { title: 1 }] })),
    );
    expect(await fetchApprovals()).toEqual([]);
  });

  it("keeps well-formed approval items", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ approvals: [GOOD, { id: null }] })),
    );
    expect(await fetchApprovals()).toEqual([GOOD]);
  });
});