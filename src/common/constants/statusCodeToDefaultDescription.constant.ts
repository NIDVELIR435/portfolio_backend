import { StatusCodes } from 'http-status-codes';

export const statusCodeToDefaultDescription = {
  [`${StatusCodes.OK}`]: 'Successful get response',
  [`${StatusCodes.CREATED}`]: 'Successful create response',
  [`${StatusCodes.CONFLICT}`]: 'Conflict',
  [`${StatusCodes.NOT_FOUND}`]: 'Record not found',
} as const;
