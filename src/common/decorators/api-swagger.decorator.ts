import {
  ApiOperation,
  ApiOperationOptions,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { defaults, isNil } from 'lodash';
import { ApiResponsesType } from './api-responses.type';
import { errorsResponses } from '../constants/error-responses.constant';
import { getResponse } from '../constants/get-response.constant';

type ApiDescribe = {
  apiOperation?: Omit<ApiOperationOptions, 'responses'>;
  apiResponses?: ApiResponsesType;
};

export const ApiSwagger = (describe: ApiDescribe) => {
  const apiResponses = Object.entries(
    defaults(describe.apiResponses, errorsResponses),
  ).map(([status, { description, type, isArray }]) =>
    ApiResponse(getResponse(status, description, type, isArray)),
  );

  const customApiOperation = !isNil(describe.apiOperation)
    ? ApiOperation(describe.apiOperation)
    : ApiOperation({});

  return applyDecorators(...apiResponses, customApiOperation);
};
