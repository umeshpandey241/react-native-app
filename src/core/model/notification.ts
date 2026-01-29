export interface Notification {
	createDate?: Date;
	id?: number;
	name?: string;
	url?: string;
	validFrom?: Date;
	image?: string;
	validTill?: Date;
	shortDescription?: string;
	description?: string;
	isActive?: boolean;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
