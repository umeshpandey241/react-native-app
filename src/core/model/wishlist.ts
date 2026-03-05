export interface WishList {
	id?: number;
	name?: string;
	productId?: number;
	appUserId?: number;
	slug?: string;
	image?: string;
	regularPrice?: number;
	salePrice?: number;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
