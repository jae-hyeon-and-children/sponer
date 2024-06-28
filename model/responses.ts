interface ValidationError {
	path: (string | number)[];
	message: string;
}

export interface IResponse {
	status: number;
	success: boolean;
	message: string;
	errors?: ValidationError[];
	token?: string;
}
