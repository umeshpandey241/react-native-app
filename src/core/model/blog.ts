export interface Blog {
	id?: number;
	name?: string;
	slug?: string;
	image?: string;
	blogDate?: Date;
	isActive?: boolean;
	shortDescription?: string;
	longDescription?: string;
	blogCategoryId?: string;
	blogCategoryIdName?: string;
	tags?: string;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
