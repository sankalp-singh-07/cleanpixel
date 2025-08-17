import {
	loginFormSchema,
	type loginFormSchemaType,
} from '@/schemas/authSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/hooks/useAuth';

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
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const LoginForm = () => {
	const { login } = useAuth();
	const [serverError, setServerError] = useState<string | null>(null);
	const [capsLockOn, setCapsLockOn] = useState(false);
	const [showPw, setShowPw] = useState(false);

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		setError,
	} = useForm<loginFormSchemaType>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values: loginFormSchemaType) => {
		setServerError(null);
		const email = values.email.trim().toLowerCase();
		const password = values.password;

		try {
			const res = await login(email, password);
			console.log(res);
			navigate('/upload');
		} catch (err: any) {
			const msg: string =
				err?.response?.data?.message ||
				err?.message ||
				'Login failed. Please try again.';

			if (/email/i.test(msg)) {
				setError('email', { type: 'server', message: msg });
			} else if (/password/i.test(msg)) {
				setError('password', { type: 'server', message: msg });
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
						Log in
					</CardTitle>
					<CardDescription className="text-center">
						Enter your email and password to continue.
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
									className={cn(
										errors.email && 'border-red-500'
									)}
								/>
								{errors.email && (
									<FieldError
										message={errors.email.message as string}
									/>
								)}
							</div>

							<div className="grid gap-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link
										to="/forgot-password"
										className="text-xs underline underline-offset-4"
									>
										Forgot?
									</Link>
								</div>

								<div className="relative">
									<Input
										id="password"
										type={showPw ? 'text' : 'password'}
										placeholder="Your password"
										autoComplete="current-password"
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
										className={cn(
											'pr-10',
											errors.password && 'border-red-500'
										)}
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
							</div>

							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									className="w-full cursor-pointer"
									disabled={isSubmitting || !isValid}
								>
									{isSubmitting ? 'Signing in…' : 'Login'}
								</Button>
							</div>
						</div>

						<div className="mt-4 text-center text-sm">
							Don’t have an account?{' '}
							<Link
								to="/register"
								className="underline underline-offset-4"
							>
								Create one
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

function FieldError({ message }: { message: string }) {
	return (
		<p className="text-xs text-red-600 flex items-center gap-1">
			<XCircle className="h-3 w-3" />
			{message}
		</p>
	);
}

export default LoginForm;
