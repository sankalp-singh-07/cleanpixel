export type LoginResponse = {
	message: string;
	accessToken: string;
	user: {
		id: string;
		email: string;
		username: string;
		name: string;
	};
};

export type SignupResponse = {
	message: string;
	user: { id: string; email: string };
};
