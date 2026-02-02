import {
  anyValueField,
  booleanField,
  stringDateFormat,
  stringEmail,
  stringMobileNumber,
  stringNumeric,
} from './baseSchema';
type TransFn = (key: string, params?: Record<string, unknown>) => string;
export const downloadedCaseValidate = (t: TransFn) => ({
  id: stringNumeric(t('downloadedCases.columns.fields.id'), t, 0, 0),
  name: anyValueField(t('downloadedCases.columns.fields.name'), t, 1, 100),
  email: stringEmail(t('downloadedCases.columns.fields.email'), t, 5, 150),
  mobile: stringMobileNumber(
    t('downloadedCases.columns.fields.mobile'),
    t,
    10,
    10,
  ),
  caseStudyId: stringNumeric(
    t('downloadedCases.columns.fields.caseStudyId'),
    t,
    1,
    100,
  ),
  caseName: anyValueField(
    t('downloadedCases.columns.fields.caseName'),
    t,
    1,
    200,
  ),
  createDate: stringDateFormat(
    t('downloadedCases.columns.fields.createDate'),
    t,
  ),
  updateDate: stringDateFormat(
    t('downloadedCases.columns.fields.updateDate'),
    t,
  ),
  deleteDate: stringDateFormat(
    t('downloadedCases.columns.fields.deleteDate'),
    t,
  ),
  createById: stringNumeric(
    t('downloadedCases.columns.fields.createById'),
    t,
    0,
    0,
  ),
  updateById: stringNumeric(
    t('downloadedCases.columns.fields.updateById'),
    t,
    0,
    0,
  ),
  deleteById: stringNumeric(
    t('downloadedCases.columns.fields.deleteById'),
    t,
    0,
    0,
  ),
  isDelete: booleanField(t('downloadedCases.columns.fields.isDelete'), t),

  // <!--validate-Data-->
});
