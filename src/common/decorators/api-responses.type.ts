import { StatusCodes } from 'http-status-codes';

export const allowsStatusCodeNumber =
  StatusCodes.OK |
  StatusCodes.CREATED |
  StatusCodes.NOT_FOUND |
  StatusCodes.CONFLICT;

export type ApiResponsesType = {
  [Key in typeof allowsStatusCodeNumber]: {
    description?: string;
    type?: { new (): unknown };
    isArray?: boolean;
  };
};
