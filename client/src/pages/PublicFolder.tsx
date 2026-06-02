import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Folder, ArrowLeft, Image as ImageIcon, Loader2, Lock } from 'lucide-react';
import { getPublicFolder } from '@/api/folder';
import type { PublicFolderResponse } from '@/types/folderTypes';

const PublicFolder = () => {
	const { username, folderId } = useParams<{ username: string; folderId: string }>();
	const [data, setData] = useState<PublicFolderResponse['data'] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const fetchFolder = async () => {
			if (!username || !folderId) return;
			setLoading(true);
			setError(null);
			try {
				const result = await getPublicFolder(username, folderId, page);
				setData(result);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Folder not found');
			} finally {
				setLoading(false);
			}
		};
		fetchFolder();
	}, [username, folderId, page]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
					<p className="text-foreground/60">Loading folder...</p>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					{error?.includes('private') ? (
						<>
							<Lock className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Private Folder
							</h2>
							<p className="text-foreground/60">This folder is not public</p>
						</>
					) : (
						<>
							<Folder className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Folder Not Found
							</h2>
							<p className="text-foreground/60">{error}</p>
						</>
					)}
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

	const { folder, owner, images, pagination } = data;

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<Link
						to={`/u/${username}`}
						className="p-2 rounded-full hover:bg-secondary transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-foreground" />
					</Link>
					<div className="flex-1">
						<h1 className="text-2xl md:text-3xl font-bold text-foreground">
							{folder.name}
						</h1>
						{folder.description && (
							<p className="text-foreground/60 mt-1">{folder.description}</p>
						)}
					</div>
				</div>

				{/* Owner Card */}
				<Link
					to={`/u/${username}`}
					className="inline-flex items-center gap-3 p-3 bg-secondary rounded-xl mb-8 hover:bg-secondary/80 transition-colors"
				>
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
						{owner.avatarUrl ? (
							<img
								src={owner.avatarUrl}
								alt={owner.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<User className="w-5 h-5 text-primary/50" />
						)}
					</div>
					<div>
						<p className="font-medium text-foreground">{owner.name}</p>
						<p className="text-sm text-foreground/60">@{username}</p>
					</div>
				</Link>

				{/* Images Grid */}
				{images.length === 0 ? (
					<div className="text-center py-16">
						<ImageIcon className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
						<p className="text-foreground/60">No public images in this folder</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
							{images.map((image) => (
								<div
									key={image.id}
									className="bg-secondary rounded-2xl overflow-hidden border border-border group"
								>
									<div className="aspect-[3/4] overflow-hidden">
										<img
											src={image.replacedUrl || image.removedBgUrl || image.originalUrl}
											alt="Gallery"
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
									<div className="p-3 flex items-center justify-between">
										<span className="text-xs text-foreground/60">
											{new Date(image.createdAt).toLocaleDateString('en-GB', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											})}
										</span>
										<a
											href={image.replacedUrl || image.removedBgUrl || image.originalUrl}
											download
											className="text-xs text-primary hover:underline"
										>
											Download
										</a>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{pagination.pages > 1 && (
							<div className="flex justify-center items-center gap-4">
								<button
									disabled={page <= 1}
									onClick={() => setPage(page - 1)}
									className={`px-6 py-2 rounded-full font-medium transition-all ${
										page <= 1
											? 'bg-secondary text-foreground/40 cursor-not-allowed'
											: 'bg-primary text-white hover:bg-primary/90'
									}`}
								>
									Previous
								</button>
								<span className="px-4 py-2 bg-secondary text-foreground rounded-full">
									{page} / {pagination.pages}
								</span>
								<button
									disabled={page >= pagination.pages}
									onClick={() => setPage(page + 1)}
									className={`px-6 py-2 rounded-full font-medium transition-all ${
										page >= pagination.pages
											? 'bg-secondary text-foreground/40 cursor-not-allowed'
											: 'bg-primary text-white hover:bg-primary/90'
									}`}
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default PublicFolder;
