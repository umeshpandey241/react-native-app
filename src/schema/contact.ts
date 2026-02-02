import {
  anyValueField,
  booleanField,
  stringDateFormat,
  stringEmail,
  stringNumeric,
} from './baseSchema';
type TransFn = (key: string, params?: Record<string, unknown>) => string;
export const contactValidate = (t: TransFn) => ({
  id: stringNumeric(t('contacts.columns.fields.id'), t, 0, 0),
  name: anyValueField(t('contacts.columns.fields.name'), t, 1, 100),
  email: stringEmail(t('contacts.columns.fields.email'), t, 5, 150),
  message: anyValueField(t('contacts.columns.fields.message'), t, 1, 10000),
  mobile: anyValueField(t('contacts.columns.fields.mobile'), t, 10, 10),
  state: anyValueField(t('contacts.columns.fields.state'), t, 2, 500),
  city: anyValueField(t('contacts.columns.fields.city'), t, 2, 500),
  createDate: stringDateFormat(t('contacts.columns.fields.createDate'), t),
  updateDate: stringDateFormat(t('contacts.columns.fields.updateDate'), t),
  deleteDate: stringDateFormat(t('contacts.columns.fields.deleteDate'), t),
  createById: stringNumeric(t('contacts.columns.fields.createById'), t, 0, 0),
  updateById: stringNumeric(t('contacts.columns.fields.updateById'), t, 0, 0),
  deleteById: stringNumeric(t('contacts.columns.fields.deleteById'), t, 0, 0),
  isDelete: booleanField(t('contacts.columns.fields.isDelete'), t),

  // <!--validate-Data-->
});
