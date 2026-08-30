export class AppError extends Error {
  status: number
  code: string

  constructor(message: string, status = 400, code = "BAD_REQUEST") {
    super(message)
    this.name = "AppError"
    this.status = status
    this.code = code
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT")
    this.name = "ConflictError"
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 422, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be signed in to perform this action.") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to perform this action.") {
    super(message, 403, "FORBIDDEN")
    this.name = "ForbiddenError"
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
