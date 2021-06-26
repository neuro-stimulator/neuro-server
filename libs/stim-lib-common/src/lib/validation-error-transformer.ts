import { ValidationError } from '@nestjs/common';

export type ValidationErrors = { property: string; codes: number[] | { constraint: string; code: number }[] }[];

export function transformValidationErrors(errors: ValidationError[]): ValidationErrors {
  return errors
    .map((error: ValidationError) => mapChildrenToValidationErrors(error))
    .reduce((previousValue: ValidationError[], currentValue: ValidationError[]) => [...previousValue, ...currentValue])
    .filter((error: ValidationError) => error['contexts'])
    .map((error: ValidationError) => {
      return {
        property: error.property,
        codes: extractErrorCodes(error.constraints, error['contexts']),
      };
    });
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
    validationErrors.push(item);
  }
  return validationErrors;
}

function extractErrorCodes(constraints: Record<string, string>, contexts: Record<string, { code: number }>): number[] | { constraint: string; code: number }[] {
  return Object.keys(constraints).map((key: string) => {
    return {
      constraint: constraints[key],
      code: contexts[key].code,
    };
  });
}
