import { Link } from 'react-router-dom';
import { ArrowRight, FolderOpen, ImageDown, Sparkles, Upload } from 'lucide-react';

const metrics = [
	{ value: '10MB', label: 'high-quality uploads' },
	{ value: '3 steps', label: 'upload, remove, export' },
	{ value: '24/7', label: 'self-serve workspace' },
];

const workflow = [
	{
		icon: Upload,
		title: 'Upload with confidence',
		copy: 'Drop in JPG, PNG, or WEBP images and keep moving without opening a heavy editor.',
	},
	{
		icon: Sparkles,
		title: 'Remove the background',
		copy: 'Generate clean transparent results for product shots, profile photos, and brand assets.',
	},
	{
		icon: FolderOpen,
		title: 'Organize and share',
		copy: 'Save images to folders, manage visibility, and share polished public collections.',
	},
];

const About = () => {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
					<div>
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
							About CleanPixel
						</p>
						<h1 className="max-w-4xl text-4xl font-bold md:text-6xl">
							Background removal built for the way images actually get used.
						</h1>
						<p className="mt-6 max-w-2xl text-base text-foreground/72 md:text-lg">
							CleanPixel helps creators, sellers, founders, and teams turn raw
							photos into clean, reusable assets. Upload once, remove the
							background, download the result, and keep your best images
							organized in one workspace.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								to="/upload"
								className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
							>
								Try the remover
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								to="/gallery"
								className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
							>
								View gallery
							</Link>
						</div>
					</div>

					<div className="rounded-lg border border-border bg-secondary p-4 shadow-sm">
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="overflow-hidden rounded-md border border-border bg-background">
								<img
									src="/person.avif"
									alt="Original portrait before background removal"
									className="h-72 w-full object-cover"
								/>
								<p className="border-t border-border px-3 py-2 text-xs font-medium text-foreground/65">
									Original
								</p>
							</div>
							<div className="overflow-hidden rounded-md border border-border bg-[linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%),linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px]">
								<img
									src="/person.avif"
									alt="Clean cutout preview on transparent checkerboard"
									className="h-72 w-full object-contain p-8"
								/>
								<p className="border-t border-border bg-background px-3 py-2 text-xs font-medium text-foreground/65">
									Clean cutout
								</p>
							</div>
						</div>
						<div className="mt-4 grid gap-3 sm:grid-cols-3">
							{metrics.map((metric) => (
								<div
									key={metric.label}
									className="rounded-md border border-border bg-background px-4 py-3"
								>
									<p className="text-2xl font-bold text-primary">{metric.value}</p>
									<p className="text-xs text-foreground/60">{metric.label}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="max-w-2xl">
						<p className="text-sm font-semibold uppercase tracking-wide text-primary">
							Workflow
						</p>
						<h2 className="mt-3 text-3xl font-bold md:text-4xl">
							A focused workspace from first upload to final asset.
						</h2>
					</div>

					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{workflow.map(({ icon: Icon, title, copy }) => (
							<div
								key={title}
								className="rounded-lg border border-border bg-secondary p-6"
							>
								<div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-xl font-semibold">{title}</h3>
								<p className="mt-3 text-sm text-foreground/70">{copy}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-t border-border bg-secondary px-4 py-14 sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
							<ImageDown className="h-4 w-4" />
							Export-ready
						</p>
						<h2 className="mt-3 max-w-2xl text-3xl font-bold">
							Make every profile photo, listing image, and campaign asset easier
							to reuse.
						</h2>
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

export default About;
