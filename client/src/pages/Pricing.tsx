import { PlanCard } from '@/components/PlanCard';
import { PaymentModal } from '@/components/PaymentModal';
import { PACKAGE_MAP } from '@/types/paymentTypes';
import { Link } from 'react-router-dom';

const Pricing = () => {
	const enhancedPackages = {
		basic: {
			...PACKAGE_MAP.basic,
			popular: false,
		},
		advanced: {
			...PACKAGE_MAP.advanced,
			popular: true,
		},
		premium: {
			...PACKAGE_MAP.premium,
			popular: false,
		},
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-16 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 font-sans">
						Choose Your Plan
					</h1>
					<p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
						Get credits to remove image backgrounds instantly and
						effortlessly.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 px-2 sm:px-0">
					{Object.entries(enhancedPackages).map(([name, plan]) => (
						<PlanCard
							key={name}
							name={name as any}
							credits={plan.credits}
							amount={plan.amount}
							popular={plan.popular}
						/>
					))}
				</div>
				<div className="text-center space-y-4">
					<p className="text-foreground/60 text-sm mb-6 mt-7">
						Need custom credits or API access? Let’s make it work.
					</p>
					<Link
						to="/contact"
						className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
					>
						Contact Us
					</Link>
				</div>

				<PaymentModal />
			</div>
		</div>
	);
};

export default Pricing;
