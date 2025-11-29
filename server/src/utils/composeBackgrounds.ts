import sharp from 'sharp';
import fetch from 'node-fetch';

export interface ComposeOptions {
	scale?: number;
	bgBlur?: number;
	subjectSaturation?: number;
	subjectBrightness?: number;
	addShadow?: boolean;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
	shadowBlur?: number;
	bottomMargin?: number;
}

const DEFAULT_OPTIONS: Required<ComposeOptions> = {
	scale: 0.6,
	bgBlur: 1.5,
	subjectSaturation: 0.95,
	subjectBrightness: 1,
	addShadow: true,
	shadowOffsetX: 8,
	shadowOffsetY: 18,
	shadowBlur: 20,
	bottomMargin: 8,
};

export const composeSubjectOnBackground = async (
	subjectUrl: string,
	backgroundUrl: string,
	options: ComposeOptions = {}
): Promise<Buffer> => {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	const [bgRes, fgRes] = await Promise.all([
		fetch(backgroundUrl),
		fetch(subjectUrl),
	]);

	if (!bgRes.ok) throw new Error('Failed to fetch background image');
	if (!fgRes.ok) throw new Error('Failed to fetch subject image');

	const [bgBuf, fgBuf] = await Promise.all([
		bgRes.arrayBuffer(),
		fgRes.arrayBuffer(),
	]);

	const bgSharp = sharp(bgBuf).ensureAlpha().blur(opts.bgBlur);
	const bgMeta = await bgSharp.metadata();
	const bgWidth = bgMeta.width ?? 1024;
	const bgHeight = bgMeta.height ?? 1024;

	let subjectResizedBuffer = await sharp(fgBuf)
		.ensureAlpha()
		.resize({
			width: Math.floor(bgWidth * opts.scale),
			fit: 'inside',
			withoutEnlargement: true,
			kernel: sharp.kernel.lanczos3,
		})
		.modulate({
			saturation: opts.subjectSaturation,
			brightness: opts.subjectBrightness,
		})
		.png({
			quality: 100,
			compressionLevel: 0,
		})
		.toBuffer();

	const subjectMeta = await sharp(subjectResizedBuffer).metadata();
	const subjectWidth = subjectMeta.width ?? Math.floor(bgWidth * opts.scale);
	const subjectHeight = subjectMeta.height ?? bgHeight;

	const left = Math.round((bgWidth - subjectWidth) / 2);
	const top = Math.round(bgHeight - subjectHeight - opts.bottomMargin);

	const composites: sharp.OverlayOptions[] = [];

	if (opts.addShadow) {
		const shadow = await sharp(subjectResizedBuffer)
			.ensureAlpha()
			.tint({ r: 0, g: 0, b: 0 })
			.modulate({ brightness: 0.32 })
			.blur(opts.shadowBlur)
			.png()
			.toBuffer();

		composites.push({
			input: shadow,
			left: left + opts.shadowOffsetX,
			top: top + opts.shadowOffsetY,
			blend: 'over',
		});
	}

	composites.push({
		input: subjectResizedBuffer,
		left,
		top,
		blend: 'over',
	});

	const composed = await bgSharp
		.composite(composites)
		.png({ quality: 100, compressionLevel: 0 })
		.toBuffer();

	return composed;
};
