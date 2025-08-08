import { SelectChangeEvent } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
type DispatchTypes = "SET" | "DELETE" | "RESET";

type Validator<T> = (value: string, values: T) => true | string;
type ValidatorMap<T> = Partial<Record<keyof T, Validator<T>[]>>;
type ValidatorSource<T> = ValidatorMap<T> | ((values: T) => ValidatorMap<T>);
interface Options<T> {
  validators?: ValidatorSource<T>;
}

type RefTypeWithDefault<
  T extends Record<string, unknown>,
  R extends Partial<{ [K in keyof T]: unknown }>
> = {
  [K in keyof T]: K extends keyof R ? R[K] : HTMLElement;
};

type RefCollection<
  T extends Record<string, unknown>,
  R extends Partial<{ [K in keyof T]: unknown }>
> = {
  [K in keyof T]: React.RefObject<RefTypeWithDefault<T, R>[K] | null>;
};

export function useFormFields<
  T extends Record<keyof T, unknown>,
  R extends Partial<{ [K in keyof T]: unknown }> = object
>(initialValues: T, options?: Options<T>) {
  const { validators } = options ?? {};

  const refs = useRef<RefCollection<T, R>>(
    (() => {
      const result = {} as RefCollection<T, R>;
      (Object.keys(initialValues) as (keyof T)[]).forEach((key) => {
        result[key] = React.createRef<RefTypeWithDefault<T, R>[typeof key]>();
      });
      return result;
    })()
  ).current;

  const copyInitialValues = useRef({ ...initialValues });

  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const dispatch = useCallback<{
    (type: "SET", payload: Partial<T>): void;
    (type: "SET", payload: (prev: T) => Partial<T>): void;
    (type: "DELETE", payload: keyof T): void;
    (type: "RESET"): void;
  }>(
    (
      type: DispatchTypes,
      payload?: Partial<T> | keyof T | ((prev: T) => Partial<T>)
    ) => {
      switch (type) {
        case "SET":
          if (typeof payload === "function") {
            setValues((prev) => ({
              ...prev,
              ...payload(prev),
            }));
          }
          if (typeof payload === "object" && payload !== null) {
            setValues((prev) => ({
              ...prev,
              ...payload,
            }));
          }
          break;
        case "DELETE":
          if (typeof payload === "string") {
            setValues((prev) => ({
              ...prev,
              [payload]: copyInitialValues.current[payload],
            }));
          }
          break;
        case "RESET":
          setValues(copyInitialValues.current);
      }
    },
    [setValues]
  );

  const getValidators = useCallback((): ValidatorMap<T> | undefined => {
    return typeof validators === "function" ? validators(values) : validators;
  }, [validators, values]);

  const validateField = useCallback(
    (key: keyof T, value: string): string => {
      const _validators = getValidators();
      if (!_validators) return "";
      const rules = _validators[key];
      if (!rules) return "";
      for (const rule of rules) {
        const result = rule(value, values);
        if (result !== true) return result;
      }
      return "";
    },
    [getValidators, values]
  );

  const onChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.MouseEvent<HTMLElement, MouseEvent>
        | SelectChangeEvent
    ) => {
      const { value, type, name } = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement;

      let finalValue = value;
      switch (type) {
        case "checkbox": {
          setValues((prev) => ({
            ...prev,
            [name]: !prev[name as keyof T] as boolean,
          }));
          break;
        }
        case "number": {
          const raw = value;
          const filtered = raw.replace(/[^0-9]/g, "").replace(/^0+/, "");
          finalValue = filtered;
          setValues((prev) => ({
            ...prev,
            [name]: filtered,
          }));
          break;
        }
        default:
          setValues((prev) => ({
            ...prev,
            [name]: value,
          }));
          break;
      }

      const msg = validateField(name as keyof T, finalValue);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [validateField]
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const msg = validateField(name as keyof T, value);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [validateField]
  );

  const validateAll = useCallback(() => {
    let valid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const key of Object.keys(values) as (keyof T)[]) {
      const msg = validateField(key, String(values[key]));

      if (msg) valid = false;
      newErrors[key] = msg;
    }

    setErrors(newErrors);
    return valid;
  }, [values, validateField]);

  return { values, errors, dispatch, onChange, validateAll, onBlur, refs };
}
