import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  isAppError,
} from "@/lib/errors";

describe("AppError", () => {
  it("creates error with default values", () => {
    const error = new AppError("test message");
    expect(error.message).toBe("test message");
    expect(error.status).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.name).toBe("AppError");
  });

  it("creates error with custom status and code", () => {
    const error = new AppError("custom", 422, "CUSTOM_CODE");
    expect(error.status).toBe(422);
    expect(error.code).toBe("CUSTOM_CODE");
  });
});

describe("NotFoundError", () => {
  it("has 404 status", () => {
    const error = new NotFoundError();
    expect(error.status).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.name).toBe("NotFoundError");
  });

  it("accepts custom message", () => {
    const error = new NotFoundError("User not found");
    expect(error.message).toBe("User not found");
  });
});

describe("ConflictError", () => {
  it("has 409 status", () => {
    const error = new ConflictError();
    expect(error.status).toBe(409);
    expect(error.code).toBe("CONFLICT");
  });
});

describe("ValidationError", () => {
  it("has 422 status", () => {
    const error = new ValidationError();
    expect(error.status).toBe(422);
    expect(error.code).toBe("VALIDATION_ERROR");
  });
});

describe("UnauthorizedError", () => {
  it("has 401 status", () => {
    const error = new UnauthorizedError();
    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
  });
});

describe("ForbiddenError", () => {
  it("has 403 status", () => {
    const error = new ForbiddenError();
    expect(error.status).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });
});

describe("isAppError", () => {
  it("returns true for AppError instances", () => {
    expect(isAppError(new AppError("test"))).toBe(true);
    expect(isAppError(new NotFoundError())).toBe(true);
  });

  it("returns false for non-AppError", () => {
    expect(isAppError(new Error("test"))).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError("string")).toBe(false);
  });
});
