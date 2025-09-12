import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, removeImage } from '@/api/image';
import { showToast } from './Toast';
import { useCreditStore } from '@/store/creditStore';

type Stage = 'idle' | 'uploading' | 'removing' | 'done' | 'error';

export default function UploadWidget() {
	const [stage, setStage] = useState<Stage>('idle');
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [wasCanceled, setWasCanceled] = useState(false);

	const [originalUrl, setOriginalUrl] = useState<string | null>(null);
	const [processedUrl, setProcessedUrl] = useState<string | null>(null);
	const [imageId, setImageId] = useState<string | null>(null);

	const abortRef = useRef<AbortController | null>(null);

	const { credits, loading: creditsLoading } = useCreditStore();
	const setCredits = useCreditStore((s) => s.setFromServer);
	const refetchCredits = useCreditStore((s) => s.get);

	const navigate = useNavigate();
	const redirectToPricing = useCallback(() => {
		showToast('You are out of credits.', 'warning');
		navigate('/pricing');
	}, [navigate]);

	const resetAll = useCallback(() => {
		abortRef.current?.abort();
		if (preview) URL.revokeObjectURL(preview);
		setStage('idle');
		setFile(null);
		setPreview(null);
		setProgress(0);
		setError(null);
		setWasCanceled(false);
		setOriginalUrl(null);
		setProcessedUrl(null);
		setImageId(null);
	}, [preview]);

	const removeSelected = useCallback(() => {
		if (preview) URL.revokeObjectURL(preview);
		setFile(null);
		setPreview(null);
		setError(null);
		setWasCanceled(false);
	}, [preview]);

	const onFiles = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;

			if (!creditsLoading && (credits ?? 0) <= 0) {
				redirectToPricing();
				return;
			}

			const f = files[0];
			if (!f.type.startsWith('image/')) {
				setError('Please select an image file (PNG/JPG/WebP).');
				return;
			}

			setError(null);
			setWasCanceled(false);
			if (preview) URL.revokeObjectURL(preview);
			setFile(f);
			setPreview(URL.createObjectURL(f));
			setOriginalUrl(null);
			setProcessedUrl(null);
			setImageId(null);
			setProgress(0);
		},
		[credits, creditsLoading, redirectToPricing, preview]
	);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			onFiles(e.dataTransfer.files);
		},
		[onFiles]
	);

	const handleCancel = useCallback(() => {
		setWasCanceled(true);
		abortRef.current?.abort();
	}, []);

	const processImage = useCallback(async () => {
		if (!file) return;

		if (!creditsLoading && (credits ?? 0) <= 0) {
			setStage('error');
			setError('Insufficient credits.');
			redirectToPricing();
			return;
		}

		setError(null);
		setWasCanceled(false);
		setProgress(0);
		setStage('uploading');

		abortRef.current = new AbortController();
		const { signal } = abortRef.current;

		try {
			const uploaded = await uploadImage(file, {
				onProgress: setProgress,
				signal,
			});
			if (signal.aborted) return;

			setOriginalUrl(uploaded.imageUrl || null);
			setImageId(uploaded.imageId || null);

			setStage('removing');
			const removed = await removeImage(uploaded.imageId, { signal });
			if (signal.aborted) return;

			setProcessedUrl(removed.imageUrl || null);

			if (typeof removed.credits === 'number') {
				setCredits(removed.credits);
			} else {
				refetchCredits();
			}

			setStage('done');
		} catch (e: any) {
			const canceled =
				e?.name === 'CanceledError' ||
				e?.code === 'ERR_CANCELED' ||
				e?.message === 'canceled' ||
				e?.name === 'AbortError' ||
				abortRef.current?.signal?.aborted;

			if (canceled) {
				setWasCanceled(true);
				setError('You canceled the operation.');
				setStage('error');
				return;
			}

			const status = e?.response?.status;
			if (status === 402) {
				setCredits(0);
				setWasCanceled(false);
				setError('Insufficient credits.');
				setStage('error');
				redirectToPricing();
				return;
			}

			if (status === 429) {
				showToast('Too many requests.', 'warning');
			}

			setWasCanceled(false);
			setError('Something went wrong.');
			setStage('error');
		}
	}, [
		file,
		credits,
		creditsLoading,
		redirectToPricing,
		setCredits,
		refetchCredits,
	]);

	const canStart = useMemo(() => !!file && stage === 'idle', [file, stage]);

	return (
		<div className="mx-auto max-w-5xl w-full py-8 px-4 sm:px-6 md:px-8">
			{stage === 'idle' && (
				<div
					onDragOver={(e) => e.preventDefault()}
					onDrop={onDrop}
					className="rounded-xl border-2 border-dashed p-6 text-center bg-background/40"
				>
					<h2 className="text-xl font-semibold mb-2">File Upload</h2>
					<p className="text-sm text-foreground/70 mb-4">
						Select and upload your file.
					</p>

					<div className="h-48 grid place-content-center rounded-lg border border-foreground/20 bg-background">
						<p className="text-sm text-foreground/70">
							Drag files to upload
						</p>
						<p className="text-xs text-foreground/50 my-2">or</p>
						<label className="inline-block">
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(e) => onFiles(e.target.files)}
							/>
							<span className="cursor-pointer rounded-md bg-primary text-white px-4 py-2 inline-block">
								Browse file
							</span>
						</label>
					</div>

					{error && (
						<p className="mt-3 text-sm text-red-600">{error}</p>
					)}

					{preview && (
						<div className="mt-4">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs text-foreground/60">
									Selected preview:
								</p>
								<button
									onClick={removeSelected}
									className="text-xs px-2 py-1 border rounded-md"
									title="Remove selected image"
								>
									Remove
								</button>
							</div>
							<img
								src={preview}
								alt="preview"
								className="max-h-40 rounded-md border mx-auto"
							/>
						</div>
					)}

					<button
						disabled={!canStart}
						onClick={processImage}
						className="mt-4 rounded-full px-5 py-2 bg-primary text-white disabled:opacity-50"
					>
						Start
					</button>
				</div>
			)}

			{(stage === 'uploading' ||
				stage === 'removing' ||
				stage === 'error') && (
				<div className="rounded-xl border p-6 min-h-[16rem] bg-background/40">
					<h2 className="text-xl font-semibold mb-2">
						{stage === 'error'
							? wasCanceled
								? 'Canceled by you'
								: 'Something went wrong'
							: 'Processing…'}
					</h2>
					<p className="text-sm text-foreground/70 mb-4">
						{stage === 'error'
							? wasCanceled
								? 'You canceled the operation. You can Start over or Try again.'
								: 'Please try again.'
							: 'It may take a while. Please wait.'}
					</p>

					{stage === 'uploading' && (
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm truncate">
									{file?.name}
								</span>
								<span className="text-xs">{progress}%</span>
							</div>
							<div className="h-2 rounded bg-foreground/10 overflow-hidden">
								<div
									className="h-full bg-foreground transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="flex gap-2">
								<button
									onClick={handleCancel}
									className="px-3 py-1 text-sm border rounded-md"
								>
									Cancel
								</button>
							</div>
						</div>
					)}

					{stage === 'removing' && (
						<div className="space-y-2">
							<div className="text-sm">Removing background…</div>
							<div className="h-2 rounded bg-foreground/10 overflow-hidden">
								<div className="h-full bg-foreground animate-pulse w-2/3" />
							</div>
							<div className="flex gap-2 mt-3">
								<button
									onClick={handleCancel}
									className="px-3 py-1 text-sm border rounded-md"
								>
									Cancel
								</button>
							</div>
						</div>
					)}

					{stage === 'error' && (
						<div className="space-y-3">
							<div
								className={`text-sm ${
									wasCanceled
										? 'text-foreground/80'
										: 'text-red-600'
								}`}
							>
								{error}
							</div>
							<div className="flex gap-2">
								<button
									onClick={processImage}
									className="px-4 py-2 text-sm rounded-md border"
								>
									Try again
								</button>
								<button
									onClick={resetAll}
									className="px-4 py-2 text-sm rounded-md border"
								>
									Start over
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{stage === 'done' && (
				<div className="mt-6 rounded-xl border p-6 bg-background/40">
					<h2 className="text-xl font-semibold mb-4">Result</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="rounded-lg border p-3">
							<div className="text-sm mb-2">Original</div>
							{originalUrl && (
								<img
									src={originalUrl}
									alt="original"
									className="rounded-md"
								/>
							)}
							<div className="mt-3 flex flex-wrap gap-2">
								{originalUrl && (
									<>
										<a
											href={originalUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="px-3 py-2 text-sm border rounded-md"
										>
											Open in new tab
										</a>
										<button
											onClick={() =>
												downloadFromUrl(originalUrl)
											}
											className="px-3 py-2 text-sm border rounded-md"
										>
											Download
										</button>
									</>
								)}
							</div>
						</div>

						<div className="rounded-lg border p-3">
							<div className="text-sm mb-2">
								Background removed
							</div>
							{processedUrl && (
								<img
									src={processedUrl}
									alt="processed"
									className="rounded-md"
								/>
							)}
							<div className="mt-3 flex flex-wrap gap-2">
								{processedUrl && (
									<>
										<a
											href={processedUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="px-3 py-2 text-sm border rounded-md"
										>
											Open in new tab
										</a>
										<button
											onClick={() =>
												downloadFromUrl(processedUrl)
											}
											className="px-3 py-2 text-sm border rounded-md"
										>
											Download
										</button>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="mt-6 flex flex-wrap gap-3">
						<button
							onClick={resetAll}
							className="px-4 py-2 border rounded-md"
						>
							Try again
						</button>
						{imageId && (
							<a
								href={`/gallery?highlight=${encodeURIComponent(
									imageId
								)}`}
								className="px-4 py-2 border rounded-md"
							>
								See in gallery
							</a>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

const downloadFromUrl = (url: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', 'file');
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
