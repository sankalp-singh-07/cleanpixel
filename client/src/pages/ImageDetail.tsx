import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
	ArrowLeft,
	Download,
	Lock,
	User,
	Copy,
	Check,
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
				if (data.data.replacedUrl) setViewMode('replaced');
				else if (data.data.removedBgUrl) setViewMode('removed');
				else setViewMode('original');
			} catch (err: any) {
				if (err.response?.status === 403) setError('private');
				else if (err.response?.status === 404) setError('not_found');
				else setError('error');
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
			toast.success('Link copied!');
			setTimeout(() => setCopied(false), 2500);
		} catch {
			toast.error('Failed to copy link');
		}
	};

	/* ── Loading ── */
	if (loading) {
		return (
			<div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
				<Loader2 className="w-9 h-9 animate-spin text-primary" />
				<p className="text-sm text-foreground/50">Loading image…</p>
			</div>
		);
	}

	/* ── Private ── */
	if (error === 'private') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center animate-fade-in">
					<Lock className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Private Image
					</h2>
					<p className="text-foreground/60">This image is not public</p>
					<Link
						to="/"
						className="inline-block mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
					>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	/* ── Not found ── */
	if (!image) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center animate-fade-in">
					<ImageIcon className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-foreground mb-2">
						Image Not Found
					</h2>
					<p className="text-foreground/60">This image doesn't exist or has been deleted</p>
					<Link
						to="/"
						className="inline-block mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
					>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	const hasRemovedBg = !!image.removedBgUrl;
	const hasReplacedBg = !!image.replacedUrl;
	const showSwitcher = hasRemovedBg || hasReplacedBg;

	const currentImageUrl =
		viewMode === 'replaced' && hasReplacedBg
			? image.replacedUrl!
			: viewMode === 'removed' && hasRemovedBg
			? image.removedBgUrl!
			: image.originalUrl;

	/* ── Main card ── */
	return (
		<div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center py-12 px-4">
			{/* Outer card wrapper with padding around the image */}
			<div className="w-full max-w-sm bg-secondary border border-border rounded-3xl shadow-2xl overflow-hidden">
				{/* Padded inner wrapper — this gives consistent spacing */}
				<div className="p-4 pb-5 flex flex-col gap-4">

					{/* ── Image container with rounded corners ── */}
					<div
						className={`relative w-full aspect-square rounded-2xl overflow-hidden ${
							viewMode !== 'original'
								? "bg-[url('/checker.svg')] bg-repeat"
								: 'bg-black/5 dark:bg-white/5'
						}`}
					>
						<img
							src={currentImageUrl}
							alt="Shared image"
							className="w-full h-full object-cover transition-all duration-500"
						/>
					</div>

					{/* ── Version switcher (pill bar) ── */}
					{showSwitcher && (
						<div className="flex items-center justify-center gap-1.5 p-1.5 bg-background rounded-xl border border-border">
							<button
								onClick={() => setViewMode('original')}
								className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
									viewMode === 'original'
										? 'bg-primary text-white shadow-sm'
										: 'text-foreground/50 hover:text-foreground hover:bg-secondary'
								}`}
							>
								Original
							</button>
							{hasRemovedBg && (
								<button
									onClick={() => setViewMode('removed')}
									className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
										viewMode === 'removed'
											? 'bg-primary text-white shadow-sm'
											: 'text-foreground/50 hover:text-foreground hover:bg-secondary'
									}`}
								>
									No BG
								</button>
							)}
							{hasReplacedBg && (
								<button
									onClick={() => setViewMode('replaced')}
									className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
										viewMode === 'replaced'
											? 'bg-primary text-white shadow-sm'
											: 'text-foreground/50 hover:text-foreground hover:bg-secondary'
									}`}
								>
									Custom BG
								</button>
							)}
						</div>
					)}

					{/* ── Creator + Meta ── */}
					<div className="flex items-center justify-between">
						{image.user.publicProfile ? (
							<Link
								to={`/u/${image.user.username}`}
								className="flex items-center gap-3 group min-w-0"
							>
								<div className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-primary/40 transition-colors">
									{image.user.avatarUrl ? (
										<img src={image.user.avatarUrl} alt={image.user.name} className="w-full h-full object-cover rounded-full aspect-square" />
									) : (
										<User className="w-4 h-4 text-primary/50" />
									)}
								</div>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5">
										<p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
											{image.user.name}
										</p>
										<span className="inline-flex items-center justify-center w-4 h-4 min-w-[16px] min-h-[16px] bg-green-500 rounded-full flex-shrink-0 p-0.5">
											<Check className="w-1.5 h-1.5 text-white" strokeWidth={4.5} />
										</span>
									</div>
									<p className="text-[11px] text-foreground/40 mt-0.5">@{image.user.username}</p>
								</div>
							</Link>
						) : (
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
									<User className="w-4 h-4 text-foreground/30" />
								</div>
								<div>
									<p className="text-xs font-bold text-foreground leading-tight">Anonymous</p>
									<p className="text-[11px] text-foreground/40 mt-0.5">Private profile</p>
								</div>
							</div>
						)}
						<div className="flex items-center gap-2 text-[11px] text-foreground/40 font-medium flex-shrink-0">
							<Calendar className="w-3 h-3" />
							{new Date(image.createdAt).toLocaleDateString('en-US', {
								month: 'short', day: 'numeric',
							})}
						</div>
					</div>

					{/* ── Divider ── */}
					<div className="h-px bg-border" />

					{/* ── Action buttons ── */}
					<div className="flex flex-col gap-3">
						<a
							href={currentImageUrl}
							download
							className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/15"
						>
							<Download className="w-4.5 h-4.5" />
							Download Image
						</a>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={handleCopyUrl}
								className="inline-flex items-center justify-center gap-2 py-3 bg-background border border-border rounded-2xl text-sm font-semibold text-foreground/65 hover:text-foreground hover:border-foreground/25 transition-all active:scale-[0.98] cursor-pointer"
							>
								{copied ? (
									<>
										<Check className="w-4 h-4 text-green-500" />
										Copied!
									</>
								) : (
									<>
										<Copy className="w-4 h-4" />
										Copy Link
									</>
								)}
							</button>
							<Link
								to="/"
								className="inline-flex items-center justify-center gap-2 py-3 bg-background border border-border rounded-2xl text-sm font-semibold text-foreground/65 hover:text-foreground hover:border-foreground/25 transition-all active:scale-[0.98]"
							>
								<ArrowLeft className="w-4 h-4" />
								Go Back
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageDetail;
