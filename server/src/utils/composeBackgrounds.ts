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

	const subjectResized = await sharp(fgBuf)
		.ensureAlpha()
		.resize({
			width: Math.floor(bgWidth * 0.6),
			fit: 'inside',
		})
		.toBuffer();

	const composed = await bgSharp
		.composite([
			{
				input: subjectResized,
				gravity: 'center',
			},
		])
		.png({ compressionLevel: 0 })
		.toBuffer();

	return composed;
};
