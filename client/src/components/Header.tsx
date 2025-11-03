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
		<header
			role="banner"
			className="pt-24 pb-16 flex flex-col items-center justify-center min-h-screen text-center"
		>
			<div className="mx-auto flex max-w-7xl flex-col items-center px-4">
				<p className="mb-6 inline-flex items-center rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold md:text-base">
					Have Something Clean
				</p>

				<h1 className="mx-auto font-sans font-extrabold text-[10vw] leading-[0.9] tracking-tight text-balance text-foreground md:text-[9vw] lg:text-[8vw]">
					No More Messy Backgrounds
				</h1>

				<p className="mx-auto mt-4 max-w-2xl text-base text-foreground/80 md:text-lg lg:text-xl">
					Fast, reliable, and effortless background removal that
					delivers clean, professional images trusted by users all
					over the world.
				</p>

				<div className="mt-10 flex flex-col gap-3 md:flex-row">
					<button
						className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						aria-label="Get started for free"
						onClick={handleGetStarted}
					>
						Get Started — For Free!
					</button>

					<button
						className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-background px-6 py-3 text-base font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						aria-label="Buy credits"
						onClick={handleBuyCredits}
					>
						Buy Credits
					</button>
				</div>
			</div>

			<div className="mt-20 w-full">
				<GridHeader />
			</div>
		</header>
	);
};

export default Header;
