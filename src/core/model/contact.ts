export interface Contact {
	id?: number;
	name?: string;
	email?: string;
	message?: string;
	mobile?: string;
	state?: string;
	city?: string;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
