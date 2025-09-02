const CARDS = [
	{ id: 1, src: 'OIP.webp', alt: 'Model on chair' },
	{ id: 2, src: 'OIP.webp', alt: 'Person with bottle' },
	{ id: 3, src: 'OIP.webp', alt: 'Profile closeup' },
	{ id: 4, src: 'OIP.webp', alt: 'Two friends pose' },
	{ id: 5, src: 'OIP.webp', alt: 'Happy customer' },
	{ id: 6, src: 'OIP.webp', alt: 'Creator smiling' },
];

const rowH = 'h-52 md:h-60 lg:h-72 xl:h-80';

const Tile = ({ src, alt }: { src: string; alt: string }) => (
	<figure className={`overflow-hidden rounded-2xl ${rowH}`}>
		<img
			src={src}
			alt={alt}
			className="block h-full w-full object-cover"
			loading="lazy"
			decoding="async"
		/>
	</figure>
);

export function GridHeader() {
	return (
		<div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-12 lg:grid-cols-12">
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

				<div className="hidden md:block md:col-span-6 lg:col-span-3">
					<Tile {...CARDS[4]} />
				</div>

				<div className="hidden lg:block lg:col-span-4">
					<Tile {...CARDS[5]} />
				</div>
			</div>
		</div>
	);
}
