import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
	ArrowLeft,
	Download,
	Lock,
	User,
	Copy,
	Check,
	Share2,
	Calendar,
	Image as ImageIcon,
	Loader2,
} from 'lucide-react';
import api from '@/api';
import { toast } from 'react-toastify';

type OwnerInfo = {
	username: string;
	name: string;
	avatarUrl: string | null;
	publicProfile: boolean;
};

type ImageDetailData = {
	id: string;
	userId: string;
	originalUrl: string;
	removedBgUrl: string | null;
	replacedUrl: string | null;
	isPublic: boolean;
	type: string | null;
	createdAt: string;
	user: OwnerInfo;
};

const ImageDetail = () => {
	const { imageId } = useParams<{ imageId: string }>();
	const [image, setImage] = useState<ImageDetailData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'original' | 'removed' | 'replaced'>('original');
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const fetchImageDetails = async () => {
			if (!imageId) return;
			setLoading(true);
			setError(null);
			try {
				const { data } = await api.get<{ success: boolean; data: ImageDetailData }>(
					`/images/${imageId}`
				);
				setImage(data.data);
				// Default to replaced if available, then removed, then original
				if (data.data.replacedUrl) {
					setViewMode('replaced');
				} else if (data.data.removedBgUrl) {
					setViewMode('removed');
				} else {
					setViewMode('original');
				}
			} catch (err: any) {
				console.error('Failed to fetch image detail:', err);
				if (err.response?.status === 403) {
					setError('private');
				} else if (err.response?.status === 404) {
					setError('not_found');
				} else {
					setError(err.response?.data?.message || 'Failed to load image');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchImageDetails();
	}, [imageId]);

	const handleCopyUrl = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			toast.success('Link copied to clipboard!');
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error('Failed to copy link');
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex flex-col items-center justify-center">
				<Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
				<p className="text-foreground/60 text-sm font-medium animate-pulse">Loading image details...</p>
			</div>
		);
	}

	if (error === 'private') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="max-w-md w-full text-center bg-secondary/30 backdrop-blur-md border border-border/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
					<div className="relative z-10">
						<div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20 shadow-lg shadow-orange-500/5 group-hover:scale-105 transition-transform duration-300">
							<Lock className="w-10 h-10 text-orange-500" />
						</div>
						<h2 className="text-2xl font-bold text-foreground mb-3">
							Private Image
						</h2>
						<p className="text-foreground/60 mb-8 leading-relaxed text-sm">
							This image has been set to private by the owner. Only the owner can view or access this link.
						</p>
						<Link
							to="/"
							className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg shadow-primary/20"
						>
							<ArrowLeft className="w-4 h-4" />
							Go back Home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (error === 'not_found' || !image) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="max-w-md w-full text-center bg-secondary/30 backdrop-blur-md border border-border/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
					<div className="relative z-10">
						<div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/5 group-hover:scale-105 transition-transform duration-300">
							<ImageIcon className="w-10 h-10 text-red-500" />
						</div>
						<h2 className="text-2xl font-bold text-foreground mb-3">
							Image Not Found
						</h2>
						<p className="text-foreground/60 mb-8 leading-relaxed text-sm">
							The image you are looking for does not exist, or has been deleted.
						</p>
						<Link
							to="/"
							className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg shadow-primary/20"
						>
							<ArrowLeft className="w-4 h-4" />
							Go back Home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const hasRemovedBg = !!image.removedBgUrl;
	const hasReplacedBg = !!image.replacedUrl;

	const currentImageUrl =
		viewMode === 'replaced' && hasReplacedBg
			? image.replacedUrl!
			: viewMode === 'removed' && hasRemovedBg
			? image.removedBgUrl!
			: image.originalUrl;

	const viewLabels = {
		original: 'Original Image',
		removed: 'Background Removed',
		replaced: 'Background Replaced',
	};

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Top Navigation */}
				<div className="flex items-center justify-between mb-8">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-foreground/65 hover:text-primary transition-colors bg-secondary/50 border border-border/50 px-4 py-2 rounded-full backdrop-blur-sm"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>
					<span
						className={`text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm border ${
							image.isPublic
								? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
								: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
						}`}
					>
						{image.isPublic ? 'Public Image' : 'Private View (Owner)'}
					</span>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Image Preview Container */}
					<div className="lg:col-span-7 flex flex-col gap-4">
						<div className="relative bg-secondary/35 backdrop-blur-md border border-border/50 rounded-3xl p-4 shadow-2xl flex items-center justify-center overflow-hidden aspect-[4/5] group">
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-40" />
							<div
								className={`w-full h-full rounded-2xl overflow-hidden flex items-center justify-center relative ${
									viewMode !== 'original' ? "bg-[url('/checker.svg')] bg-repeat" : 'bg-black/5'
								}`}
							>
								<img
									src={currentImageUrl}
									alt="Shared Art"
									className="max-h-full max-w-full object-contain rounded-xl transition-all duration-300"
								/>
							</div>
						</div>

						{/* Version Toggles if multiple exist */}
						{(hasRemovedBg || hasReplacedBg) && (
							<div className="flex justify-center p-1.5 bg-secondary/40 border border-border/50 rounded-full backdrop-blur-sm shadow-md">
								<button
									onClick={() => setViewMode('original')}
									className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
										viewMode === 'original'
											? 'bg-primary text-white shadow-sm'
											: 'text-foreground/60 hover:text-foreground hover:bg-secondary/60'
									}`}
								>
									Original
								</button>
								{hasRemovedBg && (
									<button
										onClick={() => setViewMode('removed')}
										className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
											viewMode === 'removed'
												? 'bg-primary text-white shadow-sm'
												: 'text-foreground/60 hover:text-foreground hover:bg-secondary/60'
									}`}
								>
									No Background
								</button>
								)}
								{hasReplacedBg && (
									<button
										onClick={() => setViewMode('replaced')}
										className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
											viewMode === 'replaced'
												? 'bg-primary text-white shadow-sm'
												: 'text-foreground/60 hover:text-foreground hover:bg-secondary/60'
									}`}
								>
									Custom BG
								</button>
								)}
							</div>
						)}
					</div>

					{/* Metadata and Actions */}
					<div className="lg:col-span-5 space-y-6">
						<div className="bg-secondary/30 border border-border/50 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl">
							<span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2">
								{viewLabels[viewMode]}
							</span>
							<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
								Shared AI Design
							</h1>

							{/* Actions */}
							<div className="flex flex-col sm:flex-row gap-3 my-6">
								<a
									href={currentImageUrl}
									download
									className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.01]"
								>
									<Download className="w-5 h-5" />
									Download Image
								</a>
								<button
									onClick={handleCopyUrl}
									className="inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-2xl font-semibold transition-all hover:scale-[1.01]"
								>
									{copied ? (
										<Check className="w-5 h-5 text-green-500 animate-bounce" />
									) : (
										<Copy className="w-5 h-5 text-foreground/60" />
									)}
									{copied ? 'Copied Link!' : 'Share URL'}
								</button>
							</div>

							<hr className="border-border/60 my-6" />

							{/* Creator details */}
							{image.user.publicProfile ? (
								<Link
									to={`/u/${image.user.username}`}
									className="flex items-center gap-4 p-3 bg-secondary/50 rounded-2xl border border-border/40 hover:border-primary/40 hover:bg-secondary/70 transition-all group/owner"
								>
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/25">
										{image.user.avatarUrl ? (
											<img
												src={image.user.avatarUrl}
												alt={image.user.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="w-6 h-6 text-primary/50" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-foreground truncate group-hover/owner:text-primary transition-colors">
											{image.user.name}
										</p>
										<p className="text-xs text-foreground/60">@{image.user.username}</p>
									</div>
									<Share2 className="w-4 h-4 text-foreground/40 group-hover/owner:text-primary transition-colors mr-1" />
								</Link>
							) : (
								<div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-2xl border border-border/40">
									<div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden">
										<User className="w-6 h-6 text-foreground/35" />
									</div>
									<div>
										<p className="font-semibold text-foreground/80">Anonymous Creator</p>
										<p className="text-xs text-foreground/50">Creator profile is private</p>
									</div>
								</div>
							)}
						</div>

						{/* Info List */}
						<div className="bg-secondary/20 border border-border/40 rounded-3xl p-6 backdrop-blur-md shadow-md space-y-4">
							<h3 className="text-sm font-bold text-foreground/75 uppercase tracking-wide">
								Image Specifications
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
								<div className="flex items-center gap-2.5">
									<Calendar className="w-4 h-4 text-foreground/50" />
									<div>
										<p className="text-xs text-foreground/45">Created on</p>
										<p className="font-medium text-foreground/85">
											{new Date(image.createdAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2.5">
									<ImageIcon className="w-4 h-4 text-foreground/50" />
									<div>
										<p className="text-xs text-foreground/45">Format/Type</p>
										<p className="font-medium text-foreground/85 truncate">
											{image.type || 'Standard Image'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageDetail;
