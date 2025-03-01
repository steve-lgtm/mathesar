import { get } from 'svelte/store';
import type { Field, FieldValue, ValuedField } from './field';

export type Valid = { type: 'valid' };
export type Invalid = { type: 'invalid'; errorMsg: string };
export type ValidationOutcome = Valid | Invalid;

export function isInvalid(v: ValidationOutcome): v is Invalid {
  return v.type === 'invalid';
}
export function isValid(v: ValidationOutcome): v is Valid {
  return v.type === 'valid';
}

export type ValidationFn<T> = (v: T) => ValidationOutcome;

export function valid(): Valid {
  return { type: 'valid' };
}

export function invalid(errorMsg: string): Invalid {
  return { type: 'invalid', errorMsg };
}

export function getErrors<T>(
  value: T,
  validators: ValidationFn<T>[],
): string[] {
  return validators
    .map((fn) => fn(value))
    .filter(isInvalid)
    .map(({ errorMsg }) => errorMsg);
}

export function validIf<T>(
  fn: (v: T) => boolean,
  msg: string,
): ValidationFn<T> {
  return (v) => (fn(v) ? valid() : invalid(msg));
}

export function invalidIf<T>(
  fn: (v: T) => boolean,
  msg: string,
): ValidationFn<T> {
  return (v) => (fn(v) ? invalid(msg) : valid());
}

function valueIsFilled<T>(v: T | undefined | null): v is T {
  return (
    v !== undefined &&
    v !== null &&
    v !== '' &&
    (Array.isArray(v) ? v.length !== 0 : true)
  );
}

type FilledFieldValue<F> = FieldValue<F> extends infer T | undefined | null
  ? T
  : never;

export function required(
  msg = 'Value cannot be empty.',
): ValidationFn<unknown> {
  return (v) => (valueIsFilled(v) ? valid() : invalid(msg));
}

export function uniqueWith<T>(
  values: T[],
  msg = 'This value already exists.',
): ValidationFn<T> {
  return (v) => (values.includes(v) ? invalid(msg) : valid());
}

export function min(
  lowerBound: number,
  msg: string | undefined = undefined,
): ValidationFn<number | null | undefined> {
  return (v) =>
    v === null || v === undefined || v >= lowerBound
      ? valid()
      : invalid(msg ?? `Value must be at least ${lowerBound}.`);
}

export function max(
  upperBound: number,
  msg: string | undefined = undefined,
): ValidationFn<number | null | undefined> {
  return (v) =>
    v === null || v === undefined || v <= upperBound
      ? valid()
      : invalid(msg ?? `Value must be at most ${upperBound}.`);
}

interface ComboValidationOutcome {
  outcome: ValidationOutcome;
  fields: Field[];
}

export type ComboValidator = (
  valuedFields: ValuedField[],
) => ComboValidationOutcome;

type FieldsTuple = [Field<unknown>, ...Array<Field<unknown>>];
type ValuesTuple<Fields extends FieldsTuple> = {
  [K in keyof Fields]: FilledFieldValue<Fields[K]>;
};
type ComboValidatorFn<Fields extends FieldsTuple> = (
  values: ValuesTuple<Fields>,
) => ValidationOutcome;
type SimpleComboValidatorFn<Fields extends FieldsTuple> = (
  values: ValuesTuple<Fields>,
) => boolean;

function isIncomplete(v: Pick<ValuedField, 'field' | 'value'>): boolean {
  return v.field.isRequired && !valueIsFilled(v.value);
}

export function comboValidator<Fields extends FieldsTuple>(
  fields: Fields,
  fn: ComboValidatorFn<Fields>,
): ComboValidator {
  return (allValuedFields) => {
    const givenValuedFields = fields.map(
      (field) =>
        allValuedFields.find((i) => i.field === field) ?? {
          field,
          value: get(field),
        },
    );
    if (givenValuedFields.map(isIncomplete).some((v) => v)) {
      // If any required fields are missing values, we skip evaluating the combo
      // validator
      return { outcome: valid(), fields };
    }
    const values = givenValuedFields.map(
      (field) => field.value,
    ) as ValuesTuple<Fields>;
    return { outcome: fn(values), fields };
  };
}

export function comboInvalidIf<Fields extends FieldsTuple>(
  fields: Fields,
  fn: SimpleComboValidatorFn<Fields>,
  msg: string,
): ComboValidator {
  return comboValidator(fields, invalidIf(fn, msg));
}
