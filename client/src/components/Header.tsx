import { useNavigate } from 'react-router-dom';
import { GridHeader } from './GridHeader';

const Header = () => {
	const navigate = useNavigate();

	const handleGetStarted = () => {
		navigate('/register');
	};

	const handleBuyCredits = () => {
		navigate('/pricing');
	};

	return (
		<header role="banner" className="pt-20 pb-16">
			<div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center">
				<p className="mb-4 inline-flex items-center rounded-full border-2 border-foreground px-3.5 py-1 text-xs font-semibold md:px-4 md:py-1.5 md:text-sm">
					Have Something Clean
				</p>

				<h1 className="mx-auto max-w-3xl font-sans text-4xl font-semibold leading-tight tracking-[-0.015em] md:text-5xl lg:max-w-4xl lg:text-6xl">
					No More Messy Backgrounds Again
				</h1>

				<p className="mx-auto mt-3 max-w-2xl px-2 font-sans text-sm font-normal leading-relaxed text-foreground/80 md:mt-4 md:text-base lg:text-lg">
					Fast, reliable, and effortless background removal that
					delivers clean, professional images trusted by users all
					over the world.
				</p>

				<div className="mt-7 flex flex-col gap-2 md:flex-row">
					<button
						className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-6"
						aria-label="Get started for free"
						onClick={handleGetStarted}
					>
						Get Started — For Free!
					</button>

					<button
						className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-background px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-6"
						aria-label="Buy credits"
						onClick={handleBuyCredits}
					>
						Buy Credits
					</button>
				</div>
			</div>
			<div className="mt-9 md:mt-20 m-auto">
				<GridHeader />
			</div>
		</header>
	);
};

export default Header;
