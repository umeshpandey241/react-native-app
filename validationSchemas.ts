import { z } from 'zod';

const stringFieldSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.requiredMinLength', { field: fieldName, length: length }) })
        .regex(/^[A-Za-z\s]+$/, { message: t('validators.alphabetsOnly', { field: fieldName }) });


const alphanumeric = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: t('validators.requiredMinLength', { field: fieldName, length: length }) });


const gstSchema = (t: (key: string, params?: any) => string) =>
    z.string()
        .min(15, { message: t('validators.required', { field: 'GST number' }) })
        .length(15, { message: t('validators.characterLength', { field: 'GST number', length: 15 }) })
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: t('validators.invalid', { field: 'GST Number' }) });


const numericFieldSchema = (fieldName: string, t: (key: string, params?: any) => string, length?: number) =>
    z.string()
        .min(1, { message: t('validators.required', { field: fieldName }) })
        .regex(/^\d*$/, { message: t('validators.numbersOnly', { field: fieldName }) })
        .refine((val) => (length ? val.length === length : true), { message: t('validators.minlength', { field: fieldName, length: length }) });


const date = (t: (key: string, params?: any) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'LastLogin Date' }) })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: t('validators.dateFormat', { field: 'Date' }) });


const email = (t: (key: string, params?: any) => string) =>
    z.string()
        .min(1, { message: t('validators.required', { field: 'Email' }) })
        .email({ message: t('validators.invalid', { field: 'Email Address' }) });

const password = (fieldName: string, t: (key: string, params?: any) => string) =>
    z.string()
        .min(6, { message: t('validators.minCharacterLength', { field: fieldName, length: 6 }) })
        .max(20, { message: t('validators.maxCharacterLength', { field: fieldName, length: 20 }) });

const booleanField = (fieldName: string, t: (key: string, params?: any) => string, required = false) =>
    required
        ? z.boolean().refine(val => val === true, {
            message: t('validators.required', { field: fieldName }),
        })
        : z.boolean();

const mobileSchema = (fieldName: string, t: (key: string, params?: any) => string, length?: number) =>
    z.string()
        .min(1, { message: `${fieldName} is required` })
        .regex(/^\d*$/, { message: `${fieldName}  must contain only numbers` })
        .refine((val) => (length ? val.length === length : true), { message: `${fieldName} must be at least ${length} digits` });

const nameSchema = (fieldName: string, t: (key: string, params?: Record<string, unknown>) => string, length?: number) =>
    z.string()
        .min(length ?? 1, { message: `${fieldName} should have minimum ${length} characters!` })
        .regex(/^[A-Za-z\s]+$/, { message: `${fieldName} must contain only alphabets!` });


const loginEmail = () =>
    z.string()
        .min(1, { message: `Email ID is required` })
        .email({ message: 'Invalid Email Address' });

export const validationSchemas = (t: any) => ({
    firstName: stringFieldSchema('First Name', t, 2),
    lastName: stringFieldSchema('Last Name', t, 2),
    name: stringFieldSchema('Name', t, 2),
    shopName: stringFieldSchema('Shop Name', t, 2),
    password: password('password', t),
    state: stringFieldSchema('State', t, 2),
    district: stringFieldSchema('District', t, 2),
    mobile: numericFieldSchema('Mobile number', t, 10),
    emailId: email(t),
    pincode: numericFieldSchema('Pincode', t, 6),
    gst: gstSchema,
    address: alphanumeric('Address', t, 2),
    addressLine: alphanumeric('Address Line', t, 2),
    defaultLanguage: stringFieldSchema('Default Language', t),
    totalPlot: numericFieldSchema('Total Plot', t, 2),
    lastLogin: date(t),
    isAdmin: booleanField('Admin Status', t),
    isActive: booleanField('Active Status', t),
    role: stringFieldSchema('Role', t),
    publish: stringFieldSchema('Publish', t),
});

export const ProductvalidationSchemas = (t: any) => ({
    name: stringFieldSchema('Name', t, 2),
    category: stringFieldSchema('Category', t, 2),
    deliveredData: numericFieldSchema('Delivered Data', t, 1),
    minQty: numericFieldSchema('minQty', t),
    minQtyFarmer: numericFieldSchema('minQtyFarmer', t),
    productStatus: stringFieldSchema('Product Status', t),
    relatedProduct: stringFieldSchema('Related Product', t),
    size: alphanumeric('Size', t),
    sku: alphanumeric('Sku', t, 2),
    slug: alphanumeric('Slug', t, 2),
    specifications: stringFieldSchema('Specifications', t, 2),
    variableLabel: alphanumeric('VariableLabel', t),
    variableValue: alphanumeric('VariableValue', t),
    regularPrice: numericFieldSchema('Regular Price', t),
    salePrice: numericFieldSchema('Regular Price', t),
    salePriceFarmer: numericFieldSchema('Sale Price Farmer', t),
    shippingAmount: numericFieldSchema('shippingAmount', t),
    sgst: numericFieldSchema('Sgst', t),
    igst: numericFieldSchema('Igst', t),
    cgst: numericFieldSchema('Cgst', t),
});

export const AuthvalidationSchemas = (t: any) => ({
    emailId: loginEmail(),
    password: mobileSchema('Password', t),
    mobile: mobileSchema('Mobile number', t, 10),
    name: nameSchema('Name', t),
});

