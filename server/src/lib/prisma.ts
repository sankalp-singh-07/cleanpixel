import { PrismaClient } from '../generated/prisma';

const client = new PrismaClient();

export const createUser = async (
	username: string,
	name: string,
	email: string,
	password: string
) => {
	try {
		const user = await client.user.create({
			data: {
				username,
				name,
				email,
				password,
			},
		});
		return user;
	} catch (error) {
		throw error;
	}
};

export const findUser = async (email: string) => {
	try {
		const user = await client.user.findUnique({
			where: { email },
		});
		return user;
	} catch (error) {
		throw error;
	}
};
