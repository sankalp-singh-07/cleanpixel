import nodemailer from 'nodemailer';

export async function sendEmail({
	to,
	subject,
	html,
	text,
}: {
	to: string;
	subject: string;
	html: string;
	text?: string;
}) {
	const user = process.env.EMAIL_USER;
	const pass = process.env.EMAIL_PASS;

	if (!user || !pass) {
		console.warn('⚠️ SMTP Email credentials (EMAIL_USER/EMAIL_PASS) are not configured in .env.');
		console.log('=== DEVELOPMENT EMAIL SIMULATION ===');
		console.log(`To: ${to}`);
		console.log(`Subject: ${subject}`);
		console.log(`Body (HTML):\n${html}`);
		if (text) {
			console.log(`Body (Text):\n${text}`);
		}
		console.log('====================================');
		return { simulated: true };
	}

	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST || 'smtp.gmail.com',
		port: Number(process.env.EMAIL_PORT) || 587,
		secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
		auth: {
			user,
			pass,
		},
	});

	const info = await transporter.sendMail({
		from: `"CleanPixel Support" <${user}>`,
		to,
		subject,
		text,
		html,
	});

	return info;
}
