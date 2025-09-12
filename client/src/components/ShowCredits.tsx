import { useEffect } from 'react';
import { useCreditStore } from '@/store/creditStore';
import { useNavigate } from 'react-router-dom';

const ShowCredits = () => {
	const navigate = useNavigate();

	const credits = useCreditStore((s) => s.credits);
	const loading = useCreditStore((s) => s.loading);
	const error = useCreditStore((s) => s.error);
	const get = useCreditStore((s) => s.get);

	useEffect(() => {
		if (!loading && credits === null) {
			void get();
		}
	}, [loading, credits, get]);

	if (loading) return null;

	return (
		<div
			className="flex justify-center gap-1 items-center border-2 rounded-2xl px-2.5 py-0.5 border-primary cursor-pointer dark:bg-primary bg-background"
			onClick={() => navigate('/pricing')}
			title="See pricing"
		>
			<span className="dark:text-white text-primary">Credits</span>
			<span className="dark:text-white text-primary font-semibold">
				{credits ?? '—'}
			</span>
			{error && <span className="ml-2 text-red-600">{error}</span>}
		</div>
	);
};

export default ShowCredits;
