import { isNil } from 'lodash';
import { statusCodeToDefaultDescription } from './statusCodeToDefaultDescription.constant';

export const getResponse = (
  status: string,
  description?: string,
  type?: { new (): unknown },
  isArray: boolean = false,
) =>
  !isNil(type)
    ? {
        status: Number(status),
        type,
        isArray,
        description: !isNil(description)
          ? description
          : statusCodeToDefaultDescription[status]!,
      }
    : {
        status: Number(status),
        isArray,
        description: !isNil(description)
          ? description
          : statusCodeToDefaultDescription[status]!,
      };
