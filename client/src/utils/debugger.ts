import { logger } from './logger';
import { errorTracker } from './errorTracker';
import { useFolderStore } from '@/store/folderStore';
import { useBackgroundStore } from '@/store/backgroundStore';
import { useAuthStore } from '@/store/authStore';

interface DebugInfo {
	timestamp: string;
	url: string;
	userAgent: string;
	stores: {
		folder: any;
		background: any;
		auth: any;
	};
	errors: {
		recent: any[];
		stats: any;
	};
	localStorage: Record<string, any>;
	sessionStorage: Record<string, any>;
}

class Debugger {
	// Get comprehensive debug information
	getDebugInfo(): DebugInfo {
		const folderStore = useFolderStore.getState();
		const backgroundStore = useBackgroundStore.getState();
		const authStore = useAuthStore.getState();

		return {
			timestamp: new Date().toISOString(),
			url: window.location.href,
			userAgent: navigator.userAgent,
			stores: {
				folder: {
					folders: folderStore.folders.length,
					currentFolder: folderStore.currentFolder ? {
						id: folderStore.currentFolder.id,
						name: folderStore.currentFolder.name,
						imageCount: folderStore.currentFolder._count?.images || 0,
						isPublic: folderStore.currentFolder.isPublic,
					} : null,
					loading: folderStore.loading,
					error: folderStore.error,
				},
				background: {
					backgrounds: backgroundStore.backgrounds.length,
					loading: backgroundStore.loading,
					applying: backgroundStore.applying,
					error: backgroundStore.error,
				},
				auth: {
					isAuthenticated: !!authStore.accessToken,
					user: authStore.user ? {
						id: authStore.user.id,
						username: authStore.user.username,
						email: authStore.user.email,
					} : null,
				},
			},
			errors: {
				recent: errorTracker.getRecentErrors(20),
				stats: errorTracker.getErrorStats(),
			},
			localStorage: this.getStorageData('localStorage'),
			sessionStorage: this.getStorageData('sessionStorage'),
		};
	}

	// Export debug info as downloadable file
	exportDebugInfo(): void {
		const debugInfo = this.getDebugInfo();
		const blob = new Blob([JSON.stringify(debugInfo, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `cleanpixel-debug-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		logger.info('Debug info exported', { timestamp: debugInfo.timestamp });
	}

	// Log current state to console
	logCurrentState(): void {
		const debugInfo = this.getDebugInfo();
		console.group('🐛 CleanPixel Debug Info');
		console.log('Timestamp:', debugInfo.timestamp);
		console.log('URL:', debugInfo.url);
		console.group('📦 Store States');
		console.log('Folder Store:', debugInfo.stores.folder);
		console.log('Background Store:', debugInfo.stores.background);
		console.log('Auth Store:', debugInfo.stores.auth);
		console.groupEnd();
		console.group('❌ Error Information');
		console.log('Recent Errors:', debugInfo.errors.recent);
		console.log('Error Stats:', debugInfo.errors.stats);
		console.groupEnd();
		console.group('💾 Storage');
		console.log('localStorage:', debugInfo.localStorage);
		console.log('sessionStorage:', debugInfo.sessionStorage);
		console.groupEnd();
		console.groupEnd();

		logger.info('Debug state logged to console');
	}

	// Clear all errors and reset stores
	resetDebugState(): void {
		errorTracker.clearErrors();
		
		// Clear store errors
		useFolderStore.getState().clearError();
		useBackgroundStore.getState().clearError();

		logger.info('Debug state reset');
		console.log('🔄 Debug state has been reset');
	}

	// Test API endpoints
	async testApiEndpoints(): Promise<void> {
		logger.info('Starting API endpoint tests');
		console.group('🧪 API Endpoint Tests');

		const tests = [
			{
				name: 'Folders List',
				test: () => useFolderStore.getState().fetchFolders(),
			},
			{
				name: 'Background Presets',
				test: () => useBackgroundStore.getState().fetchBackgrounds(),
			},
		];

		for (const { name, test } of tests) {
			try {
				console.log(`Testing ${name}...`);
				await test();
				console.log(`✅ ${name} - Success`);
			} catch (error) {
				console.error(`❌ ${name} - Failed:`, error);
			}
		}

		console.groupEnd();
		logger.info('API endpoint tests completed');
	}

	// Monitor store changes
	monitorStoreChanges(): () => void {
		logger.info('Starting store monitoring');
		console.log('👀 Monitoring store changes...');

		const unsubscribeFolders = useFolderStore.subscribe((state, prevState) => {
			if (state.loading !== prevState.loading) {
				console.log('📁 Folder Store - Loading:', state.loading);
			}
			if (state.error !== prevState.error) {
				console.log('📁 Folder Store - Error:', state.error);
			}
			if (state.folders.length !== prevState.folders.length) {
				console.log('📁 Folder Store - Folders count:', state.folders.length);
			}
		});

		const unsubscribeBackground = useBackgroundStore.subscribe((state, prevState) => {
			if (state.loading !== prevState.loading) {
				console.log('🎨 Background Store - Loading:', state.loading);
			}
			if (state.applying !== prevState.applying) {
				console.log('🎨 Background Store - Applying:', state.applying);
			}
			if (state.error !== prevState.error) {
				console.log('🎨 Background Store - Error:', state.error);
			}
		});

		return () => {
			unsubscribeFolders();
			unsubscribeBackground();
			console.log('🛑 Store monitoring stopped');
			logger.info('Store monitoring stopped');
		};
	}

	private getStorageData(storageType: 'localStorage' | 'sessionStorage'): Record<string, any> {
		const storage = window[storageType];
		const data: Record<string, any> = {};
		
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			if (key) {
				try {
					data[key] = JSON.parse(storage.getItem(key) || '');
				} catch {
					data[key] = storage.getItem(key);
				}
			}
		}
		
		return data;
	}
}

// Create singleton instance
export const appDebugger = new Debugger();

// Make debugger available globally in development
if (import.meta.env.DEV) {
	(window as any).cleanPixelDebugger = appDebugger;
	console.log('🐛 CleanPixel Debugger available at window.cleanPixelDebugger');
	console.log('Available methods:');
	console.log('  - logCurrentState(): Log current app state');
	console.log('  - exportDebugInfo(): Download debug info as JSON');
	console.log('  - resetDebugState(): Clear errors and reset stores');
	console.log('  - testApiEndpoints(): Test API connectivity');
	console.log('  - monitorStoreChanges(): Monitor store state changes');
}

export default appDebugger;