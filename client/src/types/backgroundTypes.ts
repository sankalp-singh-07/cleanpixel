export type PresetBackground = {
	id: string;
	label: string;
	category: 'studio' | 'office' | 'outdoor' | 'abstract';
	preview: string;
};

export type BackgroundListResponse = {
	success: boolean;
	data: PresetBackground[];
};

export type ApplyBackgroundPayload = {
	mode: 'preset' | 'generate';
	backgroundId?: string;
	prompt?: string;
};

export type ApplyBackgroundResponse = {
	success: boolean;
	message: string;
	data: {
		image: {
			id: string;
			userId: string;
			originalUrl: string;
			removedBgUrl: string;
			replacedUrl: string;
			type: string;
		};
		finalUrl: string;
		creditsDeducted: number;
	};
};
