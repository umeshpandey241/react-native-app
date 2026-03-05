export interface Cart {
	id?: number;
	name?: string;
	productId?: string;
	qty?: number;
	regularPrice?: number;
	salePrice?: number;
	couponDiscount?: number;
	igst?: number;
	sgst?: number;
	cgst?: number;
	totalGst?: number;
	totalAmount?: number;
	appUserId?: number;
	image?: string;
	slug?: string;
	minQty?: number;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
