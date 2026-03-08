"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const [step, setStep] = useState("loading");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [formError, setFormError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		// Flow PKCE (nouveau template Supabase) → ?token_hash=xxx&type=recovery
		const tokenHash = searchParams.get("token_hash");
		const type = searchParams.get("type");

		if (tokenHash && type === "recovery") {
			supabase.auth
				.verifyOtp({ token_hash: tokenHash, type: "recovery" })
				.then(({ error }) => {
					setStep(error ? "error" : "form");
				});
			return;
		}

		// Flow implicite (template classique) → #access_token=xxx&type=recovery
		const hash = window.location.hash?.slice(1);
		if (hash) {
			const params = new URLSearchParams(hash);
			const accessToken = params.get("access_token");
			const refreshToken = params.get("refresh_token") ?? "";
			const hashType = params.get("type");
			const hashError = params.get("error");

			if (hashError === "access_denied") {
				setStep("error");
				return;
			}

			if (accessToken && hashType === "recovery") {
				supabase.auth
					.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					})
					.then(({ error }) => {
						setStep(error ? "error" : "form");
					});
				return;
			}
		}

		setStep("error");
	}, [searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError("");
		if (password.length < 8) {
			setFormError(
				"Le mot de passe doit contenir au moins 8 caractères.",
			);
			return;
		}
		if (password !== confirm) {
			setFormError("Les mots de passe ne correspondent pas.");
			return;
		}
		setSubmitting(true);
		const { error } = await supabase.auth.updateUser({ password });
		setSubmitting(false);
		if (error) setFormError(error.message);
		else setStep("success");
	};

	return (
		<div className='min-h-dvh flex items-center justify-center bg-background px-4'>
			<div className='w-full max-w-sm'>
				<div className='mb-8 text-center'>
					<span className='text-2xl font-bold tracking-tight'>
						WeSafe
					</span>
				</div>

				{step === "loading" && (
					<div className='flex flex-col items-center gap-3 text-muted-foreground'>
						<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
						<p className='text-sm'>Vérification du lien…</p>
					</div>
				)}

				{step === "form" && (
					<div className='rounded-2xl border bg-card p-6 shadow-sm'>
						<h1 className='text-lg font-semibold mb-1'>
							Nouveau mot de passe
						</h1>
						<p className='text-sm text-muted-foreground mb-6'>
							Choisissez un mot de passe sécurisé d&apos;au moins
							8 caractères.
						</p>
						<form
							onSubmit={handleSubmit}
							className='flex flex-col gap-4'>
							<div className='flex flex-col gap-1.5'>
								<Label htmlFor='password'>Mot de passe</Label>
								<Input
									id='password'
									type='password'
									placeholder='••••••••'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									autoFocus
								/>
							</div>
							<div className='flex flex-col gap-1.5'>
								<Label htmlFor='confirm'>Confirmer</Label>
								<Input
									id='confirm'
									type='password'
									placeholder='••••••••'
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									required
								/>
							</div>
							{formError && (
								<p className='text-sm text-destructive'>
									{formError}
								</p>
							)}
							<Button
								type='submit'
								disabled={submitting}
								className='w-full mt-1'>
								{submitting
									? "Enregistrement…"
									: "Réinitialiser"}
							</Button>
						</form>
					</div>
				)}

				{step === "success" && (
					<div className='flex flex-col items-center gap-5 text-center'>
						<div className='relative flex items-center justify-center'>
							<svg
								viewBox='0 0 80 80'
								className='w-20 h-20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								style={{ overflow: "visible" }}>
								<circle
									cx='40'
									cy='40'
									r='36'
									stroke='currentColor'
									strokeWidth='4'
									className='text-green-500'
									strokeDasharray='226'
									strokeDashoffset='226'
									style={{
										animation:
											"drawCircle 0.5s ease forwards",
									}}
								/>
								<polyline
									points='24,42 35,53 56,30'
									stroke='currentColor'
									strokeWidth='4.5'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-green-500'
									strokeDasharray='50'
									strokeDashoffset='50'
									style={{
										animation:
											"drawCheck 0.4s ease 0.45s forwards",
									}}
								/>
							</svg>
						</div>
						<div>
							<h2 className='text-lg font-semibold'>
								Mot de passe mis à jour !
							</h2>
							<p className='text-sm text-muted-foreground mt-1'>
								Tu peux maintenant te connecter sur
								l&apos;application WeSafe avec ton nouveau mot
								de passe.
							</p>
						</div>
						<p className='text-xs text-muted-foreground bg-muted rounded-xl px-4 py-3'>
							Retourne sur l&apos;app et connecte-toi 🎉
						</p>
					</div>
				)}

				{step === "error" && (
					<div className='flex flex-col items-center gap-4 text-center'>
						<div className='flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20'>
							<svg
								viewBox='0 0 24 24'
								className='w-8 h-8 text-destructive'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<circle cx='12' cy='12' r='10' />
								<line x1='12' y1='8' x2='12' y2='12' />
								<line x1='12' y1='16' x2='12.01' y2='16' />
							</svg>
						</div>
						<div>
							<h2 className='text-base font-semibold'>
								Lien invalide
							</h2>
							<p className='text-sm text-muted-foreground mt-1'>
								Ce lien est expiré ou invalide. Demande un
								nouveau lien de réinitialisation depuis
								l&apos;application.
							</p>
						</div>
					</div>
				)}
			</div>

			<style>{`
                @keyframes drawCircle { to { stroke-dashoffset: 0; } }
                @keyframes drawCheck  { to { stroke-dashoffset: 0; } }
            `}</style>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className='min-h-dvh flex items-center justify-center'>
					<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
				</div>
			}>
			<ResetPasswordForm />
		</Suspense>
	);
}
