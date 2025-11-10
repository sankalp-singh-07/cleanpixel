import { useState } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import type { planTypes } from '@/types/paymentTypes';

type Props = {
	name: planTypes;
	credits: number;
	amount: number;
	popular?: boolean;
};

export const PlanCard = ({ name, credits, amount, popular = false }: Props) => {
	const { setPlan, initiatePayment, loading } = usePaymentStore();
	const [isHovered, setIsHovered] = useState(false);

	const handleBuy = async () => {
		setPlan(name);
		await initiatePayment(name);
	};

	const cardColors: Record<string, { accent: string; button: string }> = {
		basic: {
			accent: 'bg-primary',
			button: 'bg-primary',
		},
		advanced: {
			accent: 'bg-red-500',
			button: 'bg-red-600 hover:bg-red-700',
		},
		premium: {
			accent: 'bg-primary',
			button: 'bg-primary',
		},
	};

	const colors = cardColors[name] || cardColors.basic;

	return (
		<div
			className={`relative transition-all duration-300 ${
				popular ? 'scale-105 z-10' : ''
			} ${isHovered && !popular ? 'scale-[1.02]' : ''}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{popular && (
				<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
					<div
						className={`${colors.accent} text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg`}
					>
						Popular
					</div>
				</div>
			)}

			<div
				className={`relative bg-white dark:bg-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
					popular
						? 'border-2 border-red-500'
						: 'border border-primary'
				}`}
			>
				<div className="p-8 flex text-center flex-col h-fit ">
					<h3 className="text-3xl md:text-5xl font-bold capitalize text-foreground mb-3 font-sans">
						{name}
					</h3>

					<div className="mb-6">
						<span className="text-2xl md:text-4xl font-bold text-foreground">
							₹{amount}
						</span>
						<p className="text-sm text-foreground/60 mt-1">
							{credits} Credits
						</p>
					</div>

					<button
						disabled={loading}
						onClick={handleBuy}
						className={`w-full ${colors.button} text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-md hover:shadow-lg mb-6`}
					>
						{loading ? 'Processing…' : 'Buy Now'}
					</button>
				</div>
			</div>
		</div>
	);
};
