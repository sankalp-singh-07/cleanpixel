import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
		<Button
			variant="outline"
			size="icon"
			onClick={() => setIsDark(!isDark)}
			className="border-2 border-primary rounded-xl 
                 bg-background 
                 text-primary hover:text-white 
                 hover:bg-primary 
                 cursor-pointer focus-visible:ring-0 pt-1.5 pb-1"
		>
			{isDark ? (
				<Sun className="h-5 w-5 text-current" />
			) : (
				<Moon className="h-5 w-5 text-current" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
};

export default DarkModeToggle;
