/**
 * Unit tests for client-side API response parsing helpers.
 */

import { describe, it, expect, vi } from "vitest";
import { parseApiResponse, parsePaginatedResponse } from "@/lib/api/client";

function mockResponse(body: unknown, status = 200): Response {
  return {
    json: vi.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  } as unknown as Response;
}

describe("parseApiResponse", () => {
  it("parses a successful response", async () => {
    const res = mockResponse({ success: true, data: { id: "1", name: "Test" } });
    const result = await parseApiResponse<{ id: string; name: string }>(res);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ id: "1", name: "Test" });
    }
  });

  it("parses an error response", async () => {
    const res = mockResponse({
      success: false,
      error: { message: "Not found", code: "NOT_FOUND" },
    }, 404);

    const result = await parseApiResponse<unknown>(res);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Not found");
    }
  });

  it("handles unexpected response format", async () => {
    const res = mockResponse("not json object");
    const result = await parseApiResponse<unknown>(res);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Unexpected response format");
    }
  });
});

describe("parsePaginatedResponse", () => {
  it("parses paginated data with metadata", async () => {
    const pagination = {
      page: 1, perPage: 10, total: 50, totalPages: 5, hasNext: true, hasPrev: false,
    };

    const res = mockResponse({
      success: true,
      data: [{ id: "1" }, { id: "2" }],
      pagination,
    });

    const result = await parsePaginatedResponse<{ id: string }>(res);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual(pagination);
    }
  });

  it("parses error from paginated endpoint", async () => {
    const res = mockResponse({
      success: false,
      error: { message: "Forbidden", code: "FORBIDDEN" },
    }, 403);

    const result = await parsePaginatedResponse<unknown>(res);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Forbidden");
    }
  });
});
