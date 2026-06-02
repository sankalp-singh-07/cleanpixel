const sections = [
	{
		title: 'Use of Service',
		body: 'You may use CleanPixel to upload and process images that you own, control, or have permission to edit. Do not upload unlawful, harmful, or infringing content.',
	},
	{
		title: 'Accounts and Credits',
		body: 'Some features may require an account and credits. You are responsible for keeping your account secure and for activity that occurs through your account.',
	},
	{
		title: 'Uploaded Content',
		body: 'You keep ownership of your images. By uploading content, you allow CleanPixel to process, store, and display it as needed to provide the service.',
	},
	{
		title: 'Availability',
		body: 'We work to keep the service reliable, but image processing can depend on network, storage, and third-party infrastructure. The service is provided without a guarantee of uninterrupted availability.',
	},
	{
		title: 'Changes',
		body: 'We may update these terms as the product evolves. Continued use of CleanPixel after updates means you accept the revised terms.',
	},
];

const Terms = () => {
	return (
		<main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
			<section className="mx-auto max-w-3xl">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
					Terms & Conditions
				</p>
				<h1 className="text-4xl font-bold">Terms of Service</h1>
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

export default Terms;
