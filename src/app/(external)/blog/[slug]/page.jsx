"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : articles
// Colonnes : id, slug, title, excerpt, cover_image, content (HTML), author,
//            published_at, category, reading_time, published

function ArticleSkeleton() {
	return (
		<div className='animate-pulse'>
			<div className='h-72 bg-muted rounded-xl mb-8' />
			<div className='max-w-3xl mx-auto space-y-4'>
				<div className='h-3 w-20 bg-muted rounded' />
				<div className='h-8 w-3/4 bg-muted rounded' />
				<div className='h-4 w-1/2 bg-muted rounded' />
				<div className='space-y-2 mt-8'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className='h-3 bg-muted rounded'
							style={{ width: `${70 + Math.random() * 30}%` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default function ArticlePage() {
	const { slug } = useParams();
	const [article, setArticle] = useState(null);
	const [related, setRelated] = useState([]);
	const [loading, setLoading] = useState(true);
	const [notFoundState, setNotFoundState] = useState(false);

	useEffect(() => {
		if (!slug) return;

		supabase
			.from("articles")
			.select("*")
			.eq("slug", slug)
			.eq("published", true)
			.maybeSingle()
			.then(({ data }) => {
				if (!data) {
					setNotFoundState(true);
					setLoading(false);
					return;
				}
				setArticle(data);

				// Articles liés (même catégorie, exclure l'actuel)
				if (data.category) {
					supabase
						.from("articles")
						.select(
							"id, slug, title, cover_image, published_at, reading_time",
						)
						.eq("published", true)
						.eq("category", data.category)
						.neq("slug", slug)
						.order("published_at", { ascending: false })
						.limit(3)
						.then(({ data: rel }) => setRelated(rel ?? []));
				}

				setLoading(false);
			});
	}, [slug]);

	if (notFoundState) {
		return (
			<div className='min-h-screen bg-background flex flex-col items-center justify-center gap-4 mt-14'>
				<p className='text-5xl'>📭</p>
				<h1 className='text-xl font-semibold text-foreground'>
					Article introuvable
				</h1>
				<Link
					href='/blog'
					className='flex items-center gap-1.5 text-sm text-primary hover:underline'>
					<ArrowLeft className='h-4 w-4' />
					Retour au blog
				</Link>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background mt-14'>
			{loading ? (
				<div className='mx-auto max-w-4xl px-6 py-12'>
					<ArticleSkeleton />
				</div>
			) : (
				<>
					{/* Image de couverture */}
					{article.cover_image && (
						<div className='w-full h-72 md:h-96 overflow-hidden'>
							<img
								src={article.cover_image}
								alt={article.title}
								className='w-full h-full object-cover'
							/>
						</div>
					)}

					<div className='mx-auto max-w-3xl px-6 py-10'>
						{/* Bouton retour */}
						<Link
							href='/blog'
							className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8'>
							<ArrowLeft className='h-4 w-4' />
							Retour au blog
						</Link>

						{/* Catégorie */}
						{article.category && (
							<Badge variant='secondary' className='mb-4'>
								{article.category}
							</Badge>
						)}

						{/* Titre */}
						<h1 className='font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl leading-tight mb-4'>
							{article.title}
						</h1>

						{/* Méta */}
						<div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border'>
							{article.author && (
								<span className='flex items-center gap-1.5'>
									<User className='h-4 w-4' />
									{article.author}
								</span>
							)}
							{article.published_at && (
								<span className='flex items-center gap-1.5'>
									<Calendar className='h-4 w-4' />
									{new Date(
										article.published_at,
									).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</span>
							)}
							{article.reading_time && (
								<span className='flex items-center gap-1.5'>
									<Clock className='h-4 w-4' />
									{article.reading_time} min de lecture
								</span>
							)}
						</div>

						{/* Contenu HTML */}
						{article.content ? (
							<div
								className='prose prose-neutral dark:prose-invert max-w-none'
								// biome-ignore lint/security/noDangerouslySetInnerHtml: contenu contrôlé côté admin
								dangerouslySetInnerHTML={{
									__html: article.content,
								}}
							/>
						) : (
							article.excerpt && (
								<p className='text-muted-foreground leading-relaxed text-lg'>
									{article.excerpt}
								</p>
							)
						)}
					</div>

					{/* Articles liés */}
					{related.length > 0 && (
						<section className='border-t border-border bg-card/50 py-12 mt-8'>
							<div className='mx-auto max-w-4xl px-6'>
								<h2 className='font-semibold text-foreground text-xl mb-6'>
									Articles similaires
								</h2>
								<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
									{related.map((rel) => (
										<Link
											key={rel.id}
											href={`/blog/${rel.slug}`}
											className='group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-sm block'>
											<div className='h-32 bg-muted overflow-hidden'>
												{rel.cover_image ? (
													<img
														src={rel.cover_image}
														alt={rel.title}
														className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
													/>
												) : (
													<div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
														<span className='text-2xl'>
															📰
														</span>
													</div>
												)}
											</div>
											<div className='p-4 space-y-1.5'>
												<p className='text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
													{rel.title}
												</p>
												{rel.published_at && (
													<p className='text-xs text-muted-foreground'>
														{new Date(
															rel.published_at,
														).toLocaleDateString(
															"fr-FR",
															{
																day: "numeric",
																month: "short",
																year: "numeric",
															},
														)}
													</p>
												)}
											</div>
										</Link>
									))}
								</div>
							</div>
						</section>
					)}
				</>
			)}
		</div>
	);
}
