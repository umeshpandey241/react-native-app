import { anyValueField,booleanField, requiredStringField, stringDateFormat,stringEmail,stringMobileNumber,stringNumeric } from "./baseSchema";
type TransFn = (key: string, params?: Record<string, unknown>) => string;
export const enquiryValidate = (t: TransFn) => ({
	id:stringNumeric(t('enquiries.columns.fields.id'),t,0,0),
	name:anyValueField(t('enquiries.columns.fields.name'),t,2,100),
	email:stringEmail(t('enquiries.columns.fields.email'),t,5,150),
	mobile:stringMobileNumber(t('enquiries.columns.fields.mobile'),t,10,10),
	location:anyValueField(t('enquiries.columns.fields.location'),t,2,200),
	company:anyValueField(t('enquiries.columns.fields.company'),t,2,200),
	role:anyValueField(t('enquiries.columns.fields.role'),t,2,200),
	industrieId:requiredStringField(t('enquiries.columns.fields.industrieId'),t,1,500),
	industrieIdName:requiredStringField(t('enquiries.columns.fields.industrieIdName'),t,1,500),
	otherIndusrtri:requiredStringField(t('enquiries.columns.fields.otherIndusrtri'),t,1,500),
	productId:requiredStringField(t('enquiries.columns.fields.productId'),t,1,500),
	productIdName:requiredStringField(t('enquiries.columns.fields.productIdName'),t,1,500),
	description:anyValueField(t('enquiries.columns.fields.description'),t,2,10000),
	enquiryType:requiredStringField(t('enquiries.columns.fields.enquiryType'),t,1,100),
	enquiryTypeLabel:requiredStringField(t('enquiries.columns.fields.enquiryTypeLabel'),t,1,100),
	createDate:stringDateFormat(t('enquiries.columns.fields.createDate'),t),
	updateDate:stringDateFormat(t('enquiries.columns.fields.updateDate'),t),
	deleteDate:stringDateFormat(t('enquiries.columns.fields.deleteDate'),t),
	createById:stringNumeric(t('enquiries.columns.fields.createById'),t,0,0),
	updateById:stringNumeric(t('enquiries.columns.fields.updateById'),t,0,0),
	deleteById:stringNumeric(t('enquiries.columns.fields.deleteById'),t,0,0),
	isDelete:booleanField(t('enquiries.columns.fields.isDelete'),t),

// <!--validate-Data-->
});