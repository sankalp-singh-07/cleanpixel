import { useCreditStore } from '@/store/creditStore';
import { useNavigate } from 'react-router-dom';

const ShowCredits = () => {
	const navigate = useNavigate();
	const { credits, loading, error } = useCreditStore();

	const handleClick = () => {
		navigate('/pricing');
	};

	if (loading) {
		return;
	}

	return (
		<>
			<div
				className="flex justify-center gap-1 items-center border-2 rounded-2xl px-2.5 py-0.5 border-primary cursor-pointer dark:bg-primary bg-background"
				onClick={handleClick}
			>
				{loading && credits == null ? (
					<span className="dark:text-white text-primary">
						Credits
					</span>
				) : (
					<>
						<span className="dark:text-white text-primary">
							Credits
						</span>
						<span className="dark:text-white text-primary font-semibold">
							{credits}
						</span>
					</>
				)}
				{error && <span className="ml-2 text-red-600">{error}</span>}
			</div>
		</>
	);
};

export default ShowCredits;
