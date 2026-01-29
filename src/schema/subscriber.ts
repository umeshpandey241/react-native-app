import {
  anyValueField,
  booleanField,
  stringDateFormat,
  stringNumeric,
  stringEmail,
} from './baseSchema';
type TransFn = (key: string, params?: Record<string, unknown>) => string;
export const subscriberValidate = (t: TransFn) => ({
  id: stringNumeric(t('subscribers.columns.fields.id'), t, 0, 0),
  name: anyValueField(t('subscribers.columns.fields.name'), t, 0, 100),
  email: stringEmail(t('subscribers.columns.fields.email'), t, 5, 200),
  createDate: stringDateFormat(t('subscribers.columns.fields.createDate'), t),
  updateDate: stringDateFormat(t('subscribers.columns.fields.updateDate'), t),
  deleteDate: stringDateFormat(t('subscribers.columns.fields.deleteDate'), t),
  createById: stringNumeric(
    t('subscribers.columns.fields.createById'),
    t,
    0,
    0,
  ),
  updateById: stringNumeric(
    t('subscribers.columns.fields.updateById'),
    t,
    0,
    0,
  ),
  deleteById: stringNumeric(
    t('subscribers.columns.fields.deleteById'),
    t,
    0,
    0,
  ),
  isDelete: booleanField(t('subscribers.columns.fields.isDelete'), t),

  // <!--validate-Data-->
});
