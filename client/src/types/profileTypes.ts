export type UserProfile = {
	id: string;
	username: string;
	name: string;
	email: string;
	avatarUrl: string | null;
	bio: string | null;
	publicProfile: boolean;
	folders: ProfileFolder[];
	images: ProfileImage[];
};

export type ProfileFolder = {
	id: string;
	name: string;
	description: string | null;
	isPublic: boolean;
	thumbnailUrl: string | null;
	createdAt: string;
};

export type ProfileImage = {
	id: string;
	originalUrl: string;
	replacedUrl: string | null;
	isPublic: boolean;
	type: string | null;
	createdAt: string;
};

export type PublicProfile = {
	id: string;
	username: string;
	name: string;
	bio: string | null;
	avatarUrl: string | null;
	publicProfile: boolean;
	folders: Omit<ProfileFolder, 'isPublic'>[];
	images: Omit<ProfileImage, 'isPublic'>[];
};

export type UpdateProfilePayload = {
	name?: string;
	bio?: string | null;
	avatarUrl?: string | null;
	publicProfile?: boolean;
};

export type ProfileResponse = {
	success: boolean;
	data: UserProfile;
};

export type PublicProfileResponse = {
	success: boolean;
	message: string;
	data: PublicProfile;
};

export type UpdateProfileResponse = {
	success: boolean;
	data: {
		id: string;
		username: string;
		name: string;
		bio: string | null;
		avatarUrl: string | null;
		publicProfile: boolean;
		updatedAt: string;
	};
};
