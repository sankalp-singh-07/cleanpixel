const CARDS = [
	{ id: 1, src: '/1.png', alt: 'Model on chair', mobileSrc: '/7.png' },
	{ id: 2, src: '/2.png', alt: 'Person with bottle', objectFit: 'object-contain' },
	{ id: 3, src: '/3.png', alt: 'Profile closeup' },
	{ id: 4, src: '/4.png', alt: 'Two friends pose' },
	{ id: 5, src: '/5.png', alt: 'Happy customer' },
	{ id: 6, src: '/6.png', alt: 'Creator smiling' },
];

const Tile = ({
	src,
	alt,
	mobileSrc,
	objectFit = 'object-cover',
}: {
	src: string;
	alt: string;
	mobileSrc?: string;
	objectFit?: string;
}) => (
	<figure
		className="
			overflow-hidden
			rounded-2xl
			border border-white/5
			bg-[#09090b]
			w-full

			h-[260px]
			md:h-[320px]
			lg:h-[280px]
			flex
			items-center
			justify-center
		"
	>
		{mobileSrc ? (
			<picture className="w-full h-full">
				<source media="(max-width: 767px)" srcSet={mobileSrc} />
				<source media="(min-width: 768px)" srcSet={src} />

				<img
					src={src}
					alt={alt}
					loading="lazy"
					decoding="async"
					className={`w-full h-full ${objectFit}`}
				/>
			</picture>
		) : (
			<img
				src={src}
				alt={alt}
				loading="lazy"
				decoding="async"
				className={`w-full h-full ${objectFit}`}
			/>
		)}
	</figure>
);

export function GridHeader() {
	return (
		<div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-12 lg:grid-cols-12 items-start">
				<div className="md:col-span-7 lg:col-span-4">
					<Tile {...CARDS[0]} />
				</div>

				<div className="hidden md:block md:col-span-5 lg:col-span-5">
					<Tile {...CARDS[1]} />
				</div>

				<div className="hidden lg:block lg:col-span-3">
					<Tile {...CARDS[2]} />
				</div>

				<div className="hidden md:block md:col-span-6 lg:col-span-5">
					<Tile {...CARDS[3]} />
				</div>

				<div className="hidden md:block md:col-span-6 lg:col-span-2">
					<Tile {...CARDS[4]} />
				</div>

				<div className="hidden lg:block lg:col-span-5">
					<Tile {...CARDS[5]} />
				</div>
			</div>
		</div>
	);
}
