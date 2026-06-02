import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Folder, Image as ImageIcon, Loader2, Lock } from 'lucide-react';
import { getPublicProfile } from '@/api/profile';
import type { PublicProfile as PublicProfileType } from '@/types/profileTypes';

const PublicProfile = () => {
	const { username } = useParams<{ username: string }>();
	const [profile, setProfile] = useState<PublicProfileType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'folders' | 'images'>('folders');

	useEffect(() => {
		const fetchProfile = async () => {
			if (!username) return;
			setLoading(true);
			setError(null);
			try {
				const data = await getPublicProfile(username);
				setProfile(data);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Profile not found');
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, [username]);

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
					<p className="text-foreground/60">Loading profile...</p>
				</div>
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					{error === 'Profile is private' ? (
						<>
							<Lock className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Private Profile
							</h2>
							<p className="text-foreground/60">
								This user has made their profile private
							</p>
						</>
					) : (
						<>
							<User className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Profile Not Found
							</h2>
							<p className="text-foreground/60">
								The user you're looking for doesn't exist
							</p>
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

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Profile Header */}
				<div className="bg-secondary rounded-3xl p-6 md:p-8 mb-8 border border-border text-center">
					<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20 mx-auto mb-4">
						{profile.avatarUrl ? (
							<img
								src={profile.avatarUrl}
								alt={profile.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<User className="w-12 h-12 md:w-16 md:h-16 text-primary/50" />
						)}
					</div>
					<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
						{profile.name}
					</h1>
					<p className="text-foreground/60 mb-3">@{profile.username}</p>
					{profile.bio && (
						<p className="text-foreground/80 max-w-lg mx-auto">{profile.bio}</p>
					)}
					<div className="flex justify-center gap-6 mt-6">
						<div>
							<p className="text-2xl font-bold text-foreground">
								{profile.folders.length}
							</p>
							<p className="text-sm text-foreground/60">Folders</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-foreground">
								{profile.images.length}
							</p>
							<p className="text-sm text-foreground/60">Images</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex justify-center gap-2 mb-8">
					<button
						onClick={() => setActiveTab('folders')}
						className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
							activeTab === 'folders'
								? 'bg-primary text-white'
								: 'bg-secondary text-foreground hover:bg-secondary/80'
						}`}
					>
						<Folder className="w-4 h-4" />
						Folders
					</button>
					<button
						onClick={() => setActiveTab('images')}
						className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
							activeTab === 'images'
								? 'bg-primary text-white'
								: 'bg-secondary text-foreground hover:bg-secondary/80'
						}`}
					>
						<ImageIcon className="w-4 h-4" />
						Images
					</button>
				</div>

				{/* Content */}
				{activeTab === 'folders' ? (
					profile.folders.length === 0 ? (
						<div className="text-center py-16">
							<Folder className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
							<p className="text-foreground/60">No public folders</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{profile.folders.map((folder) => (
								<Link
									key={folder.id}
									to={`/u/${username}/folder/${folder.id}`}
									className="p-4 bg-secondary rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
								>
									<div className="flex items-start gap-3">
										<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
											{folder.thumbnailUrl ? (
												<img
													src={folder.thumbnailUrl}
													alt={folder.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<Folder className="w-6 h-6 text-primary" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground truncate">
												{folder.name}
											</h3>
											<p className="text-sm text-foreground/60 truncate">
												{folder.description || 'No description'}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					)
				) : profile.images.length === 0 ? (
					<div className="text-center py-16">
						<ImageIcon className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
						<p className="text-foreground/60">No public images</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{profile.images.map((image) => (
							<div
								key={image.id}
								className="bg-secondary rounded-2xl overflow-hidden border border-border"
							>
								<div className="aspect-[3/4] overflow-hidden">
									<img
										src={image.replacedUrl || image.originalUrl}
										alt="Gallery"
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="p-3">
									<span className="text-xs text-foreground/60">
										{new Date(image.createdAt).toLocaleDateString('en-GB', {
											day: '2-digit',
											month: 'short',
											year: 'numeric',
										})}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PublicProfile;
