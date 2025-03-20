import { Request, Response } from "express";
import { isErrorWithCode } from "./actions/errors";

/**
 * Handles errors thrown and returns the code in the response if any.
 */
export const withErrorHandle = <Result>(
  handler: (req: Request, res: Response) => Promise<Result>
) => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleActionError(error, res);
    }
  };
};

/**
 * Handles errors thrown by server actions.
 */
export function handleActionError(error: unknown, res: Response) {
  if (isErrorWithCode(error)) {
    console.error(error.message);

    return res.status(500).json({
      errorCode: error.code,
    });
  }

  return res.status(500).json({
    errorCode: "UNNKOWN",
  });
}
