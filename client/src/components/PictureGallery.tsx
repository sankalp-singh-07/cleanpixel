import { useState } from "react";

const PictureGallery = () => {
	const tabs = ["People", "Products", "Animals", "Cars", "Graphics"];
	const [active, setActive] = useState("Graphics");

	const images = [
		{
			title: "Upload Image",
			src: "/OIP.webp",
		},
		{
			title: "Remove Background",
			src: "/OIP.webp",
		},
		{
			title: "Add New Background",
			src: "/OIP.webp",
		},
		{
			title: "Multiple Variations",
			grid: [
				"/OIP.webp",
				"/OIP.webp",
				"/OIP.webp",
				"/OIP.webp",
			],
		},
	];

	return (
		<section className="py-16 px-4 md:px-10 lg:px-20 text-center" style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
			<p className="text-sm font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--primary)' }}>
				Transform Your Images
			</p>
			<h2 className="text-4xl md:text-5xl font-sans font-bold mb-10">Just picture it.</h2>

						<div className="flex justify-center flex-wrap gap-3 mb-12">
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActive(tab)}
						className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
							active === tab
								? "bg-foreground text-background"
								: "bg-muted text-muted-foreground hover:bg-muted/70"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-2 gap-6 justify-items-center">
				{/* Card 1 */}
				<div 
					className="w-full max-w-[250px] rounded-2xl overflow-hidden flex flex-col items-center p-4"
					style={{ 
						backgroundColor: 'var(--background)',
						border: '1px solid var(--border)'
					}}
				>
					<img
						src={images[0].src}
						alt="Upload"
						className="w-full h-56 object-cover rounded-lg"
					/>
					<p className="mt-3 text-sm" style={{ color: 'var(--text)', opacity: 0.7 }}>
						{images[0].title}
					</p>
				</div>

				{/* Card 2 */}
				<div 
					className="w-full max-w-[250px] rounded-2xl overflow-hidden flex flex-col items-center p-4"
					style={{ 
						backgroundColor: 'var(--background)',
						border: '1px solid var(--border)'
					}}
				>
					<img
						src={images[1].src}
						alt="Transparent"
						className="w-full h-56 object-cover rounded-lg"
					/>
					<p className="mt-3 text-sm" style={{ color: 'var(--text)', opacity: 0.7 }}>
						{images[1].title}
					</p>
				</div>

				{/* Card 3 */}
				<div 
					className="w-full max-w-[250px] rounded-2xl overflow-hidden flex flex-col items-center p-4"
					style={{ 
						backgroundColor: 'var(--background)',
						border: '1px solid var(--border)'
					}}
				>
					<img
						src={images[2].src}
						alt="New Background"
						className="w-full h-56 object-cover rounded-lg"
					/>
					<p className="mt-3 text-sm" style={{ color: 'var(--text)', opacity: 0.7 }}>
						{images[2].title}
					</p>
				</div>

				{/* Card 4 (2x2 grid inside) */}
				<div 
					className="w-full max-w-[250px] rounded-2xl overflow-hidden p-2 grid grid-cols-2 grid-rows-2 gap-2"
					style={{ 
						backgroundColor: 'var(--background)',
						border: '1px solid var(--border)'
					}}
				>
					{(images[3].grid ?? []).map((src, i) => (
						<img
							key={i}
							src={src}
							alt="Variation"
							className="w-full h-28 object-cover rounded-lg"
						/>
					))}
					<p className="col-span-2 text-sm mt-2 text-center" style={{ color: 'var(--text)', opacity: 0.7 }}>
						{images[3].title}
					</p>
				</div>
			</div>
		</section>
	);
};

export default PictureGallery;