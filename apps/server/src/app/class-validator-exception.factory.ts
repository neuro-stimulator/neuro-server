import { ValidationError } from '@nestjs/common';

import { MessageCodes } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';

import { environment } from '../environments/environment';

export function classValidatorExceptionFactory(errors: ValidationError[]): any {
  throw new ControllerException(MessageCodes.CODE_ERROR, { errors: transformErrors(errors) });
}

function transformErrors(errors: ValidationError[]): { property: string; codes: number[] | { constraint: string; code: number }[] }[] {
  return (
    errors
      .map((error: ValidationError) => mapChildrenToValidationErrors(error))
      .reduce((previousValue: ValidationError[], currentValue: ValidationError[]) => [...previousValue, ...currentValue])
      // @ts-ignore
      .filter((error: ValidationError) => error.contexts)
      .map((error: ValidationError) => {
        return {
          property: error.property,
          // @ts-ignore
          codes: extractErrorCodes(error.constraints, error.contexts),
        };
      })
  );
}

function mapChildrenToValidationErrors(error: ValidationError) {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors: ValidationError[] = [];
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item));
    }
  }
  return validationErrors;
}

function extractErrorCodes(constraints: {}, contexts: {}): number[] | { constraint: string; code: number }[] {
  if (environment.production) {
    return Object.values(contexts)
      .map((property: { code: number }) => property.code)
      .sort();
  } else {
    return Object.keys(constraints).map((key: string) => {
      return {
        constraint: constraints[key],
        code: contexts[key].code,
      };
    });
  }
}
