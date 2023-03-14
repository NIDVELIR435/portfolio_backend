import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { defaults } from 'lodash';
import { ApiResponsesType } from './api-responses.type';
import { errorsResponses } from '../constants/error-responses.constant';
import { getResponse } from '../constants/get-response.constant';

export const ApiResponses = (responses: ApiResponsesType) => {
  const apiResponses = Object.entries(defaults(responses, errorsResponses)).map(
    ([status, { description, type, isArray }]) =>
      ApiResponse(getResponse(status, description, type, isArray)),
  );
  return applyDecorators(...apiResponses);
};
