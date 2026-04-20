"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : contact_messages
// Colonnes : id, name, email, subject, message, created_at

const SUBJECTS = [
	"Question générale",
	"Support technique",
	"Partenariat entreprise",
	"Candidature / recrutement",
	"Presse & médias",
	"Autre",
];

const FormSchema = z.object({
	name: z.string().min(2, { message: "Veuillez entrer votre nom complet." }),
	email: z
		.string()
		.email({ message: "Veuillez entrer une adresse email valide." }),
	subject: z.string().min(1, { message: "Veuillez choisir un sujet." }),
	message: z
		.string()
		.min(10, {
			message: "Votre message doit contenir au moins 10 caractères.",
		}),
});

export default function ContactPage() {
	const [sent, setSent] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: { name: "", email: "", subject: "", message: "" },
	});

	const onSubmit = async (data) => {
		const { error } = await supabase
			.from("contact_messages")
			.insert([data]);

		if (error) {
			toast.error("Erreur lors de l'envoi", {
				description: "Veuillez réessayer ou nous contacter par email.",
			});
			return;
		}

		setSent(true);
	};

	return (
		<div className='min-h-screen bg-background mt-14'>
			{/* Hero */}
			<section className='border-b border-border bg-card/50 py-20'>
				<div className='mx-auto max-w-7xl px-6 text-center'>
					<p className='text-sm font-medium tracking-widest text-primary uppercase'>
						Contact
					</p>
					<h1 className='mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold text-foreground md:text-5xl'>
						Une question ? Écrivez-nous
					</h1>
					<p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
						Notre équipe vous répond dans les meilleurs délais,
						généralement sous 24h.
					</p>
				</div>
			</section>

			<section className='mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-3'>
				{/* Infos de contact */}
				<aside className='space-y-8'>
					<div>
						<h2 className='font-semibold text-foreground text-lg mb-6'>
							Nos coordonnées
						</h2>
						<ul className='space-y-5'>
							<li className='flex items-start gap-3'>
								<div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
									<Mail className='h-4 w-4 text-primary' />
								</div>
								<div>
									<p className='text-sm font-medium text-foreground'>
										Email
									</p>
									<a
										href='mailto:contact@wesafe.fr'
										className='text-sm text-muted-foreground hover:text-primary transition-colors'>
										contact@wesafe.fr
									</a>
								</div>
							</li>
							<li className='flex items-start gap-3'>
								<div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
									<Phone className='h-4 w-4 text-primary' />
								</div>
								<div>
									<p className='text-sm font-medium text-foreground'>
										Téléphone
									</p>
									<a
										href='tel:+33100000000'
										className='text-sm text-muted-foreground hover:text-primary transition-colors'>
										+33 1 00 00 00 00
									</a>
								</div>
							</li>
							<li className='flex items-start gap-3'>
								<div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
									<MapPin className='h-4 w-4 text-primary' />
								</div>
								<div>
									<p className='text-sm font-medium text-foreground'>
										Adresse
									</p>
									<p className='text-sm text-muted-foreground'>
										Paris, France
									</p>
								</div>
							</li>
						</ul>
					</div>

					<div className='rounded-xl border border-border bg-card p-5 space-y-2'>
						<p className='text-sm font-medium text-foreground'>
							⏱ Temps de réponse
						</p>
						<p className='text-sm text-muted-foreground'>
							Nous répondons généralement sous{" "}
							<strong className='text-foreground'>24h</strong> en
							jours ouvrés.
						</p>
					</div>
				</aside>

				{/* Formulaire */}
				<div className='lg:col-span-2'>
					{sent ? (
						<div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-12 text-center h-full min-h-80'>
							<CheckCircle className='h-12 w-12 text-primary' />
							<h2 className='text-xl font-semibold text-foreground'>
								Message envoyé !
							</h2>
							<p className='text-muted-foreground max-w-sm'>
								Merci de nous avoir contactés. Nous vous
								répondrons dans les plus brefs délais.
							</p>
							<Button
								variant='outline'
								onClick={() => {
									setSent(false);
									form.reset();
								}}>
								Envoyer un autre message
							</Button>
						</div>
					) : (
						<div className='rounded-xl border border-border bg-card p-8'>
							<h2 className='font-semibold text-foreground text-lg mb-6'>
								Envoyer un message
							</h2>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-5'>
									<div className='grid gap-5 sm:grid-cols-2'>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Nom complet
													</FormLabel>
													<FormControl>
														<Input
															placeholder='Jean Dupont'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Adresse email
													</FormLabel>
													<FormControl>
														<Input
															type='email'
															placeholder='jean@exemple.fr'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name='subject'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Sujet</FormLabel>
												<FormControl>
													<select
														{...field}
														className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'>
														<option value=''>
															Choisir un sujet…
														</option>
														{SUBJECTS.map((s) => (
															<option
																key={s}
																value={s}>
																{s}
															</option>
														))}
													</select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='message'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Message</FormLabel>
												<FormControl>
													<textarea
														{...field}
														rows={5}
														placeholder='Décrivez votre demande…'
														className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										className='w-full gap-2'
										disabled={form.formState.isSubmitting}>
										<Send className='h-4 w-4' />
										{form.formState.isSubmitting
											? "Envoi en cours…"
											: "Envoyer le message"}
									</Button>
								</form>
							</Form>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
