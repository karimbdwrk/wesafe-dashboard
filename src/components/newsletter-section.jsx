"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabaseClient";

export function NewsletterSection() {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);

	const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
	const emailValid = EMAIL_REGEX.test(email.trim());
	const showEmailError = emailTouched && email !== "" && !emailValid;
	const canSubmit = emailValid && role !== "" && !loading;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!canSubmit) return;
		setLoading(true);
		const { error } = await supabase
			.from("newsletter_subscribers")
			.insert({ email: email.trim().toLowerCase(), role });
		setLoading(false);
		if (error && error.code !== "23505") {
			toast.error("Une erreur est survenue. Réessayez plus tard.");
		} else {
			toast.success("Inscription confirmée ! Merci 🎉");
			setEmail("");
			setRole("");
			setEmailTouched(false);
		}
	};

	return (
		<section className='border-t border-border bg-card/50 py-16'>
			<div className='mx-auto max-w-3xl px-6 text-center'>
				<div className='flex justify-center mb-4'>
					<div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10'>
						<Mail className='h-5 w-5 text-primary' />
					</div>
				</div>
				<h2 className='font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground md:text-3xl mb-2'>
					Restez informé
				</h2>
				<p className='text-muted-foreground text-sm leading-relaxed mb-8 max-w-md mx-auto'>
					Recevez les dernières offres, actualités du secteur et
					conseils directement dans votre boîte mail. Pas de spam.
				</p>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col sm:flex-row gap-3 max-w-xl mx-auto items-start'>
					<div className='flex-1 w-full'>
						<Input
							type='email'
							placeholder='votre@email.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onBlur={() => setEmailTouched(true)}
							className={`h-10 w-full ${showEmailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
						/>
						{showEmailError && (
							<p className='mt-1 text-left text-xs text-destructive'>
								Adresse email invalide (ex : nom@domaine.fr)
							</p>
						)}
					</div>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value)}
						required
						className='h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring sm:w-44'>
						<option value='' disabled>
							Je suis…
						</option>
						<option value='candidat'>Candidat</option>
						<option value='company'>Entreprise</option>
					</select>
					<Button
						type='submit'
						disabled={!canSubmit}
						className='gap-2 h-10'>
						{loading ? (
							<span className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent' />
						) : (
							<Send className='h-4 w-4' />
						)}
						S&apos;inscrire
					</Button>
				</form>

				<p className='mt-4 text-xs text-muted-foreground'>
					En vous inscrivant, vous acceptez notre{" "}
					<a
						href='/politique-de-confidentialite'
						className='underline underline-offset-2 hover:text-foreground transition-colors'>
						politique de confidentialité
					</a>
					. Désinscription à tout moment.
				</p>
			</div>
		</section>
	);
}
