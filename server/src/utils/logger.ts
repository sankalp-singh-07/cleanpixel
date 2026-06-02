import { Request, Response } from 'express';

export enum LogLevel {
	ERROR = 'ERROR',
	WARN = 'WARN',
	INFO = 'INFO',
	DEBUG = 'DEBUG',
}

interface LogContext {
	userId?: string;
	requestId?: string;
	endpoint?: string;
	method?: string;
	statusCode?: number;
	duration?: number;
	userAgent?: string;
	ip?: string;
	[key: string]: any;
}

class Logger {
	private formatTimestamp(): string {
		return new Date().toISOString();
	}

	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = this.formatTimestamp();
		const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
		return `[${timestamp}] [${level}] ${message}${contextStr}`;
	}

	private log(level: LogLevel, message: string, context?: LogContext): void {
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

	// Request/Response logging helpers
	logRequest(req: Request, message?: string): void {
		const context: LogContext = {
			method: req.method,
			endpoint: req.originalUrl,
			userId: req.userId,
			userAgent: req.get('User-Agent'),
			ip: req.ip || req.connection.remoteAddress,
			body: req.method !== 'GET' ? this.sanitizeBody(req.body) : undefined,
			params: Object.keys(req.params).length > 0 ? req.params : undefined,
			query: Object.keys(req.query).length > 0 ? req.query : undefined,
		};

		this.info(message || `Incoming ${req.method} request`, context);
	}

	logResponse(req: Request, res: Response, duration: number, message?: string): void {
		const context: LogContext = {
			method: req.method,
			endpoint: req.originalUrl,
			userId: req.userId,
			statusCode: res.statusCode,
			duration,
		};

		const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
		this.log(level, message || `Response sent`, context);
	}

	logError(error: Error, req?: Request, context?: LogContext): void {
		const errorContext: LogContext = {
			...context,
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			...(req && {
				method: req.method,
				endpoint: req.originalUrl,
				userId: req.userId,
			}),
		};

		this.error(`Error occurred: ${error.message}`, errorContext);
	}

	logDatabaseOperation(operation: string, table: string, success: boolean, context?: LogContext): void {
		const dbContext: LogContext = {
			...context,
			operation,
			table,
			success,
		};

		if (success) {
			this.info(`Database operation successful: ${operation} on ${table}`, dbContext);
		} else {
			this.error(`Database operation failed: ${operation} on ${table}`, dbContext);
		}
	}

	logApiCall(endpoint: string, method: string, success: boolean, duration?: number, context?: LogContext): void {
		const apiContext: LogContext = {
			...context,
			endpoint,
			method,
			success,
			duration,
		};

		const level = success ? LogLevel.INFO : LogLevel.ERROR;
		this.log(level, `API call ${success ? 'successful' : 'failed'}: ${method} ${endpoint}`, apiContext);
	}

	private sanitizeBody(body: any): any {
		if (!body || typeof body !== 'object') return body;
		
		const sanitized = { ...body };
		const sensitiveFields = ['password', 'token', 'secret', 'key'];
		
		for (const field of sensitiveFields) {
			if (sanitized[field]) {
				sanitized[field] = '[REDACTED]';
			}
		}
		
		return sanitized;
	}
}

// Create singleton instance
export const logger = new Logger();

// Middleware for automatic request/response logging
export const requestLoggingMiddleware = (req: Request, res: Response, next: Function) => {
	const startTime = Date.now();
	
	// Log incoming request
	logger.logRequest(req);
	
	// Override res.json to log response
	const originalJson = res.json;
	res.json = function(body: any) {
		const duration = Date.now() - startTime;
		logger.logResponse(req, res, duration);
		return originalJson.call(this, body);
	};
	
	next();
};

export default logger;