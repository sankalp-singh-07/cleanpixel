import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
	const [isDark, setIsDark] = useState(
		() => localStorage.getItem('theme') === 'dark'
	);

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDark]);

	return (
		<button
			type="button"
			aria-pressed={isDark}
			onClick={() => setIsDark(!isDark)}
			className="relative inline-flex h-9 w-[4.25rem] items-center rounded-full border border-border bg-secondary p-1 text-foreground shadow-sm transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<span
				className={`absolute top-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow transition-transform ${
					isDark ? 'translate-x-8' : 'translate-x-0'
				}`}
			>
				{isDark ? (
					<Moon className="h-4 w-4" />
				) : (
					<Sun className="h-4 w-4" />
				)}
			</span>
			<span className="sr-only">Toggle theme</span>
		</button>
	);
};

export default DarkModeToggle;
