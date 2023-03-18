import { isFunction } from 'lodash';

const copyMetadata = (from: any, to: any) => {
  const metadataKeys = Reflect.getMetadataKeys(from);
  metadataKeys.forEach((key) => {
    const value = Reflect.getMetadata(key, from);
    Reflect.defineMetadata(key, value, to);
  });
};

/* Hangs decorator/decorators for all methods
 * @example
 * _ @DecorateAll([someMethodDecorator()])
 * _ export class Example {}
 * */
export const DecorateAll =
  (
    decoratorArray: MethodDecorator[],
    options: {
      deep?: boolean;
      exclude?: string[];
      excludePrefix?: string;
    } = {},
  ): ClassDecorator =>
  (target) => {
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    if (options.deep) {
      let base = Object.getPrototypeOf(target);
      while (base.prototype) {
        const baseDescriptors = Object.getOwnPropertyDescriptors(
          base.prototype,
        );
        descriptors = { ...baseDescriptors, ...descriptors };
        base = Object.getPrototypeOf(base);
      }
    }

    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        isFunction(descriptor.value) && propName !== 'constructor';
      if (options.exclude?.includes(propName)) continue;
      if (propName.startsWith(options.excludePrefix!)) continue;
      if (!isMethod) continue;
      const originalMethod = descriptor.value;
      decoratorArray.forEach((value) => value(target, propName, descriptor));
      if (originalMethod != descriptor.value) {
        copyMetadata(originalMethod, descriptor.value);
      }
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
