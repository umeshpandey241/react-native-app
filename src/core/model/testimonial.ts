export interface Testimonial {
	id?: number;
	name?: string;
	title?: string;
	description?: string;
	uploadPhoto?: string;
	rating?: number;
	designation?: string;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
