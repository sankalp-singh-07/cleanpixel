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
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, XCircle, CheckCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export function RegisterForm() {
	const [serverError, setServerError] = useState<string | null>(null);
	const [capsLockOn, setCapsLockOn] = useState(false);
	const [showPw, setShowPw] = useState(false);

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		setError,
		reset,
		watch,
	} = useForm<signupFormSchemaType>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			name: '',
			email: '',
			username: '',
			password: '',
		},
		mode: 'onChange',
	});

	const password = watch('password') || '';
	const checks = useMemo(
		() => ({
			length: password.length >= 6,
			lower: /[a-z]/.test(password),
			upper: /[A-Z]/.test(password),
			symbol: /[^A-Za-z0-9]/.test(password),
		}),
		[password]
	);
	const score =
		(checks.length ? 1 : 0) +
		(checks.lower ? 1 : 0) +
		(checks.upper ? 1 : 0) +
		(checks.symbol ? 1 : 0);
	const percent = (score / 4) * 100;

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

			navigate('/login');
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
					<CardTitle className="text-xl font-semibold text-center">
						Create your account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details below to get started.
					</CardDescription>
				</CardHeader>

				<br />

				<CardContent>
					{serverError && (
						<div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
							{serverError}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Your full name"
									autoComplete="name"
									disabled={isSubmitting}
									aria-invalid={!!errors.name}
									{...register('name')}
									className={errors.name && 'border-red-500'}
								/>
								{errors.name && (
									<FieldError
										message={errors.name.message as string}
									/>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									autoComplete="username"
									disabled={isSubmitting}
									aria-invalid={!!errors.username}
									{...register('username')}
									className={
										errors.username && 'border-red-500'
									}
								/>
								{errors.username && (
									<FieldError
										message={
											errors.username.message as string
										}
									/>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									autoComplete="email"
									inputMode="email"
									disabled={isSubmitting}
									aria-invalid={!!errors.email}
									{...register('email')}
									className={errors.email && 'border-red-500'}
								/>
								{errors.email && (
									<FieldError
										message={errors.email.message as string}
									/>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>

								<div className="relative">
									<Input
										id="password"
										type={showPw ? 'text' : 'password'}
										placeholder="Create a strong password"
										autoComplete="new-password"
										disabled={isSubmitting}
										aria-invalid={!!errors.password}
										{...register('password')}
										onKeyUp={(e) =>
											setCapsLockOn(
												(e as any).getModifierState?.(
													'CapsLock'
												) || false
											)
										}
										className={`pr-10 ${
											errors.password && 'border-red-500'
										}`}
									/>
									<span
										aria-label={
											showPw
												? 'Hide password'
												: 'Show password'
										}
										onClick={() => setShowPw((s) => !s)}
										className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer"
										tabIndex={-1}
									>
										{showPw ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</span>
								</div>

								{capsLockOn && (
									<p className="text-xs text-amber-600">
										Caps Lock is on
									</p>
								)}
								{errors.password && (
									<FieldError
										message={
											errors.password.message as string
										}
									/>
								)}

								<div className="mt-1">
									<div className="h-2 w-full rounded bg-muted">
										<div
											className={cn(
												'h-2 rounded transition-all',
												score <= 1 && 'bg-red-500',
												score === 2 && 'bg-orange-500',
												score === 3 && 'bg-yellow-500',
												score === 4 && 'bg-green-500'
											)}
											style={{ width: `${percent}%` }}
											aria-label="Password strength"
										/>
									</div>
									<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
										<PwRule
											ok={checks.length}
											label="At least 6 characters"
										/>
										<PwRule
											ok={checks.lower}
											label="Lowercase letter"
										/>
										<PwRule
											ok={checks.upper}
											label="Uppercase letter"
										/>
										<PwRule
											ok={checks.symbol}
											label="Symbol"
										/>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									className="w-full cursor-pointer"
									disabled={isSubmitting || !isValid}
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

function FieldError({ message }: { message: string }) {
	return (
		<p className="text-xs text-red-600 flex items-center gap-1">
			<XCircle className="h-3 w-3" />
			{message}
		</p>
	);
}

function PwRule({ ok, label }: { ok: boolean; label: string }) {
	return (
		<div className="flex items-center gap-2">
			{ok ? (
				<CheckCircle className="h-3 w-3 text-green-500" />
			) : (
				<XCircle className="h-3 w-3 text-red-500" />
			)}
			<span
				className={cn(
					'text-xs',
					ok ? 'text-green-600' : 'text-red-600'
				)}
			>
				{label}
			</span>
		</div>
	);
}
