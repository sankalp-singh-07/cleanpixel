import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		subject: '',
		message: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = () => {
		if (
			!formData.name ||
			!formData.email ||
			!formData.subject ||
			!formData.message
		) {
			alert('Please fill in all required fields');
			return;
		}
		console.log('Form submitted:', formData);
		alert("Thank you for your message! We'll get back to you soon.");
		setFormData({
			name: '',
			phone: '',
			email: '',
			subject: '',
			message: '',
		});
	};

	return (
		<div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto text-center mb-12">
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-sans">
					Get In Touch
				</h1>
				<p className="text-sm sm:text-lg text-foreground/70 max-w-2xl mx-auto">
					Have a question or want to work together? We'd love to hear
					from you.
				</p>
			</div>

			<div className="max-w-7xl mx-auto">
				<div className="bg-background border-2 border-border rounded-3xl shadow-lg overflow-hidden">
					<div className="grid lg:grid-cols-5 gap-0">
						<div className="lg:col-span-2 bg-primary p-8 sm:p-10 lg:p-12 text-white">
							<div className="mb-10">
								<span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
									Contact Information
								</span>
								<h2 className="text-3xl dark:text-foreground text-white/90  sm:text-4xl font-bold mb-4 font-serif">
									Let's Start a Conversation
								</h2>
								<p className="dark:text-foreground text-white/90 text-lg leading-relaxed">
									Our team is ready to assist you with any
									questions or support you need.
								</p>
							</div>

							<div className="space-y-8">
								<div className="flex items-start space-x-4 group">
									<div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
										<MessageCircle className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-semibold dark:text-foreground text-white/90 text-lg mb-1">
											Chat with us
										</h3>
										<p className="dark:text-foreground text-white/90 text-sm leading-relaxed">
											Our support team is available to
											help you 24/7 via live chat.
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4 group">
									<div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
										<Phone className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-semibold dark:text-foreground text-white/90 text-lg mb-1">
											Call Us
										</h3>
										<p className="dark:text-foreground text-white/90 text-sm mb-2">
											+91 (555) 123-4567
										</p>
										<div className="flex items-center dark:text-foreground text-white/90 text-sm">
											<Clock className="w-4 h-4 mr-1" />
											Mon-Fri, 9 AM - 6 PM EST
										</div>
									</div>
								</div>

								<div className="flex items-start space-x-4 group">
									<div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
										<Mail className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-semibold dark:text-foreground text-white/90 text-lg mb-1">
											Email Us
										</h3>
										<p className="dark:text-foreground text-white/90 text-sm">
											support@cleanpixel.com
										</p>
									</div>
								</div>
							</div>

							<div className="mt-12 pt-8 border-t border-white/20">
								<p className="text-white/80 text-sm">
									We typically respond within 24 hours
								</p>
							</div>
						</div>

						<div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 bg-secondary">
							<div className="mb-8">
								<h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-sans">
									Send Us a Message
								</h3>
								<p className="text-foreground/70">
									Fill out the form below and we'll get back
									to you as soon as possible.
								</p>
							</div>

							<div className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div className="flex flex-col">
										<label
											htmlFor="name"
											className="text-sm font-semibold text-foreground mb-2"
										>
											Your Name{' '}
											<span className="text-primary">
												*
											</span>
										</label>
										<input
											id="name"
											name="name"
											type="text"
											value={formData.name}
											onChange={handleChange}
											placeholder="John Doe"
											className="border-2 border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
										/>
									</div>

									<div className="flex flex-col">
										<label
											htmlFor="phone"
											className="text-sm font-semibold text-foreground mb-2"
										>
											Phone Number
										</label>
										<input
											id="phone"
											name="phone"
											type="tel"
											value={formData.phone}
											onChange={handleChange}
											placeholder="+1 (555) 123-4567"
											className="border-2 border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
										/>
									</div>
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="email"
										className="text-sm font-semibold text-foreground mb-2"
									>
										Email Address{' '}
										<span className="text-primary">*</span>
									</label>
									<input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="john@example.com"
										className="border-2 border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
									/>
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="subject"
										className="text-sm font-semibold text-foreground mb-2"
									>
										Subject{' '}
										<span className="text-primary">*</span>
									</label>
									<input
										id="subject"
										name="subject"
										type="text"
										value={formData.subject}
										onChange={handleChange}
										placeholder="How can we help you?"
										className="border-2 border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
									/>
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="message"
										className="text-sm font-semibold text-foreground mb-2"
									>
										Your Message{' '}
										<span className="text-primary">*</span>
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										placeholder="Tell us more about your inquiry..."
										rows={6}
										className="border-2 border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none resize-none"
									/>
								</div>

								<div className="pt-4">
									<button
										onClick={handleSubmit}
										className="w-full sm:w-auto bg-primary text-white font-semibold rounded-lg px-8 py-4 hover:bg-accent focus:ring-4 focus:ring-primary/30 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
									>
										<span>Send Message</span>
										<Send className="w-5 h-5" />
									</button>
								</div>

								<p className="text-sm text-foreground/60 pt-2">
									By submitting this form, you agree to our
									privacy policy and terms of service.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer Note */}
			<div className="max-w-7xl mx-auto mt-12 text-center">
				<p className="text-foreground/70">
					Need immediate assistance? Call us at{' '}
					<span className="font-semibold text-primary">
						+91 (555) 123-4567
					</span>
				</p>
			</div>
		</div>
	);
};

export default ContactUs;
