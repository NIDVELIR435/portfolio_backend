import { StatusCodes } from 'http-status-codes';

export const allowsStatusCodeNumber =
  StatusCodes.OK |
  StatusCodes.CREATED |
  StatusCodes.NOT_FOUND |
  StatusCodes.CONFLICT;
