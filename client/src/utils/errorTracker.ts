import { logger } from './logger';

export interface ApiErrorDetails {
	url: string;
	method: string;
	statusCode?: number;
	responseData?: any;
	requestData?: any;
	duration?: number;
	userAgent?: string;
	timestamp: string;
}

export interface ComponentErrorDetails {
	componentName: string;
	errorMessage: string;
	errorStack?: string;
	props?: any;
	state?: any;
	timestamp: string;
}

class ErrorTracker {
	private errors: (ApiErrorDetails | ComponentErrorDetails)[] = [];
	private maxErrors = 100; // Keep last 100 errors

	// Track API errors
	trackApiError(details: Omit<ApiErrorDetails, 'timestamp'>): void {
		const errorDetails: ApiErrorDetails = {
			...details,
			timestamp: new Date().toISOString(),
		};

		this.addError(errorDetails);
		
		logger.error('API Error tracked', {
			url: details.url,
			method: details.method,
			statusCode: details.statusCode,
			error: details.responseData?.message || 'Unknown API error'
		});
	}

	// Track component errors
	trackComponentError(details: Omit<ComponentErrorDetails, 'timestamp'>): void {
		const errorDetails: ComponentErrorDetails = {
			...details,
			timestamp: new Date().toISOString(),
		};

		this.addError(errorDetails);
		
		logger.error('Component Error tracked', {
			component: details.componentName,
			error: details.errorMessage
		});
	}

	// Track network errors
	trackNetworkError(url: string, method: string, error: Error): void {
		this.trackApiError({
			url,
			method,
			statusCode: 0,
			responseData: { message: error.message, type: 'NetworkError' },
			duration: 0,
		});
	}

	// Track timeout errors
	trackTimeoutError(url: string, method: string, timeout: number): void {
		this.trackApiError({
			url,
			method,
			statusCode: 408,
			responseData: { message: `Request timeout after ${timeout}ms`, type: 'TimeoutError' },
			duration: timeout,
		});
	}

	// Get recent errors
	getRecentErrors(count = 10): (ApiErrorDetails | ComponentErrorDetails)[] {
		return this.errors.slice(-count);
	}

	// Get errors by type
	getApiErrors(): ApiErrorDetails[] {
		return this.errors.filter((error): error is ApiErrorDetails => 
			'url' in error
		);
	}

	getComponentErrors(): ComponentErrorDetails[] {
		return this.errors.filter((error): error is ComponentErrorDetails => 
			'componentName' in error
		);
	}

	// Get error statistics
	getErrorStats(): {
		total: number;
		apiErrors: number;
		componentErrors: number;
		last24Hours: number;
		mostCommonApiErrors: { url: string; count: number }[];
		mostCommonComponentErrors: { component: string; count: number }[];
	} {
		const now = new Date();
		const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		
		const apiErrors = this.getApiErrors();
		const componentErrors = this.getComponentErrors();
		
		const recent = this.errors.filter(error => 
			new Date(error.timestamp) > last24Hours
		);

		// Count API errors by URL
		const apiErrorCounts = apiErrors.reduce((acc, error) => {
			acc[error.url] = (acc[error.url] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Count component errors by component name
		const componentErrorCounts = componentErrors.reduce((acc, error) => {
			acc[error.componentName] = (acc[error.componentName] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return {
			total: this.errors.length,
			apiErrors: apiErrors.length,
			componentErrors: componentErrors.length,
			last24Hours: recent.length,
			mostCommonApiErrors: Object.entries(apiErrorCounts)
				.map(([url, count]) => ({ url, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5),
			mostCommonComponentErrors: Object.entries(componentErrorCounts)
				.map(([component, count]) => ({ component, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5),
		};
	}

	// Clear old errors
	clearErrors(): void {
		this.errors = [];
		logger.info('Error tracker cleared');
	}

	// Export errors for debugging
	exportErrors(): string {
		return JSON.stringify({
			errors: this.errors,
			stats: this.getErrorStats(),
			exportedAt: new Date().toISOString(),
		}, null, 2);
	}

	private addError(error: ApiErrorDetails | ComponentErrorDetails): void {
		this.errors.push(error);
		
		// Keep only the most recent errors
		if (this.errors.length > this.maxErrors) {
			this.errors = this.errors.slice(-this.maxErrors);
		}
	}
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
	logger.error('Unhandled promise rejection', {
		reason: event.reason,
		promise: event.promise
	});
	
	if (event.reason instanceof Error) {
		errorTracker.trackComponentError({
			componentName: 'Global',
			errorMessage: event.reason.message,
			errorStack: event.reason.stack,
		});
	}
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
	logger.error('Uncaught error', {
		message: event.message,
		filename: event.filename,
		lineno: event.lineno,
		colno: event.colno,
		error: event.error
	});
	
	errorTracker.trackComponentError({
		componentName: 'Global',
		errorMessage: event.message,
		errorStack: event.error?.stack,
	});
});

export default errorTracker;