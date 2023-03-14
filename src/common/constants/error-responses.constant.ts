import { StatusCodes } from 'http-status-codes';
import { ErrorExceptionDto } from '../dtos/error-exception.dto';
import { statusCodeToDefaultDescription } from './statusCodeToDefaultDescription.constant';

export const errorsResponses = {
  [StatusCodes.CONFLICT]: {
    type: ErrorExceptionDto,
    isArray: false,
    description: statusCodeToDefaultDescription[StatusCodes.CONFLICT],
  },
  [StatusCodes.NOT_FOUND]: {
    type: ErrorExceptionDto,
    isArray: false,
    description: statusCodeToDefaultDescription[StatusCodes.NOT_FOUND],
  },
} as const;
