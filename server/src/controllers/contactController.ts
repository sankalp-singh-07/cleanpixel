import { Request, Response } from 'express';
import { sendEmail } from '../utils/mailer.js';

export const sendContactMessage = async (req: Request, res: Response) => {
	try {
		const { name, email, phone, subject, message } = req.body;

		if (!name || !email || !subject || !message) {
			return res.status(400).json({ message: 'All fields except phone are required.' });
		}

		// 1. Send notification to the administrator
		const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER || 'admin@cleanpixel.com';
		const adminHtml = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; background-color: #ffffff;">
				<h2 style="color: #F97316; margin-bottom: 20px;">New Contact Form Submission</h2>
				<table style="width: 100%; border-collapse: collapse;">
					<tr style="border-bottom: 1px solid #eeeeee;">
						<td style="padding: 10px 0; font-weight: bold; width: 120px;">Name:</td>
						<td style="padding: 10px 0;">${name}</td>
					</tr>
					<tr style="border-bottom: 1px solid #eeeeee;">
						<td style="padding: 10px 0; font-weight: bold;">Email:</td>
						<td style="padding: 10px 0;">${email}</td>
					</tr>
					<tr style="border-bottom: 1px solid #eeeeee;">
						<td style="padding: 10px 0; font-weight: bold;">Phone:</td>
						<td style="padding: 10px 0;">${phone || 'N/A'}</td>
					</tr>
					<tr style="border-bottom: 1px solid #eeeeee;">
						<td style="padding: 10px 0; font-weight: bold;">Subject:</td>
						<td style="padding: 10px 0;">${subject}</td>
					</tr>
				</table>
				<div style="margin-top: 20px; padding: 15px; background-color: #FEF3E7; border-radius: 8px;">
					<h3 style="margin-top: 0; color: #262626;">Message:</h3>
					<p style="white-space: pre-wrap; color: #262626; line-height: 1.5; margin-bottom: 0;">${message}</p>
				</div>
			</div>
		`;

		await sendEmail({
			to: adminEmail,
			subject: `[Contact Form] ${subject}`,
			html: adminHtml,
			text: `New contact submission from ${name} (${email}):\nSubject: ${subject}\nPhone: ${phone || 'N/A'}\nMessage:\n${message}`,
		});

		// 2. Send confirmation to the user
		const userHtml = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; background-color: #ffffff;">
				<h2 style="color: #F97316; margin-bottom: 20px;">We've received your message!</h2>
				<p style="color: #262626; line-height: 1.6;">Hi ${name},</p>
				<p style="color: #262626; line-height: 1.6;">
					Thank you for reaching out to CleanPixel! We have received your message regarding <strong>"${subject}"</strong>. 
					Our team is reviewing it, and we will get back to you as soon as possible (usually within 24 hours).
				</p>
				<div style="margin-top: 20px; padding: 15px; border-left: 4px solid #F97316; background-color: #FFF9F4;">
					<p style="margin-top: 0; font-weight: bold; color: #262626;">Copy of your message:</p>
					<p style="white-space: pre-wrap; color: #262626; line-height: 1.5; margin-bottom: 0;">${message}</p>
				</div>
				<p style="color: #262626; line-height: 1.6; margin-top: 25px;">
					Best regards,<br>
					<strong>The CleanPixel Team</strong>
				</p>
			</div>
		`;

		await sendEmail({
			to: email,
			subject: `CleanPixel: Message Received - ${subject}`,
			html: userHtml,
			text: `Hi ${name},\n\nThank you for reaching out to CleanPixel! We have received your message regarding "${subject}". Our team will get back to you within 24 hours.\n\nYour message:\n${message}\n\nBest regards,\nThe CleanPixel Team`,
		});

		return res.status(200).json({ message: 'Your message was sent successfully!' });
	} catch (error: any) {
		console.error('[CONTACT_MESSAGE]', error);
		return res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
	}
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email address is required.' });
		}

		// 1. Send confirmation to the subscriber
		const subscriberHtml = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; background-color: #ffffff; text-align: center;">
				<h1 style="color: #F97316; font-size: 24px; margin-bottom: 10px;">Welcome to CleanPixel!</h1>
				<p style="color: #262626; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
					Thanks for subscribing to our newsletter.
				</p>
				<p style="color: #262626; font-size: 14px; line-height: 1.6; margin-bottom: 30px; text-align: left;">
					You're now on the list to receive updates on new features, styling tips, and exclusive credits deals to make your visuals shine. 
					We promise not to spam you, and you can unsubscribe at any time.
				</p>
				<div style="padding: 15px; background-color: #FEF3E7; border-radius: 8px; font-weight: bold; color: #F97316; display: inline-block;">
					Subscription Confirmed
				</div>
				<p style="color: #262626; font-size: 14px; line-height: 1.6; margin-top: 30px; text-align: left;">
					Best regards,<br>
					<strong>The CleanPixel Team</strong>
				</p>
			</div>
		`;

		await sendEmail({
			to: email,
			subject: 'Welcome to CleanPixel Newsletter!',
			html: subscriberHtml,
			text: `Welcome to CleanPixel!\n\nThanks for subscribing to our newsletter. You're now on the list to receive updates on new features, styling tips, and exclusive credits deals.\n\nBest regards,\nThe CleanPixel Team`,
		});

		// 2. Send notification to the administrator
		const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER || 'admin@cleanpixel.com';
		const adminHtml = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; background-color: #ffffff;">
				<h2 style="color: #F97316; margin-bottom: 15px;">New Newsletter Subscription</h2>
				<p style="color: #262626; font-size: 16px;">
					A new user has subscribed to the newsletter:
				</p>
				<p style="font-size: 18px; font-weight: bold; color: #262626; background-color: #FFF9F4; padding: 10px; border-radius: 6px;">
					${email}
				</p>
			</div>
		`;

		await sendEmail({
			to: adminEmail,
			subject: '[Newsletter] New Subscription',
			html: adminHtml,
			text: `A new user has subscribed to the newsletter: ${email}`,
		});

		return res.status(200).json({ message: 'Thank you for subscribing to our newsletter!' });
	} catch (error: any) {
		console.error('[NEWSLETTER_SUBSCRIBE]', error);
		return res.status(500).json({ message: 'Subscription failed. Please try again later.' });
	}
};
