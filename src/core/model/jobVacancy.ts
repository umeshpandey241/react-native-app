export interface JobVacancy {
	id?: number;
	name?: string;
	experience?: string;
	location?: string;
	qualification?: string;
	responsibilities?: string;
	knowledgeRequired?: string;
	skillRequired?: string;
	jobCategoryId?: string;
	jobCategoryIdName?: string;
	isActive?: boolean;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
