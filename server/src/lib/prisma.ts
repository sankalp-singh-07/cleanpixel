import { PrismaClient } from '@prisma/client';

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

export const deductCredit = async (userId: string) => {
	const result = await client.user.update({
		where: {
			id: userId,
		},
		data: {
			credits: { decrement: 1 },
		},
	});
	return result;
};

export const checkCredits = async (userId: string) => {
	const data = await client.user.findUnique({
		where: {
			id: userId,
		},
	});

	const credits = data?.credits;

	if (credits === null || credits === undefined) return false;

	return credits > 0;
};

export const getCredits = async (userId: string) => {
	const data = await client.user.findUnique({
		where: {
			id: userId,
		},
	});

	const credits = data?.credits;

	return credits;
};

export const addCredits = async (userId: string, credits: number) => {
	return await client.user.update({
		where: { id: userId },
		data: { credits: { increment: credits } },
	});
};

export const createOrder = async (
	userId: string,
	credits: number,
	plan: string,
	amount: number,
	razorpayOrderId: string
) => {
	return await client.payment.create({
		data: {
			userId,
			credits,
			plan,
			amount,
			razorpayOrderId,
		},
	});
};

export const updateOrderStatus = async (razorpayOrderId: string) => {
	return await client.payment.updateMany({
		where: { razorpayOrderId },
		data: { status: true },
	});
};

export const findPaymentrecord = async (
	razorpayOrderId: string,
	userId: string
) => {
	return await client.payment.findFirst({
		where: { razorpayOrderId, userId },
	});
};

export const fetchPublicProfile = async (username: string) => {
	try {
		const user = await client.user.findUnique({
			where: { username },
			select: {
				id: true,
				username: true,
				name: true,
				bio: true,
				avatarUrl: true,
				publicProfile: true,
				folders: {
					where: { isPublic: true },
					select: {
						id: true,
						name: true,
						description: true,
						thumbnailUrl: true,
						createdAt: true,
					},
				},
				images: {
					where: { isPublic: true },
					select: {
						id: true,
						replacedUrl: true,
						originalUrl: true,
						type: true,
						createdAt: true,
					},
				},
			},
		});

		if (!user) throw new Error('User not found');
		if (!user.publicProfile) throw new Error('Profile is private');

		return user;
	} catch (err) {
		console.error('fetchPublicProfile:', err);
		throw err;
	}
};

export const getUserProfile = async (userId: string) => {
	return await client.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			name: true,
			email: true,
			avatarUrl: true,
			bio: true,
			publicProfile: true,
			folders: {
				select: {
					id: true,
					name: true,
					description: true,
					isPublic: true,
					thumbnailUrl: true,
					createdAt: true,
				},
			},
			images: {
				select: {
					id: true,
					originalUrl: true,
					replacedUrl: true,
					isPublic: true,
					type: true,
					createdAt: true,
				},
			},
		},
	});
};

export const updateUserProfile = async (
	userId: string,
	data: {
		name?: string;
		bio?: string;
		avatarUrl?: string;
		publicProfile?: boolean;
	}
) => {
	const updateData: any = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.bio !== undefined) updateData.bio = data.bio;
	if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
	if (data.publicProfile !== undefined)
		updateData.publicProfile = data.publicProfile;

	return await client.user.update({
		where: { id: userId },
		data: updateData,
		select: {
			id: true,
			username: true,
			name: true,
			bio: true,
			avatarUrl: true,
			publicProfile: true,
			updatedAt: true,
		},
	});
};
