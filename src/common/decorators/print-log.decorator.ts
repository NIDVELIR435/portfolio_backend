import { Logger } from '@nestjs/common';
import { toJSON } from 'flatted';

type LogConfig = {
  excludeArg?: boolean;
};

/**
 * @function prints log in console via logger
 * @param {boolean=} [logConfig.excludeArg=false] - exclude all method arguments
 * @example
 * [Nest]125174 - 05/05/2022,11:05:57PM DEBUG [ClassName#MethodName] Call with args: [{some args}]
 */
export const PrintLog =
  (logConfig?: LogConfig): MethodDecorator =>
  (
    target: Object | Function,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const excludeArg = logConfig?.excludeArg ?? false;
    // @ts-expect-error
    const className = target.name;
    const originalMethod = descriptor.value;
    descriptor.value = new Proxy(originalMethod, {
      apply: (target, thisArg, args) => {
        Logger.debug(
          excludeArg ? 'Hide args.' : `Call with args: ${toJSON(args)}`,
          `${className}#${String(propertyKey)}`,
        );
        return Reflect.apply(target, thisArg, args);
      },
    });
  };
