import sharp from 'sharp';
import fetch from 'node-fetch';

export const composeSubjectOnBackground = async (
	subjectUrl: string,
	backgroundUrl: string
): Promise<Buffer> => {
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

	const bgSharp = sharp(bgBuf).ensureAlpha();
	const bgMeta = await bgSharp.metadata();
	const bgWidth = bgMeta.width ?? 1024;
	const bgHeight = bgMeta.height ?? 1024;

	// ✅ HIGH-QUALITY FOREGROUND PROCESSING
	const subjectResizedBuffer = await sharp(fgBuf)
		.ensureAlpha()
		.resize({
			width: Math.floor(bgWidth * 0.6),
			fit: 'inside',
			withoutEnlargement: true, // ✅ Prevents pixel stretching
			kernel: sharp.kernel.lanczos3, // ✅ Best resampling filter
		})
		.sharpen({
			sigma: 1.2, // ✅ Restores edge clarity
			m1: 1,
			m2: 2,
		})
		.png({
			quality: 100, // ✅ Max PNG quality
			compressionLevel: 0,
		})
		.toBuffer();

	const subjectMeta = await sharp(subjectResizedBuffer).metadata();
	const subjectWidth = subjectMeta.width ?? Math.floor(bgWidth * 0.6);
	const subjectHeight = subjectMeta.height ?? bgHeight;

	// ✅ PERFECT GROUND PLACEMENT
	const left = Math.round((bgWidth - subjectWidth) / 2);
	const top = Math.round(bgHeight - subjectHeight - 10); // small natural margin

	const composed = await bgSharp
		.composite([
			{
				input: subjectResizedBuffer,
				left,
				top,
			},
		])
		.png({
			quality: 100,
			compressionLevel: 0,
		})
		.toBuffer();

	return composed;
};
