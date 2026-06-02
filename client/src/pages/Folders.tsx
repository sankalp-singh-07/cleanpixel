import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder as FolderIcon, Loader2 } from 'lucide-react';
import { useFolderStore } from '@/store/folderStore';
import { useAuthStore } from '@/store/authStore';
import FolderCard from '@/components/FolderCard';
import CreateFolderModal from '@/components/CreateFolderModal';
import type { Folder, CreateFolderPayload, UpdateFolderPayload } from '@/types/folderTypes';
import { toast } from 'react-toastify';

const Folders = () => {
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const { folders, loading, error, fetchFolders, createFolder, updateFolder, deleteFolder } =
		useFolderStore();

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
	const [actionLoading, setActionLoading] = useState(false);

	useEffect(() => {
		fetchFolders();
	}, []);

	const handleCreateFolder = async (data: CreateFolderPayload | UpdateFolderPayload) => {
		setActionLoading(true);
		try {
			if (editingFolder) {
				await updateFolder(editingFolder.id, data as UpdateFolderPayload);
				toast.success('Folder updated successfully');
			} else {
				await createFolder(data as CreateFolderPayload);
				toast.success('Folder created successfully');
			}
			setShowCreateModal(false);
			setEditingFolder(null);
		} finally {
			setActionLoading(false);
		}
	};

	const handleDeleteFolder = async (folder: Folder) => {
		if (!confirm(`Are you sure you want to delete "${folder.name}"? Images will be unassigned but not deleted.`)) {
			return;
		}
		try {
			await deleteFolder(folder.id);
			toast.success('Folder deleted successfully');
		} catch (err: any) {
			toast.error(err.message || 'Failed to delete folder');
		}
	};

	const handleToggleVisibility = async (folder: Folder) => {
		try {
			await updateFolder(folder.id, { isPublic: !folder.isPublic });
			toast.success(`Folder is now ${folder.isPublic ? 'private' : 'public'}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to update folder');
		}
	};

	const handleEditFolder = (folder: Folder) => {
		setEditingFolder(folder);
		setShowCreateModal(true);
	};

	const handleFolderClick = (folder: Folder) => {
		navigate(`/folders/${folder.id}`);
	};

	return (
		<div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-sans font-semibold text-foreground mb-4">
						Your Folders
					</h1>
					<p className="text-foreground/70 text-lg max-w-2xl mx-auto">
						Organize your images into collections. Create public folders to share your work
						with the world.
					</p>
				</div>

				{/* Create Button */}
				<div className="flex justify-center mb-10">
					<button
						onClick={() => {
							setEditingFolder(null);
							setShowCreateModal(true);
						}}
						className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-0.5"
					>
						<Plus className="w-5 h-5" />
						Create New Folder
					</button>
				</div>

				{/* Content */}
				{loading && folders.length === 0 ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
							<p className="text-foreground/60">Loading folders...</p>
						</div>
					</div>
				) : error ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<p className="text-red-500 mb-4">{error}</p>
							<button
								onClick={() => fetchFolders()}
								className="px-4 py-2 bg-primary text-white rounded-full text-sm"
							>
								Try Again
							</button>
						</div>
					</div>
				) : folders.length === 0 ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<FolderIcon className="w-20 h-20 text-foreground/20 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-foreground mb-2">No folders yet</h3>
							<p className="text-foreground/60 mb-6">
								Create your first folder to start organizing your images
							</p>
							<button
								onClick={() => setShowCreateModal(true)}
								className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
							>
								Create First Folder
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{folders.map((folder) => (
							<FolderCard
								key={folder.id}
								folder={folder}
								username={user?.username}
								onClick={() => handleFolderClick(folder)}
								onEdit={() => handleEditFolder(folder)}
								onDelete={() => handleDeleteFolder(folder)}
								onToggleVisibility={() => handleToggleVisibility(folder)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Create/Edit Modal */}
			<CreateFolderModal
				isOpen={showCreateModal}
				onClose={() => {
					setShowCreateModal(false);
					setEditingFolder(null);
				}}
				onSubmit={handleCreateFolder}
				folder={editingFolder}
				loading={actionLoading}
			/>
		</div>
	);
};

export default Folders;
