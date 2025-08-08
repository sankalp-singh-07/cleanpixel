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

export const findUser = async (email?: string, username?: string) => {
	try {
		if (email) {
			return await client.user.findUnique({ where: { email } });
		}
		if (username) {
			return await client.user.findUnique({ where: { username } });
		}
		throw new Error('No identifier provided to find user');
	} catch (error) {
		throw error;
	}
};

export const getUserById = async (id: string) => {
	try {
		return await client.user.findUnique({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const userImageUpload = async (url: string, userId: string) => {
	try {
		const data = await client.userImage.create({
			data: {
				userId,
				originalUrl: url,
			},
		});
		return data;
	} catch (error) {
		throw error;
	}
};

export const updateRemovedBgImg = async (
	url: string,
	id: string,
	userId: string
) => {
	const image = await client.userImage.findUnique({ where: { id } });

	if (!image || image.userId !== userId) {
		throw new Error(image ? 'Unauthorized user' : 'Image not found');
	}

	const data = await client.userImage.update({
		where: { id },
		data: { removedBgUrl: url },
	});
	return data;
};

export const fetchOgImg = async (id: string) => {
	const result = await client.userImage.findUnique({
		where: {
			id,
		},
	});

	return result?.originalUrl;
};

export const fetchGallery = async (
	userId: string,
	show: string,
	sort: string,
	limit: number,
	skip: number
) => {
	const whereClause = {
		userId,
		...(show === 'original'
			? { removedBgUrl: null }
			: show === 'removed'
			? { removedBgUrl: { not: null } }
			: {}),
	};

	const result = await client.userImage.findMany({
		where: whereClause,
		orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
		take: limit,
		skip: skip,
	});

	return result;
};
