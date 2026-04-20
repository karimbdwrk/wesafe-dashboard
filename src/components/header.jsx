"use client";

import { useEffect, useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "../lib/supabase/supabaseClient";

const navLinks = [
	{ label: "Fonctionnalites", href: "#fonctionnalites" },
	{ label: "Comment ca marche", href: "#process" },
	{ label: "Offres", href: "#offres" },
	{ label: "Contact", href: "#contact" },
];

export function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			setIsAuthenticated(!!data.session);
		};
		checkSession();
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setIsAuthenticated(!!session);
			},
		);
		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<header className='fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl'>
			<div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
				<Link href='/' className='flex items-center gap-2'>
					<div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'>
						<Shield className='h-5 w-5 text-primary-foreground' />
					</div>
					<span className='font-[family-name:var(--font-heading)] text-xl font-bold text-foreground'>
						WeSafe
					</span>
				</Link>

				<nav className='hidden items-center gap-8 md:flex'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
							{link.label}
						</Link>
					))}
				</nav>

				<div className='hidden items-center gap-3 md:flex'>
					{isAuthenticated ? (
						<Link href='/dashboard/default'>
							<Button
								variant='ghost'
								size='sm'
								className='text-muted-foreground hover:text-foreground'>
								Dashboard
							</Button>
						</Link>
					) : (
						<Link href='/auth/v1/login'>
							<Button
								variant='ghost'
								size='sm'
								className='text-muted-foreground hover:text-foreground'>
								Se connecter
							</Button>
						</Link>
					)}
					<Button
						size='sm'
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={() =>
							document
								.getElementById("telecharger")
								?.scrollIntoView({ behavior: "smooth" })
						}>
						Telecharger
					</Button>
				</div>

				<button
					className='text-foreground md:hidden'
					onClick={() => setMobileOpen(!mobileOpen)}
					aria-label={
						mobileOpen ? "Fermer le menu" : "Ouvrir le menu"
					}>
					{mobileOpen ? (
						<X className='h-6 w-6' />
					) : (
						<Menu className='h-6 w-6' />
					)}
				</button>
			</div>

			{mobileOpen && (
				<div className='border-t border-border/50 bg-background px-6 pb-6 md:hidden'>
					<nav className='flex flex-col gap-4 pt-4'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='text-sm text-muted-foreground transition-colors hover:text-foreground'
								onClick={() => setMobileOpen(false)}>
								{link.label}
							</Link>
						))}
						<div className='flex flex-col gap-2 pt-4'>
							{isAuthenticated ? (
								<Link href='/dashboard/default'>
									<Button
										variant='ghost'
										size='sm'
										className='justify-start text-muted-foreground'>
										Dashboard
									</Button>
								</Link>
							) : (
								<Link href='/auth/login'>
									<Button
										variant='ghost'
										size='sm'
										className='justify-start text-muted-foreground'>
										Se connecter
									</Button>
								</Link>
							)}
							<Button
								size='sm'
								className='bg-primary text-primary-foreground'
								onClick={() => {
									setMobileOpen(false);
									document
										.getElementById("telecharger")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}>
								Telecharger
							</Button>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
