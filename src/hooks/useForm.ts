/* eslint-disable */
import { useState, useEffect } from 'react';

// Tipos para validações e campos
type Validator = (value: any, context?: ValidatorContext) => string | null;

type ValidatorContext = FormFieldValues<any>;

/*
 * Field representa um campo do formulário, com T sendo o tipo do seu campo.
 */
type Field<T = any> = {
  value: T;
  error: string | null;
  isValid: boolean;
  validators: Validator[];
};

/*
 * FormFields é o complemento de Field, que representa cada campo do formulário, sendo ele um campo normal ou como array
 * [K in keyof T] = Para cada chave K do objeto T...
 * T[K] extends any[] = Verifica-se se o campo é do tipo array
 * Field<T[K][number]>[] = Caso seja, mapeia o campo como um Field T[K] de array
 * Field<T[K]> = Se não, como um Field normal T[K]
 */

type FormFields<T> = {
  [K in keyof T]: T[K] extends any[] ? Field<T[K][number]>[] : Field<T[K]>;
};

type FieldValue<T = any> = {
  value: T;
};
type FormFieldValues<T> = {
  [K in keyof T]: T[K] extends any[]
    ? FieldValue<T[K][number]>[]
    : FieldValue<T[K]>;
};

/*
 * Os campos inciais só precisam receber value e validators
 */
type InitialField<T = any> = {
  value: T;
  validators: Validator[];
};

type InitialFormFields<T> = {
  [K in keyof T]: T[K] extends any[]
    ? InitialField<T[K][number]>[]
    : InitialField<T[K]>;
};

type UseFormReturn<T> = {
  fields: FormFields<T>;
  setFieldValue: <K extends keyof T>(
    name: K,
    value: T[K],
    index?: number,
  ) => void;
  isFormValid: () => boolean;
  addRepeatableField: <K extends keyof T>(
    name: K,
    initialValue: InitialField<T[K]>,
  ) => void;
};

export const useForm = <T extends Record<string, any>>(
  initialFields: InitialFormFields<T>,
): UseFormReturn<T> => {
  const [fields, setFields] = useState(initializeFields(initialFields));

  // Atualiza o valor de um campo
  const setFieldValue = <K extends keyof T>(
    name: K,
    value: T[K],
    index?: number,
  ) => {
    setFields((prev) => {
      const field = prev[name];
      const updatedFields = { ...prev };

      if (Array.isArray(field) && index !== undefined) {
        const updatedFieldArray = [...field];
        updatedFieldArray[index] = { ...updatedFieldArray[index], value };
        (updatedFields[name] as any[]) = updatedFieldArray;

        // Validar o campo após a alteração
        validateField(name, updatedFieldArray, index);
      } else {
        updatedFields[name] = { ...field, value };

        // Validar o campo após a alteração
        validateField(name, updatedFields[name]);
      }

      return updatedFields;
    });
  };

  // Valida um campo individualmente
  const validateField = <K extends keyof T>(
    name: K,
    field?: Field | Field[],
    index?: number,
  ): void => {
    setFields((prev) => {
      const currentField = field ?? prev[name]; // Se o campo foi passado, usa ele, senão pega do estado.

      const validate = (f: Field) => {
        for (const validator of f.validators) {
          const error = validator(f.value, prev); // Passar o contexto como o estado atual.
          if (error) return { ...f, error, isValid: false };
        }
        return { ...f, error: null, isValid: true };
      };

      if (Array.isArray(currentField) && index !== undefined) {
        const updatedFields = [...currentField];
        updatedFields[index] = validate(updatedFields[index]);
        return { ...prev, [name]: updatedFields };
      }

      return { ...prev, [name]: validate(currentField as Field) };
    });
  };

  // Verifica se o formulário inteiro é válido
  const isFormValid = () =>
    Object.values(fields).every((field) =>
      Array.isArray(field)
        ? field.every((f) => f.isValid)
        : (field as Field).isValid,
    );

  // Adiciona um novo item em campos repetíveis
  const addRepeatableField = <K extends keyof T>(
    name: K,
    initialValue: T[K][number],
  ) => {
    setFields((prev) => {
      const fieldArray = prev[name] as Field[];
      return {
        ...prev,
        [name]: [
          ...fieldArray,
          { value: initialValue, error: null, isValid: true, validators: [] },
        ],
      };
    });
  };

  return {
    fields,
    setFieldValue,
    isFormValid,
    addRepeatableField,
  };
};

function initializeFields<T>(fields: InitialFormFields<T>): FormFields<T> {
  const mappedFields = {} as FormFields<T>;

  const context: ValidatorContext = {} as ValidatorContext;

  Object.keys(fields).forEach((key) => {
    const field = fields[key as keyof T];

    if (Array.isArray(field)) {
      // Se o campo for repetível (array), mapear cada item do array
      mappedFields[key as keyof T] = field.map((f) => ({
        value: f.value,
        validators: f.validators,
        error: null,
        isValid: false,
      })) as any;

      context[key] = field.map(({ value }) => ({ value }));
    } else {
      // Se for um campo simples
      mappedFields[key as keyof T] = {
        value: field.value,
        validators: field.validators,
        error: null,
        isValid: false,
      } as any;

      (context[key] as FieldValue).value = field.value;
    }
  });

  Object.keys(mappedFields).forEach((key) => {
    const field = mappedFields[key as keyof T];

    if (Array.isArray(field)) {
      // Para campos repetíveis
      field.forEach((f) => {
        f.isValid = f.validators.every(
          (validador) => validador(f.value, context) === null,
        );
      });
    } else {
      // Para campos simples
      field.isValid = field.validators.every(
        (validador) => validador(field.value, context) === null,
      );
    }
  });

  return mappedFields;
}
