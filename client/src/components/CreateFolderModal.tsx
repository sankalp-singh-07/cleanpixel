import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Folder, CreateFolderPayload, UpdateFolderPayload } from '@/types/folderTypes';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateFolderPayload | UpdateFolderPayload) => Promise<void>;
	folder?: Folder | null; // If provided, we're editing
	loading?: boolean;
};

const CreateFolderModal = ({ isOpen, onClose, onSubmit, folder, loading }: Props) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState('');

	const isEditing = !!folder;

	useEffect(() => {
		if (folder) {
			setName(folder.name);
			setDescription(folder.description || '');
			setIsPublic(folder.isPublic);
		} else {
			setName('');
			setDescription('');
			setIsPublic(false);
		}
		setError('');
	}, [folder, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!name.trim()) {
			setError('Folder name is required');
			return;
		}

		if (name.length > 100) {
			setError('Folder name must be less than 100 characters');
			return;
		}

		try {
			await onSubmit({
				name: name.trim(),
				description: description.trim() || undefined,
				isPublic,
			});
			onClose();
		} catch (err: any) {
			setError(err.response?.data?.message || err.message || 'Failed to save folder');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

			<div className="relative z-10 w-full max-w-md m-4 bg-background rounded-2xl shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-border">
					<h2 className="text-xl font-semibold text-foreground">
						{isEditing ? 'Edit Folder' : 'Create Folder'}
					</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-secondary transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					{error && (
						<div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
							{error}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-foreground mb-1.5">
							Folder Name *
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="My Awesome Folder"
							className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-transparent"
							maxLength={100}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-1.5">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Optional description for your folder..."
							className="w-full h-24 px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
							maxLength={200}
						/>
						<p className="text-xs text-foreground/50 mt-1">{description.length}/200</p>
					</div>

					<div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
						<div>
							<p className="text-sm font-medium text-foreground">Make Public</p>
							<p className="text-xs text-foreground/60">
								Anyone with the link can view this folder
							</p>
						</div>
						<button
							type="button"
							onClick={() => setIsPublic(!isPublic)}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								isPublic ? 'bg-primary' : 'bg-foreground/20'
							}`}
						>
							<span
								className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
									isPublic ? 'translate-x-6' : 'translate-x-0'
								}`}
							/>
						</button>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-5 py-2.5 rounded-full text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
						>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Saving...
								</>
							) : isEditing ? (
								'Save Changes'
							) : (
								'Create Folder'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateFolderModal;
