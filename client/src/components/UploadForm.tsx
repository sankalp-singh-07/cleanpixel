import { useForm } from 'react-hook-form';

type FormValues = {
	file: FileList;
};

const UploadForm = () => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();

	const onSubmit = async (data: FormValues) => {
		const file = data.file?.[0];
		console.log('file submitted');
		console.log(file);
	};

	return (
		<>
			<div>
				<h1>Upload Form</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
						type="file"
						accept="image/*"
						{...register('file', {
							required: 'Upload a valid file',
						})}
					/>

					{errors.file && (
						<p style={{ color: 'red', marginTop: 4 }}>
							{errors.file.message}
						</p>
					)}

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Uploading…' : 'Hit Upload'}
					</button>
				</form>
			</div>
		</>
	);
};

export default UploadForm;
