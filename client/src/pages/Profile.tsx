import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	User,
	Mail,
	Edit2,
	Save,
	X,
	Eye,
	EyeOff,
	Folder,
	Image as ImageIcon,
	ExternalLink,
	Loader2,
	Camera,
	Copy,
	Check,
	Upload,
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import { useCreditStore } from '@/store/creditStore';
import ImageCard from '@/components/ImageCard';
import { toast } from 'react-toastify';
import BackgroundModal from '@/components/BackgroundModal';
import AddToFolderModal from '@/components/AddToFolderModal';
import CreateFolderModal from '@/components/CreateFolderModal';
import type { ProfileImage } from '@/types/profileTypes';
import type { CreateFolderPayload, UpdateFolderPayload } from '@/types/folderTypes';
import { useFolderStore } from '@/store/folderStore';

const Profile = () => {
	const user = useAuthStore((s) => s.user);
	const { credits } = useCreditStore();
	const { profile, loading, updating, fetchProfile, updateProfile, uploadAvatar, toggleImageVisibility } =
		useProfileStore();
	const { createFolder } = useFolderStore();

	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		name: '',
		bio: '',
		publicProfile: true,
	});
	const [activeTab, setActiveTab] = useState<'folders' | 'images'>('folders');
	const [copied, setCopied] = useState(false);
	const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	// Modals
	const [selectedImage, setSelectedImage] = useState<ProfileImage | null>(null);
	const [showBackgroundModal, setShowBackgroundModal] = useState(false);
	const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
	const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
	const [imageForFolder, setImageForFolder] = useState<string | null>(null);

	useEffect(() => {
		fetchProfile();
	}, []);

	useEffect(() => {
		if (profile) {
			setEditForm({
				name: profile.name,
				bio: profile.bio || '',
				publicProfile: profile.publicProfile,
			});
			setAvatarLoadFailed(false);
		}
	}, [profile]);

	const publicProfileUrl = user
		? `${window.location.origin}/u/${user.username}`
		: null;

	const handleCopyUrl = async () => {
		if (publicProfileUrl) {
			await navigator.clipboard.writeText(publicProfileUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success('Profile URL copied to clipboard');
		}
	};

	const handleSaveProfile = async () => {
		try {
			await updateProfile({
				name: editForm.name.trim(),
				bio: editForm.bio || null,
				publicProfile: editForm.publicProfile,
			});
			toast.success('Profile updated successfully');
			setIsEditing(false);
		} catch (err: any) {
			toast.error(err.message || 'Failed to update profile');
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			toast.error('Avatar image must be less than 10MB');
			return;
		}

		try {
			await uploadAvatar(file);
			setAvatarLoadFailed(false);
			toast.success('Profile image updated');
		} catch (err: any) {
			toast.error(err.message || 'Failed to upload profile image');
		}
	};

	const handleToggleImageVisibility = async (imageId: string) => {
		try {
			await toggleImageVisibility(imageId);
			toast.success('Image visibility updated');
		} catch (err: any) {
			toast.error(err.message || 'Failed to update visibility');
		}
	};

	const handleApplyBackground = (image: ProfileImage) => {
		if (!image.replacedUrl && !profile?.images.find((i) => i.id === image.id)) {
			toast.error('This image needs background removal first');
			return;
		}
		setSelectedImage(image);
		setShowBackgroundModal(true);
	};

	const handleAddToFolder = (imageId: string) => {
		setImageForFolder(imageId);
		setShowAddToFolderModal(true);
	};

	const handleCreateFolder = async (
		data: CreateFolderPayload | UpdateFolderPayload
	) => {
		if (!data.name) return;
		try {
			await createFolder({
				name: data.name,
				description: data.description ?? undefined,
				isPublic: data.isPublic,
			});
			toast.success('Folder created successfully');
			setShowCreateFolderModal(false);
			// Re-open add to folder modal
			if (imageForFolder) {
				setShowAddToFolderModal(true);
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to create folder');
		}
	};

	if (loading && !profile) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
					<p className="text-foreground/60">Loading profile...</p>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<p className="text-red-500">Failed to load profile</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Profile Header Card */}
				<div className="bg-secondary rounded-3xl p-6 md:p-8 mb-8 border border-border">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<div className="relative">
								<input
									ref={avatarInputRef}
									type="file"
									accept="image/jpeg,image/jpg,image/png,image/webp"
									onChange={handleAvatarChange}
									className="hidden"
								/>
								<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20">
									{profile.avatarUrl && !avatarLoadFailed ? (
										<img
											src={profile.avatarUrl}
											alt={profile.name}
											className="w-full h-full object-cover"
											onError={() => setAvatarLoadFailed(true)}
										/>
									) : (
										<User className="w-12 h-12 md:w-16 md:h-16 text-primary/50" />
									)}
								</div>
								<button
									type="button"
									onClick={() => avatarInputRef.current?.click()}
									disabled={updating}
									className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-white shadow-lg transition-colors hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
									aria-label="Upload profile image"
								>
									{updating ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Camera className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{/* Info */}
						<div className="flex-1">
							{isEditing ? (
								<div className="space-y-4">
									<input
										type="text"
										value={editForm.name}
										onChange={(e) =>
											setEditForm({ ...editForm, name: e.target.value })
										}
										className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
										placeholder="Your name"
									/>
									<textarea
										value={editForm.bio}
										onChange={(e) =>
											setEditForm({ ...editForm, bio: e.target.value })
										}
										className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary resize-none h-20"
										placeholder="Write a short bio..."
										maxLength={500}
									/>
									<button
										type="button"
										onClick={() => avatarInputRef.current?.click()}
										disabled={updating}
										className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary disabled:opacity-60"
									>
										<Upload className="h-4 w-4" />
										Upload profile image
									</button>
									<div className="flex flex-col gap-3 rounded-xl bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<span id="public-profile-label" className="text-sm font-medium text-foreground">
												Public Profile
											</span>
											<p className="text-xs text-foreground/55">
												Allow others to view your public gallery and folders.
											</p>
										</div>
										<button
											type="button"
											aria-labelledby="public-profile-label"
											aria-pressed={editForm.publicProfile}
											onClick={() =>
												setEditForm({
													...editForm,
													publicProfile: !editForm.publicProfile,
												})
											}
											className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full p-1 shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
												editForm.publicProfile
													? 'bg-primary'
													: 'bg-foreground/20'
											}`}
										>
											<span
												className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
													editForm.publicProfile
														? 'translate-x-8'
														: 'translate-x-0'
												}`}
											/>
										</button>
									</div>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={handleSaveProfile}
											disabled={updating}
											className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
										>
											{updating ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<Save className="w-4 h-4" />
											)}
											Save
										</button>
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-full text-sm font-medium hover:bg-foreground/20"
										>
											<X className="w-4 h-4" />
											Cancel
										</button>
									</div>
								</div>
							) : (
								<>
									<div className="flex items-start justify-between mb-2">
										<div>
											<h1 className="text-2xl md:text-3xl font-bold text-foreground">
												{profile.name}
											</h1>
											<p className="text-foreground/60">@{profile.username}</p>
										</div>
										<button
											type="button"
											onClick={() => setIsEditing(true)}
											className="cursor-pointer p-2 rounded-full hover:bg-background transition-colors"
											aria-label="Edit profile"
										>
											<Edit2 className="w-5 h-5 text-foreground/60" />
										</button>
									</div>
									{profile.bio && (
										<p className="text-foreground/80 mb-4">{profile.bio}</p>
									)}
									<div className="flex flex-wrap items-center gap-4 text-sm">
										<span className="flex items-center gap-1.5 text-foreground/60">
											<Mail className="w-4 h-4" />
											{profile.email}
										</span>
										<span
											className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
												profile.publicProfile
													? 'bg-green-500/10 text-green-600 dark:text-green-400'
													: 'bg-foreground/10 text-foreground/60'
											}`}
										>
											{profile.publicProfile ? (
												<Eye className="w-4 h-4" />
											) : (
												<EyeOff className="w-4 h-4" />
											)}
											{profile.publicProfile ? 'Public' : 'Private'}
										</span>
									</div>
								</>
							)}
						</div>

						{/* Stats */}
						<div className="flex md:flex-col gap-4 md:gap-2 md:text-right">
							<div className="px-4 py-2 bg-background rounded-xl">
								<p className="text-2xl font-bold text-primary">{credits ?? 0}</p>
								<p className="text-xs text-foreground/60">Credits</p>
							</div>
							<div className="px-4 py-2 bg-background rounded-xl">
								<p className="text-2xl font-bold text-foreground">
									{profile.folders.length}
								</p>
								<p className="text-xs text-foreground/60">Folders</p>
							</div>
							<div className="px-4 py-2 bg-background rounded-xl">
								<p className="text-2xl font-bold text-foreground">
									{profile.images.length}
								</p>
								<p className="text-xs text-foreground/60">Images</p>
							</div>
						</div>
					</div>

					{/* Public URL */}
					{profile.publicProfile && publicProfileUrl && (
						<div className="mt-6 pt-6 border-t border-border">
							<div className="flex items-center justify-between gap-4 p-3 bg-background rounded-xl">
								<div className="flex items-center gap-2 min-w-0">
									<ExternalLink className="w-4 h-4 text-foreground/60 flex-shrink-0" />
									<span className="text-sm text-foreground/60 truncate">
										{publicProfileUrl}
									</span>
								</div>
								<button
									type="button"
									onClick={handleCopyUrl}
									className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
								>
									{copied ? (
										<Check className="w-4 h-4" />
									) : (
										<Copy className="w-4 h-4" />
									)}
									{copied ? 'Copied!' : 'Copy'}
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Tabs */}
				<div className="flex gap-2 mb-6">
					<button
						type="button"
						onClick={() => setActiveTab('folders')}
						className={`flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
							activeTab === 'folders'
								? 'bg-primary text-white'
								: 'bg-secondary text-foreground hover:bg-secondary/80'
						}`}
					>
						<Folder className="w-4 h-4" />
						Folders ({profile.folders.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('images')}
						className={`flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
							activeTab === 'images'
								? 'bg-primary text-white'
								: 'bg-secondary text-foreground hover:bg-secondary/80'
						}`}
					>
						<ImageIcon className="w-4 h-4" />
						Images ({profile.images.length})
					</button>
				</div>

				{/* Content */}
				{activeTab === 'folders' ? (
					profile.folders.length === 0 ? (
						<div className="text-center py-16">
							<Folder className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
							<p className="text-foreground/60 mb-4">No folders yet</p>
							<Link
								to="/folders"
								className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors inline-block"
							>
								Create Folder
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{profile.folders.map((folder) => (
								<Link
									key={folder.id}
									to={`/folders/${folder.id}`}
									className="p-4 bg-secondary rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
								>
									<div className="flex items-start gap-3">
										<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
											<Folder className="w-6 h-6 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground truncate">
												{folder.name}
											</h3>
											<p className="text-sm text-foreground/60 truncate">
												{folder.description || 'No description'}
											</p>
											<span
												className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
													folder.isPublic
														? 'bg-green-500/10 text-green-600'
														: 'bg-foreground/10 text-foreground/50'
												}`}
											>
												{folder.isPublic ? 'Public' : 'Private'}
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					)
				) : profile.images.length === 0 ? (
					<div className="text-center py-16">
						<ImageIcon className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
						<p className="text-foreground/60 mb-4">No images yet</p>
						<Link
							to="/upload"
							className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors inline-block"
						>
							Upload Images
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{profile.images.map((image) => (
							<ImageCard
								key={image.id}
								image={image}
								showVisibilityToggle={true}
								showFolderActions={true}
								onToggleVisibility={() => handleToggleImageVisibility(image.id)}
								onApplyBackground={() => handleApplyBackground(image)}
								onAddToFolder={() => handleAddToFolder(image.id)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Background Modal */}
			{selectedImage && (
				<BackgroundModal
					isOpen={showBackgroundModal}
					onClose={() => {
						setShowBackgroundModal(false);
						setSelectedImage(null);
					}}
					imageId={selectedImage.id}
					removedBgUrl={selectedImage.replacedUrl || ''}
					onSuccess={() => fetchProfile()}
				/>
			)}

			{/* Add to Folder Modal */}
			{imageForFolder && (
				<AddToFolderModal
					isOpen={showAddToFolderModal}
					onClose={() => {
						setShowAddToFolderModal(false);
						setImageForFolder(null);
					}}
					imageId={imageForFolder}
					onCreateFolder={() => {
						setShowAddToFolderModal(false);
						setShowCreateFolderModal(true);
					}}
				/>
			)}

			{/* Create Folder Modal */}
			<CreateFolderModal
				isOpen={showCreateFolderModal}
				onClose={() => setShowCreateFolderModal(false)}
				onSubmit={handleCreateFolder}
			/>
		</div>
	);
};

export default Profile;
