import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	componentName?: string;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const componentName = this.props.componentName || 'Unknown';
		
		logger.logComponentError(componentName, error, errorInfo, {
			componentStack: errorInfo.componentStack,
			errorBoundary: true
		});

		// In production, you might want to send this to an error reporting service
		if (import.meta.env.PROD) {
			// Example: Send to error reporting service
			// errorReportingService.captureException(error, { extra: errorInfo });
		}
	}

	render() {
		if (this.state.hasError) {
			const componentName = this.props.componentName || 'component';
			
			return this.props.fallback || (
				<div className="min-h-[200px] flex items-center justify-center">
					<div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
						<div className="text-red-600 dark:text-red-400 mb-2">
							<svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
							Something went wrong
						</h3>
						<p className="text-red-600 dark:text-red-400 text-sm mb-4">
							An error occurred in the {componentName}. Please try refreshing the page.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;