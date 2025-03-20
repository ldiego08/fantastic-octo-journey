import { MAX_BOARD_DEPTH } from "./consts";

export class ErrorWithCode extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

export function isErrorWithCode(error: any): error is ErrorWithCode {
  return "code" in error;
}

export class BoardNotFoundError extends ErrorWithCode {
  constructor(public readonly boardId: number) {
    super(`Board ${boardId} was not found`, "BOARD_NOT_FOUND");
  }
}

export class BoardParentNotFoundError extends ErrorWithCode {
  constructor(public readonly boardId: number) {
    super(`Parent board ${boardId} was not found`, "BOARD_PARENT_NOT_FOUND");
  }
}

export class BoardMaxDepthExceededError extends ErrorWithCode {
  constructor() {
    super(
      `Maximum depth of ${MAX_BOARD_DEPTH} exceeded`,
      "BOARD_MAX_DEPTH_EXCEEDED"
    );
  }
}

export class UnknownError extends ErrorWithCode {
  constructor(public readonly innerError: any) {
    super(
      `Unknown error occurred${
        "message" in innerError ? `: ${innerError.message}` : ""
      }`,
      "UNKNOWN"
    );
  }
}
