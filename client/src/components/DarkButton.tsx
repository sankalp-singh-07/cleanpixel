const DarkButton = () => {
	const handleDark = () => {
		document.documentElement.classList.toggle('dark');
	};

	return <button onClick={handleDark}>Click</button>;
};

export default DarkButton;
