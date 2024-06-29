interface ValidationError {
	path: (string | number)[];
	message: string;
}

export interface IResponse<T = void> {
	status: number;
	success: boolean;
	message: string;
	errors?: ValidationError[];
	token?: string;
	data?: T;
}
