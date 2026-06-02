export const LogLevel = {
	ERROR: 'ERROR',
	WARN: 'WARN',
	INFO: 'INFO',
	DEBUG: 'DEBUG',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

interface LogContext {
	component?: string;
	action?: string;
	userId?: string;
	url?: string;
	method?: string;
	statusCode?: number;
	duration?: number;
	error?: string | {
		name: string;
		message: string;
		stack?: string;
	};
	[key: string]: any;
}

class ClientLogger {
	private isDevelopment = import.meta.env.DEV;

	private formatTimestamp(): string {
		return new Date().toISOString();
	}

	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = this.formatTimestamp();
		const contextStr = context ? ` | Context: ${JSON.stringify(context, null, 2)}` : '';
		return `[${timestamp}] [${level}] ${message}${contextStr}`;
	}

	private log(level: LogLevel, message: string, context?: LogContext): void {
		// Only log in development or for errors
		if (!this.isDevelopment && level !== LogLevel.ERROR) return;

		const formattedMessage = this.formatMessage(level, message, context);
		
		switch (level) {
			case LogLevel.ERROR:
				console.error(formattedMessage);
				break;
			case LogLevel.WARN:
				console.warn(formattedMessage);
				break;
			case LogLevel.INFO:
				console.info(formattedMessage);
				break;
			case LogLevel.DEBUG:
				console.debug(formattedMessage);
				break;
		}
	}

	error(message: string, context?: LogContext): void {
		this.log(LogLevel.ERROR, message, context);
	}

	warn(message: string, context?: LogContext): void {
		this.log(LogLevel.WARN, message, context);
	}

	info(message: string, context?: LogContext): void {
		this.log(LogLevel.INFO, message, context);
	}

	debug(message: string, context?: LogContext): void {
		this.log(LogLevel.DEBUG, message, context);
	}

	// Store action logging
	logStoreAction(storeName: string, action: string, success: boolean, context?: LogContext): void {
		const storeContext: LogContext = {
			...context,
			store: storeName,
			action,
			success,
		};

		const level = success ? LogLevel.INFO : LogLevel.ERROR;
		this.log(level, `Store action ${success ? 'completed' : 'failed'}: ${storeName}.${action}`, storeContext);
	}

	// API request logging
	logApiRequest(method: string, url: string, context?: LogContext): void {
		const apiContext: LogContext = {
			...context,
			method,
			url,
			type: 'API_REQUEST',
		};

		this.info(`API request initiated: ${method} ${url}`, apiContext);
	}

	logApiResponse(method: string, url: string, statusCode: number, duration: number, context?: LogContext): void {
		const apiContext: LogContext = {
			...context,
			method,
			url,
			statusCode,
			duration,
			type: 'API_RESPONSE',
		};

		const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
		this.log(level, `API response received: ${method} ${url} (${statusCode})`, apiContext);
	}

	// Component lifecycle logging
	logComponentMount(componentName: string, context?: LogContext): void {
		const componentContext: LogContext = {
			...context,
			component: componentName,
			lifecycle: 'MOUNT',
		};

		this.debug(`Component mounted: ${componentName}`, componentContext);
	}

	logComponentUnmount(componentName: string, context?: LogContext): void {
		const componentContext: LogContext = {
			...context,
			component: componentName,
			lifecycle: 'UNMOUNT',
		};

		this.debug(`Component unmounted: ${componentName}`, componentContext);
	}

	// Error boundary logging
	logComponentError(componentName: string, error: Error, errorInfo?: any, context?: LogContext): void {
		const errorContext: LogContext = {
			...context,
			component: componentName,
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			errorInfo,
		};

		this.error(`Component error in ${componentName}: ${error.message}`, errorContext);
	}

	// User interaction logging
	logUserAction(action: string, component: string, context?: LogContext): void {
		const userContext: LogContext = {
			...context,
			component,
			action,
			type: 'USER_ACTION',
		};

		this.info(`User action: ${action} in ${component}`, userContext);
	}

	// Navigation logging
	logNavigation(from: string, to: string, context?: LogContext): void {
		const navContext: LogContext = {
			...context,
			from,
			to,
			type: 'NAVIGATION',
		};

		this.info(`Navigation: ${from} -> ${to}`, navContext);
	}

	// Modal logging
	logModalAction(modalName: string, action: 'OPEN' | 'CLOSE', context?: LogContext): void {
		const modalContext: LogContext = {
			...context,
			modal: modalName,
			action,
			type: 'MODAL_ACTION',
		};

		this.info(`Modal ${action.toLowerCase()}: ${modalName}`, modalContext);
	}

	// State change logging
	logStateChange(storeName: string, field: string, oldValue: any, newValue: any, context?: LogContext): void {
		const stateContext: LogContext = {
			...context,
			store: storeName,
			field,
			oldValue: this.sanitizeValue(oldValue),
			newValue: this.sanitizeValue(newValue),
			type: 'STATE_CHANGE',
		};

		this.debug(`State change in ${storeName}: ${field}`, stateContext);
	}

	private sanitizeValue(value: any): any {
		if (value === null || value === undefined) return value;
		if (typeof value === 'string' && value.length > 100) {
			return value.substring(0, 100) + '...';
		}
		if (Array.isArray(value) && value.length > 5) {
			return `[Array with ${value.length} items]`;
		}
		if (typeof value === 'object' && Object.keys(value).length > 10) {
			return `[Object with ${Object.keys(value).length} keys]`;
		}
		return value;
	}
}

// Create singleton instance
export const logger = new ClientLogger();

export default logger;