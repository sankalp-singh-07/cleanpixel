import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotPageFound: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center px-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-secondary/40 to-background opacity-60" />

			<div className="relative z-10 flex flex-col items-center">
				<p className="text-foreground/70 mb-1">
					You look a little lost...
				</p>

				<h2 className="text-5xl sm:text-6xl font-serif font-bold text-foreground mb-6">
					Ooops! Page not found
				</h2>

				<p className="text-foreground/80 max-w-lg mb-10">
					Hmm… this page didn’t load properly — maybe it lost its
					background! Head back and continue editing your images.
				</p>

				<div className="mb-2 mt-2 relative">
					<div className="absolute w-64 h-64 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
					<img
						src="/404P.png"
						alt="Floating astronaut"
						className="w-48 sm:w-60 animate-float drop-shadow-md"
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					<button
						onClick={() => navigate('/')}
						className="flex items-center justify-between bg-secondary px-6 py-3 rounded-2xl border border-border shadow-sm hover:shadow-md hover:bg-primary/10 transition w-64"
					>
						<div className="text-left">
							<p className="font-semibold text-foreground">
								Home Page
							</p>
							<p className="text-sm text-foreground/70">
								There’s no place like home...
							</p>
						</div>
						<span className="text-primary text-lg font-bold">
							→
						</span>
					</button>

					<button
						onClick={() => navigate('/contact')}
						className="flex items-center justify-between bg-primary text-white px-6 py-3 rounded-2xl shadow-sm hover:bg-accent transition w-64"
					>
						<div className="text-left">
							<p className="font-semibold">Contact Us</p>
							<p className="text-sm opacity-90">
								We’d love to talk
							</p>
						</div>
						<span className="text-white text-lg font-bold">→</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotPageFound;
