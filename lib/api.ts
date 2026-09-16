import { CONFIG, isConfigured } from "./config";

export interface Approval {
  id: string;
  source: string; // which agent produced this (e.g. "resolvd")
  title: string;
  detail: string;
  proposedAction: string;
  reason: string | null;
  createdAt: string;
}

// Pending approvals = escalations across the agent suite. Greenlite reads them
// from each agent's own server-side API (never a database directly), so the app
// carries no DB credentials. Today that source is Resolvd's /api/approvals.
export async function fetchApprovals(): Promise<Approval[]> {
  if (!isConfigured()) return SAMPLE;
  try {
    const res = await fetch(`${CONFIG.resolvdUrl}/api/approvals`, {
      headers: { "x-resolvd-token": CONFIG.resolvdToken },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { approvals?: Approval[] };
    return json.approvals ?? [];
  } catch {
    return [];
  }
}

// Approve or deny, routes back to the originating agent's approve endpoint.
export async function decide(
  approval: Approval,
  approve: boolean,
): Promise<boolean> {
  if (!approval.id) return false; // empty id would be a meaningless POST
  if (!isConfigured()) return true; // demo mode
  try {
    const res = await fetch(`${CONFIG.resolvdUrl}/api/approve`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-resolvd-token": CONFIG.resolvdToken,
      },
      body: JSON.stringify({ id: approval.id, approve }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const SAMPLE: Approval[] = [
  {
    id: "sample-1",
    source: "resolvd",
    title: "Refund request",
    detail: "I want a $900 refund now, the order never arrived.",
    proposedAction: "Approve refund of $900",
    reason: "refund $900 exceeds auto-limit $50",
    createdAt: "2026-06-08T09:00:00Z",
  },
  {
    id: "sample-2",
    source: "resolvd",
    title: "Angry customer",
    detail: "This is the worst service ever, I am furious.",
    proposedAction: "Personal apology + offer remedy",
    reason: "negative sentiment at high urgency",
    createdAt: "2026-06-08T08:30:00Z",
  },
];
