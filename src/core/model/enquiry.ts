export interface Enquiry {
	id?: number;
	name?: string;
	email?: string;
	mobile?: string;
	location?: string;
	company?: string;
	role?: string;
	industrieId?: string;
	industrieIdName?: string;
	otherIndusrtri?: string;
	productId?: string;
	productIdName?: string;
	description?: string;
	enquiryType?: string;
	enquiryTypeLabel?: string;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
