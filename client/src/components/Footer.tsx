import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="bg-secondary text-foreground border-t border-border mt-32">
			<div className="max-w-4xl mx-auto px-6 py-12 text-center">
				<h2 className="font-serif text-2xl font-semibold mb-3">
					Subscribe to our Newsletter
				</h2>
				<p className="text-foreground/70 text-sm mb-6">
					Get updates on new features, deals, and tips to make your
					visuals shine.
				</p>

				<form
					className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						type="email"
						placeholder="Enter your email"
						className="w-full sm:w-auto flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
					/>
					<button
						type="submit"
						className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
					>
						Subscribe
					</button>
				</form>
			</div>

			<div className="border-t border-border"></div>

			<div className="flex flex-wrap justify-center gap-6 py-6 text-sm font-medium text-foreground/80">
				<Link
					to="/pricing"
					className="hover:text-primary transition-colors"
				>
					Pricing
				</Link>
				<Link
					to="/about"
					className="hover:text-primary transition-colors"
				>
					About
				</Link>
				<Link
					to="/contact"
					className="hover:text-primary transition-colors"
				>
					Contact
				</Link>
				<Link
					to="/terms"
					className="hover:text-primary transition-colors"
				>
					Terms & Conditions
				</Link>
				<Link
					to="/policy"
					className="hover:text-primary transition-colors"
				>
					Privacy Policy
				</Link>
			</div>

			<div className="border-t border-border"></div>

			<div className="relative text-center py-4">
				<h1 className="text-[10vw] mb-4 md:mb-16 md:text-[8vw] font-serif font-bold text-foreground/15 select-none">
					CLEANPIXEL
				</h1>

				<p className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[2rem] text-sm text-foreground/60 sm:block hidden">
					© 2025 CleanPixel. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
