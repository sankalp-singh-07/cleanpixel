const sections = [
	{
		title: 'Information We Collect',
		body: 'We collect account details, uploaded images, generated results, payment-related records, and technical information needed to operate and secure the service.',
	},
	{
		title: 'How We Use Information',
		body: 'We use data to authenticate users, process images, manage credits, provide galleries and folders, improve reliability, and respond to support requests.',
	},
	{
		title: 'Image Handling',
		body: 'Uploaded and processed images may be stored so you can access your gallery, download results, and share public profiles or folders when you choose.',
	},
	{
		title: 'Sharing',
		body: 'We do not sell personal data. We may share limited information with infrastructure, payment, analytics, or support providers that help us run CleanPixel.',
	},
	{
		title: 'Your Choices',
		body: 'You can update profile details, control public visibility for supported assets, and contact us to request help with account or data questions.',
	},
];

const Privacy = () => {
	return (
		<main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
			<section className="mx-auto max-w-3xl">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
					Privacy Policy
				</p>
				<h1 className="text-4xl font-bold">How CleanPixel Handles Data</h1>
				<p className="mt-4 text-sm text-foreground/65">
					Last updated: June 2, 2026
				</p>
				<div className="mt-10 space-y-8">
					{sections.map((section) => (
						<section key={section.title}>
							<h2 className="text-2xl font-semibold">{section.title}</h2>
							<p className="mt-3 text-foreground/75">{section.body}</p>
						</section>
					))}
				</div>
			</section>
		</main>
	);
};

export default Privacy;
