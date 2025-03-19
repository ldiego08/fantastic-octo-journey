export type ActionResult<Data> =
  | {
      success: true;
      data: Data;
    }
  | {
      success: false;
      error: string;
      errorCode: string;
    };
