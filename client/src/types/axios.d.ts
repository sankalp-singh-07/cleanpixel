import 'axios';

declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		metadata?: {
			startTime: number;
		};
	}

	export interface AxiosRequestConfig {
		metadata?: {
			startTime: number;
		};
	}
}
