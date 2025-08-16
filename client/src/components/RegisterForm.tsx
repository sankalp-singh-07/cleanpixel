import {
	signupFormSchema,
	type signupFormSchemaType,
} from '@/schemas/authSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@/api/auth';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function RegisterForm() {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		reset,
	} = useForm<signupFormSchemaType>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: { name: '', email: '', username: '', password: '' },
	});

	const onSubmit = async (values: signupFormSchemaType) => {
		setServerError(null);

		const payload = {
			email: values.email.trim().toLowerCase(),
			username: values.username.trim().toLowerCase(),
			password: values.password,
			name: values.name.trim(),
		};

		try {
			await signUp(
				payload.email,
				payload.username,
				payload.password,
				payload.name
			);
			reset();
			console.log('user created');
		} catch (err: any) {
			const msg: string =
				err?.response?.data?.message ||
				err?.message ||
				'Registration failed. Please try again.';

			if (/email/i.test(msg)) {
				setError('email', { type: 'server', message: msg });
			} else if (/username/i.test(msg)) {
				setError('username', { type: 'server', message: msg });
			} else if (/password/i.test(msg)) {
				setError('password', { type: 'server', message: msg });
			} else if (/name/i.test(msg)) {
				setError('name', { type: 'server', message: msg });
			} else {
				setServerError(msg);
			}
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Create your account</CardTitle>
					<CardDescription>
						Enter your details below to get started.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{serverError && (
						<div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
							{serverError}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Your full name"
									autoComplete="name"
									disabled={isSubmitting}
									{...register('name')}
								/>
								{errors.name && (
									<p className="text-xs text-red-600">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="grid gap-3">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									placeholder="Choose a username"
									autoComplete="username"
									disabled={isSubmitting}
									{...register('username')}
								/>
								{errors.username && (
									<p className="text-xs text-red-600">
										{errors.username.message}
									</p>
								)}
							</div>

							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									autoComplete="email"
									inputMode="email"
									disabled={isSubmitting}
									{...register('email')}
								/>
								{errors.email && (
									<p className="text-xs text-red-600">
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="grid gap-3">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Create a strong password"
									autoComplete="new-password"
									disabled={isSubmitting}
									{...register('password')}
								/>
								{errors.password && (
									<p className="text-xs text-red-600">
										{errors.password.message}
									</p>
								)}
								<p className="text-xs text-muted-foreground">
									Use at least 6 characters.
								</p>
							</div>

							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting
										? 'Creating account…'
										: 'Create account'}
								</Button>
							</div>
						</div>

						<div className="mt-4 text-center text-sm">
							Already have an account?{' '}
							<Link
								to="/login"
								className="underline underline-offset-4"
							>
								Log in
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
