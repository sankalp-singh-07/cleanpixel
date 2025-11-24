import { PrismaClient } from '@prisma/client';
import { FolderCreate, FolderUpdate } from '../types/folderTypes';

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

export const createFolder = async (userId: string, data: FolderCreate) => {
	return client.folder.create({
		data: {
			userId,
			name: data.name,
			description: data.description ?? null,
			isPublic: data.isPublic ?? false,
			thumbnailUrl: data.thumbnailUrl ?? null,
		},
	});
};

export const listUserFolders = async (userId: string) => {
	return client.folder.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
	});
};

export const getFolderByIdForOwner = async (
	folderId: string,
	userId: string
) => {
	const folder = await client.folder.findUnique({
		where: { id: folderId },
		include: { images: true },
	});
	if (!folder) throw new Error('Folder not found');
	if (folder.userId !== userId) throw new Error('Not authorized');
	return folder;
};

export const updateFolder = async (
	folderId: string,
	userId: string,
	data: FolderUpdate
) => {
	const folder = await client.folder.findUnique({ where: { id: folderId } });
	if (!folder) throw new Error('Folder not found');
	if (folder.userId !== userId) throw new Error('Not authorized');

	const updatePayload: any = {};
	if (data.name !== undefined) updatePayload.name = data.name;
	if (data.description !== undefined)
		updatePayload.description = data.description;
	if (data.isPublic !== undefined) updatePayload.isPublic = data.isPublic;
	if (data.thumbnailUrl !== undefined)
		updatePayload.thumbnailUrl = data.thumbnailUrl;

	return client.folder.update({
		where: { id: folderId },
		data: updatePayload,
	});
};

export const deleteFolder = async (folderId: string, userId: string) => {
	const folder = await client.folder.findUnique({ where: { id: folderId } });
	if (!folder) throw new Error('Folder not found');
	if (folder.userId !== userId) throw new Error('Not authorized');

	await client.userImage.updateMany({
		where: { folderId },
		data: { folderId: null },
	});

	return client.folder.delete({ where: { id: folderId } });
};

export const getPublicFolderByUsername = async (
	username: string,
	folderId: string,
	page = 1,
	limit = 24
) => {
	const user = await client.user.findUnique({
		where: { username },
		select: { id: true, name: true, avatarUrl: true, publicProfile: true },
	});
	if (!user) throw new Error('User not found');
	if (!user.publicProfile) throw new Error('Profile is private');

	const folder = await client.folder.findUnique({
		where: { id: folderId },
	});
	if (!folder) throw new Error('Folder not found');
	if (folder.userId !== user.id)
		throw new Error('Folder does not belong to user');
	if (!folder.isPublic) throw new Error('Folder is private');

	const images = await client.userImage.findMany({
		where: { folderId: folder.id, isPublic: true },
		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * limit,
		take: limit,
	});

	const total = await client.userImage.count({
		where: { folderId: folder.id, isPublic: true },
	});

	return {
		folder: {
			id: folder.id,
			name: folder.name,
			description: folder.description,
			thumbnailUrl: folder.thumbnailUrl,
			createdAt: folder.createdAt,
		},
		owner: { username, name: user.name, avatarUrl: user.avatarUrl },
		images,
		pagination: {
			page,
			limit,
			total,
			pages: Math.ceil(total / limit) || 1,
		},
	};
};

export const assignImageToFolder = async (
	imageId: string,
	folderId: string,
	userId: string
) => {
	const image = await client.userImage.findUnique({ where: { id: imageId } });
	if (!image) throw new Error('Image not found');
	if (image.userId !== userId) throw new Error('Not authorized');

	const folder = await client.folder.findUnique({ where: { id: folderId } });
	if (!folder) throw new Error('Folder not found');
	if (folder.userId !== userId)
		throw new Error('Folder does not belong to user');

	return client.userImage.update({
		where: { id: imageId },
		data: { folderId },
	});
};

export const removeImageFromFolder = async (
	imageId: string,
	userId: string
) => {
	const image = await client.userImage.findUnique({ where: { id: imageId } });
	if (!image) throw new Error('Image not found');
	if (image.userId !== userId) throw new Error('Not authorized');

	return client.userImage.update({
		where: { id: imageId },
		data: { folderId: null },
	});
};
