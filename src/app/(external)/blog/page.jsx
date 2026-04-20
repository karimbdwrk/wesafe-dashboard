"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/supabaseClient";

// Table Supabase attendue : articles
// Colonnes : id, slug, title, excerpt, cover_image, author, published_at, category, reading_time, published

function ArticleCardSkeleton() {
	return (
		<div className='rounded-xl border border-border bg-card overflow-hidden animate-pulse'>
			<div className='h-48 bg-muted' />
			<div className='p-5 space-y-3'>
				<div className='h-3 w-16 bg-muted rounded' />
				<div className='h-5 w-3/4 bg-muted rounded' />
				<div className='h-3 w-full bg-muted rounded' />
				<div className='h-3 w-2/3 bg-muted rounded' />
				<div className='flex gap-3 mt-4'>
					<div className='h-3 w-20 bg-muted rounded' />
					<div className='h-3 w-16 bg-muted rounded' />
				</div>
			</div>
		</div>
	);
}

function ArticleCard({ article }) {
	return (
		<Link
			href={`/blog/${article.slug}`}
			className='group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md block'>
			{/* Image */}
			<div className='h-48 bg-muted overflow-hidden'>
				{article.cover_image ? (
					<img
						src={article.cover_image}
						alt={article.title}
						className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				) : (
					<div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
						<span className='text-4xl'>📰</span>
					</div>
				)}
			</div>

			{/* Contenu */}
			<div className='p-5 space-y-3'>
				{article.category && (
					<Badge variant='secondary' className='text-xs'>
						{article.category}
					</Badge>
				)}

				<h2 className='font-semibold text-foreground text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors'>
					{article.title}
				</h2>

				{article.excerpt && (
					<p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
						{article.excerpt}
					</p>
				)}

				<div className='flex items-center justify-between pt-2 border-t border-border'>
					<div className='flex items-center gap-3 text-xs text-muted-foreground'>
						{article.published_at && (
							<span className='flex items-center gap-1'>
								<Calendar className='h-3 w-3' />
								{new Date(
									article.published_at,
								).toLocaleDateString("fr-FR", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
						{article.reading_time && (
							<span className='flex items-center gap-1'>
								<Clock className='h-3 w-3' />
								{article.reading_time} min
							</span>
						)}
					</div>
					<span className='flex items-center gap-1 text-xs font-medium text-primary'>
						Lire
						<ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
					</span>
				</div>
			</div>
		</Link>
	);
}

export default function BlogPage() {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("");
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		supabase
			.from("articles")
			.select(
				"id, slug, title, excerpt, cover_image, author, published_at, category, reading_time",
			)
			.eq("published", true)
			.order("published_at", { ascending: false })
			.then(({ data }) => {
				const items = data ?? [];
				setArticles(items);
				// Extraire les catégories uniques
				const cats = [
					...new Set(items.map((a) => a.category).filter(Boolean)),
				];
				setCategories(cats);
				setLoading(false);
			});
	}, []);

	const filtered = activeCategory
		? articles.filter((a) => a.category === activeCategory)
		: articles;

	return (
		<div className='min-h-screen bg-background'>
			{/* Hero */}
			<section className='border-b border-border bg-card/50 py-20 mt-14'>
				<div className='mx-auto max-w-7xl px-6 text-center'>
					<p className='text-sm font-medium tracking-widest text-primary uppercase'>
						Blog WeSafe
					</p>
					<h1 className='mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold text-foreground md:text-5xl'>
						Actualités & conseils
					</h1>
					<p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
						Retrouvez nos articles sur la sécurité privée, les
						métiers du secteur et les actualités WeSafe.
					</p>
				</div>
			</section>

			{/* Filtres catégories */}
			{categories.length > 0 && (
				<div className='border-b border-border bg-background sticky top-14 z-10'>
					<div className='mx-auto max-w-7xl px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none'>
						<button
							type='button'
							onClick={() => setActiveCategory("")}
							className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
								activeCategory === ""
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:text-foreground"
							}`}>
							Tous
						</button>
						{categories.map((cat) => (
							<button
								key={cat}
								type='button'
								onClick={() => setActiveCategory(cat)}
								className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
									activeCategory === cat
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground hover:text-foreground"
								}`}>
								{cat}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Grille articles */}
			<section className='mx-auto max-w-7xl px-6 py-12'>
				{loading ? (
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{Array.from({ length: 6 }).map((_, i) => (
							<ArticleCardSkeleton key={i} />
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className='py-20 text-center'>
						<p className='text-4xl mb-4'>📭</p>
						<p className='text-muted-foreground'>
							Aucun article pour le moment.
						</p>
					</div>
				) : (
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{filtered.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
