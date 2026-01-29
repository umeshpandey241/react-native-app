import {z} from 'zod';
import {format, parseISO, isValid} from 'date-fns';

type TransFn = (key: string, params?: Record<string, unknown>) => string;

const baseStringField = (fieldName: string, t: TransFn) =>
  z
    .string({
      required_error: t('validators.required', {field: fieldName}),
      invalid_type_error: t('validators.required', {field: fieldName}),
    })
    .min(1, {message: t('validators.required', {field: fieldName})});

const stringOnlyAlphabets = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .regex(/^[A-Za-z\s]+$/, {
      message: t('validators.alphabetsOnly', {field: fieldName}),
    })
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    });

const stringAlphanumeric = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: t('validators.alphanumeric', {field: fieldName}),
    });

const stringAlphanumericWithSpecialChars = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    })
    .regex(/^[a-zA-Z0-9\s.,'-/()&@#]+$/, {
      message: t('validators.alphanumeric', {field: fieldName}),
    });

const stringOnlySpecialChars = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    })
    .regex(/^[^a-zA-Z0-9]+$/, {
      message: t('validators.specialCharsOnly', {field: fieldName}),
    });

const gstField = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  z
    .string({
      required_error: t('validators.required', {field: fieldName}),
      invalid_type_error: t('validators.required', {field: fieldName}),
    })
    .min(1, {message: t('validators.required', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minDigits', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxDigits', {field: fieldName, length: maxLength}),
    })
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, {
      message: t('validators.invalid', {field: fieldName}),
    });

const numericField = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(1, {message: t('validators.required', {field: fieldName})})
    .regex(/^\d+$/, {message: t('validators.numbersOnly', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minDigits', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxDigits', {field: fieldName, length: maxLength}),
    });

// const stringNumeric = (fieldName: string, t: TransFn, minValue: number, maxValue: number) =>
//     baseStringField(fieldName, t)
//         .refine((val) => /^\d+$/.test(val), { message: t('validators.numbersOnly', { field: fieldName }), })
//         .refine((val) => parseInt(val, 10) >= minValue, { message: t('validators.minDigits', { field: fieldName, length: minValue }), })
//         .refine((val) => parseInt(val, 10) <= maxValue, { message: t('validators.maxDigits', { field: fieldName, length: maxValue }), });

const stringNumeric = (
  fieldName: string,
  t: TransFn,
  minValue: number,
  maxValue: number,
) =>
  z.coerce
    .string({
      required_error: t('validators.required', {field: fieldName}),
      invalid_type_error: t('validators.required', {field: fieldName}),
    })
    .refine(val => /^\d+$/.test(val), {
      message: t('validators.numbersOnly', {field: fieldName}),
    })
    .refine(val => parseInt(val, 10) >= minValue, {
      message: t('validators.minDigits', {field: fieldName, length: minValue}),
    })
    .refine(val => parseInt(val, 10) <= maxValue, {
      message: t('validators.maxDigits', {field: fieldName, length: maxValue}),
    });

const stringMobileNumber = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .regex(/^\d+$/, {message: t('validators.numbersOnly', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minDigits', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxDigits', {field: fieldName, length: maxLength}),
    });

const stringDateFormat = (fieldName: string, t: TransFn) =>
  z.preprocess(
    value => {
      if (!value) return '';
      if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
        return value;
      }
      if (typeof value === 'string') {
        const date = parseISO(value);
        if (isValid(date)) {
          return format(date, 'dd-MM-yyyy');
        }
      }
      if (value instanceof Date && isValid(value)) {
        return format(value, 'dd-MM-yyyy');
      }
      return value;
    },
    z
      .string({
        required_error: t('validators.required', {field: fieldName}),
        invalid_type_error: t('validators.required', {field: fieldName}),
      })
      .min(1, {
        message: t('validators.required', {field: fieldName}),
      })
      .regex(/^\d{2}-\d{2}-\d{4}$/, {
        message: t('validators.dateFormat', {field: fieldName}),
      }),
  );

const stringEmail = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  z
    .string({
      required_error: t('validators.required', {field: fieldName}),
      invalid_type_error: t('validators.required', {field: fieldName}),
    })
    .min(1, {message: t('validators.required', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    })
    .email({message: t('validators.invalid', {field: fieldName})});

const stringPassword = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(1, {message: t('validators.required', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    });

const requiredStringField = (
  fieldName: string,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  baseStringField(fieldName, t)
    .min(1, {message: t('validators.required', {field: fieldName})})
    .min(minLength, {
      message: t('validators.minLength', {field: fieldName, length: minLength}),
    })
    .max(maxLength, {
      message: t('validators.maxLength', {field: fieldName, length: maxLength}),
    });

const requiredNumberField = (fieldName: string, t: TransFn) =>
  z.coerce.number({
    required_error: t('validators.required', {field: fieldName}),
    invalid_type_error: t('validators.invalid', {field: fieldName}),
  });

const booleanField = (fieldName: string, t: TransFn, required = false) =>
  required
    ? z
        .literal(true)
        .or(z.literal(false))
        .refine(val => val === true, {
          message: t('validators.required', {field: fieldName}),
        })
    : z.literal(true).or(z.literal(false));

// const fileUploadField = (fieldName: any, t: TransFn, minLength: number, maxLength: number) =>
// z.array(
//     z.object({
//         fileName: z.string(),
//         filePath: z.string(),
//         type: z.string()
//     })
// ).min(minLength, {
//     message: minLength === 1
//         ? t('validators.required', { field: fieldName })
//         : t('validators.minFiles', { count: minLength, field: fieldName }),
// })
//     .max(maxLength, { message: t('validators.maxFiles', { field: fieldName, max: maxLength }) });

const fileUploadField = (
  fieldName: any,
  t: TransFn,
  minLength: number,
  maxLength: number,
) =>
  z.preprocess(
    val => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z
      .array(
        z.object({
          fileName: z.string(),
          filePath: z.string(),
          type: z.string(),
        }),
      )
      .min(minLength, {
        message:
          minLength === 1
            ? t('validators.required', {field: fieldName})
            : t('validators.minFiles', {count: minLength, field: fieldName}),
      })
      .max(maxLength, {
        message: t('validators.maxFiles', {field: fieldName, max: maxLength}),
      }),
  );

const genderField = (fieldName: string, t: TransFn) =>
  z
    .string({required_error: t('validators.required', {field: fieldName})})
    .min(1, {message: t('validators.required', {field: fieldName})});

const booleanRadioField = (fieldName: string, t: TransFn, required = false) =>
  required
    ? z.boolean({
        required_error: t('validators.required', {field: fieldName}),
        invalid_type_error: t('validators.invalid', {field: fieldName}),
      })
    : z.boolean().optional();

// const numberOrDoubleField = (fieldName: string, t: TransFn) =>
//     z.number({
//         required_error: t('validators.required', { field: fieldName }),
//         invalid_type_error: t('validators.invalid', { field: fieldName }),
//     }).refine((val) => !isNaN(val), {
//         message: t('validators.invalid', { field: fieldName }),
//     });

const numberOrDoubleField = (fieldName: string, t: TransFn) =>
  z.preprocess(
    val => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z
      .number({
        required_error: t('validators.required', {field: fieldName}),
        invalid_type_error: t('validators.invalid', {field: fieldName}),
      })
      .refine(val => val >= 0, {
        message: t('validators.invalid', {field: fieldName}),
      }),
  );

const anyValueField = (
  fieldName: string,
  t: TransFn,
  min: number,
  max: number,
) => {
  let schema = z
    .string({
      invalid_type_error: t('validators.invalid', {field: fieldName}),
      required_error: t('validators.required', {field: fieldName}),
    })
    .trim();

  if (min !== undefined) {
    schema = schema.min(min, {
      message: t('validators.minLength', {field: fieldName, length: min}),
    });
  }

  if (max !== undefined) {
    schema = schema.max(max, {
      message: t('validators.maxLength', {field: fieldName, length: max}),
    });
  }

  return schema;
};

const checkboxField = (fieldName: string, t: TransFn) =>
  z.literal(true, {
    errorMap: () => ({
      message: t('validators.required', {field: fieldName}),
    }),
  });

export {
  anyValueField,
  stringOnlyAlphabets,
  stringAlphanumeric,
  stringAlphanumericWithSpecialChars,
  stringOnlySpecialChars,
  gstField,
  numericField,
  stringNumeric,
  requiredNumberField,
  stringMobileNumber,
  stringDateFormat,
  stringEmail,
  stringPassword,
  requiredStringField,
  booleanField,
  fileUploadField,
  genderField,
  booleanRadioField,
  numberOrDoubleField,
  checkboxField,
};
