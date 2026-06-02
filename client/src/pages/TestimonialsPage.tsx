import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Quote, Sparkles, Star } from 'lucide-react';

const stories = [
	{
		quote:
			'CleanPixel helped us turn messy catalog photos into marketplace-ready images without waiting on a design queue.',
		name: 'Marc Cohen',
		role: 'CEO',
		company: 'Phoenix Trading',
		image: '/cat2.jpeg',
		metric: '4x faster listings',
	},
	{
		quote:
			'The background removal is reliable enough for launch assets and quick enough for daily content production.',
		name: 'Emil Barsø Rheinlænder',
		role: 'Content & Marketing Coordinator',
		company: 'Sony Music',
		image: '/cat1.jpg',
		metric: '60% less edit time',
	},
	{
		quote:
			'It handles tricky edges beautifully, especially hair and soft product details that usually need manual cleanup.',
		name: 'Taylor Hatmaker',
		role: 'Senior Technology Editor',
		company: 'TechCrunch',
		image: '/person.avif',
		metric: 'Cleaner cutouts',
	},
];

const TestimonialsPage = () => {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="max-w-3xl">
						<p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
							<Sparkles className="h-4 w-4" />
							Success Stories
						</p>
						<h1 className="text-4xl font-bold md:text-6xl">
							Creators and teams use CleanPixel to ship cleaner visuals faster.
						</h1>
						<p className="mt-6 text-base text-foreground/70 md:text-lg">
							From profile photos to product catalogs, CleanPixel gives image-heavy
							workflows a faster path from raw upload to polished export.
						</p>
					</div>

					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{['Product sellers', 'Content teams', 'Founders'].map((label) => (
							<div
								key={label}
								className="rounded-lg border border-border bg-secondary p-5"
							>
								<Building2 className="mb-4 h-5 w-5 text-primary" />
								<p className="font-semibold">{label}</p>
								<p className="mt-2 text-sm text-foreground/65">
									Remove backgrounds, save results, organize collections, and
									reuse polished images across channels.
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
					{stories.map((story) => (
						<article
							key={story.name}
							className="flex min-h-full flex-col rounded-lg border border-border bg-secondary p-6"
						>
							<div className="mb-6 flex items-center justify-between">
								<Quote className="h-8 w-8 text-primary" />
								<div className="flex gap-1 text-primary">
									{Array.from({ length: 5 }).map((_, index) => (
										<Star key={index} className="h-4 w-4 fill-current" />
									))}
								</div>
							</div>
							<p className="text-lg font-medium leading-relaxed">
								“{story.quote}”
							</p>
							<div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
								<img
									src={story.image}
									alt={story.name}
									className="h-14 w-14 rounded-full object-cover"
								/>
								<div>
									<p className="font-semibold">{story.name}</p>
									<p className="text-sm text-foreground/60">
										{story.role}, {story.company}
									</p>
								</div>
							</div>
							<div className="mt-5 rounded-md bg-background px-4 py-3 text-sm font-semibold text-primary">
								{story.metric}
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="border-t border-border bg-secondary px-4 py-14 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-3xl font-bold">Ready to create your own before-and-after?</h2>
						<p className="mt-2 text-foreground/65">
							Upload an image and get a clean transparent result in a focused workflow.
						</p>
					</div>
					<Link
						to="/upload"
						className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
					>
						Start removing backgrounds
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</section>
		</main>
	);
};

export default TestimonialsPage;
