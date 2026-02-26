/**
 * Unit tests for API response helpers.
 */

import { describe, it, expect } from "vitest";
import { successResponse, errorResponse, paginatedResponse, parsePagination, buildPaginationMeta } from "@/lib/api/response";

describe("successResponse", () => {
  it("returns a Response with success=true and data", async () => {
    const res = successResponse({ foo: "bar" });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ success: true, data: { foo: "bar" } });
  });

  it("supports custom status codes", async () => {
    const res = successResponse({ id: 1 }, 201);
    expect(res.status).toBe(201);
  });
});

describe("errorResponse", () => {
  it("returns a Response with success=false and error details", async () => {
    const res = errorResponse("Not found", "NOT_FOUND", 404);
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toEqual({
      success: false,
      error: {
        message: "Not found",
        code: "NOT_FOUND",
      },
    });
  });

  it("includes validation details when provided", async () => {
    const res = errorResponse("Validation error", "VALIDATION_ERROR", 400, {
      email: ["Required"],
    });

    const body = await res.json();
    expect(body.error.details).toEqual({ email: ["Required"] });
  });
});

describe("paginatedResponse", () => {
  it("returns paginated data with metadata", async () => {
    const meta = { page: 1, perPage: 10, total: 25, totalPages: 3, hasNext: true, hasPrev: false };
    const res = paginatedResponse([{ id: 1 }, { id: 2 }], meta);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);
    expect(body.pagination).toEqual(meta);
  });
});

describe("parsePagination", () => {
  it("parses page and perPage from URLSearchParams", () => {
    const params = new URLSearchParams("page=3&perPage=50");
    const result = parsePagination(params);
    expect(result).toEqual({ page: 3, perPage: 50, skip: 100 });
  });

  it("uses defaults when not provided", () => {
    const params = new URLSearchParams();
    const result = parsePagination(params);
    expect(result).toEqual({ page: 1, perPage: 20, skip: 0 });
  });

  it("clamps perPage to max 100", () => {
    const params = new URLSearchParams("perPage=999");
    const result = parsePagination(params);
    expect(result.perPage).toBe(100);
  });
});

describe("buildPaginationMeta", () => {
  it("calculates pagination metadata correctly", () => {
    const meta = buildPaginationMeta(1, 10, 25);
    expect(meta).toEqual({
      page: 1,
      perPage: 10,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });
  });

  it("handles last page", () => {
    const meta = buildPaginationMeta(3, 10, 25);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
  });

  it("handles empty results", () => {
    const meta = buildPaginationMeta(1, 10, 0);
    expect(meta.totalPages).toBe(0);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(false);
  });
});
