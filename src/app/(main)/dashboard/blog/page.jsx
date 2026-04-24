"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bold,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Heading2,
  Italic,
  List,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

// ─── Schéma ────────────────────────────────────────────────────────────────────

const ArticleSchema = z.object({
  title: z.string().min(3, { message: "Titre requis (3 caractères min.)" }),
  slug: z
    .string()
    .min(3, { message: "Slug requis" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug : lettres minuscules, chiffres et tirets uniquement",
    }),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image: z.string().url({ message: "URL invalide" }).or(z.literal("")).optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  reading_time: z.coerce.number().int().min(1).optional().or(z.literal("")),
  published: z.boolean().default(false),
});

// ─── Upload cover image ──────────────────────────────────────────────────────

// ─── Éditeur WYSIWYG ─────────────────────────────────────────────────────────

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value ?? "")) {
      editorRef.current.innerHTML = value ?? "";
    }
  }, [value]);

  const exec = (cmd, val) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val ?? undefined);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const btn =
    "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors select-none";

  return (
    <div className="rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <div className="flex flex-wrap gap-0.5 border-border border-b p-1.5">
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("formatBlock", "h2");
          }}
        >
          <Heading2 className="h-3.5 w-3.5" /> H2
        </button>
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("formatBlock", "h3");
          }}
        >
          <Heading2 className="h-3 w-3" /> H3
        </button>
        <div className="mx-0.5 w-px self-stretch bg-border" />
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("bold");
          }}
        >
          <Bold className="h-3.5 w-3.5" /> Gras
        </button>
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("italic");
          }}
        >
          <Italic className="h-3.5 w-3.5" /> Italique
        </button>
        <div className="mx-0.5 w-px self-stretch bg-border" />
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
        >
          <List className="h-3.5 w-3.5" /> Liste à puces
        </button>
        <button
          type="button"
          className={btn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("formatBlock", "p");
          }}
        >
          Paragraphe
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        data-placeholder="Commencez à rédiger votre article…"
        className="min-h-52 px-3 py-2 text-sm outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] [&_b]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:font-bold [&_h2]:text-lg [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-base [&_i]:italic [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
      />
    </div>
  );
}

function CoverImageUpload({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Fichier invalide", {
        description: "Sélectionnez une image (jpg, png, webp…)",
      });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `cover-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("articles").upload(filename, file, { upsert: true });
    if (uploadError) {
      toast.error("Erreur upload", { description: uploadError.message });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("articles").getPublicUrl(filename);
    onChange(urlData.publicUrl);
    setUploading(false);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: drop zone contains a nested <button> — <button> inside <button> is invalid HTML
    <div
      role="button"
      tabIndex={0}
      className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      } ${value ? "h-44" : "h-32"}`}
      onClick={() => !uploading && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!uploading) inputRef.current?.click();
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
    >
      {uploading ? (
        <div className="pointer-events-none flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xs">Upload en cours…</span>
        </div>
      ) : value ? (
        <>
          <img src={value} alt="Couverture" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-2 right-2 rounded-full border border-border bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors hover:bg-black/20 hover:opacity-100">
            <span className="rounded bg-black/50 px-2 py-1 font-medium text-white text-xs">Changer l&apos;image</span>
          </div>
        </>
      ) : (
        <div className="pointer-events-none flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-6 w-6" />
          <span className="text-center text-xs leading-relaxed">
            Glisser-déposer ou cliquer
            <br />
            pour choisir une image
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ─── Utilitaire slug ──────────────────────────────────────────────────────────

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Helpers capitalisation ───────────────────────────────────────────────────

const capSentence = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v);
const capWords = (v) => (v ? v.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()) : v);

// ─── Card article ─────────────────────────────────────────────────────────────

function ArticleCard({ article, onEdit, onDelete, onTogglePublish }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Image */}
      <div className="h-36 shrink-0 overflow-hidden bg-muted">
        {article.cover_image ? (
          <img src={article.cover_image} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">📰</div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {article.category && (
              <Badge variant="secondary" className="mb-1 text-xs">
                {article.category}
              </Badge>
            )}
            <h3 className="line-clamp-2 font-semibold text-foreground text-sm leading-snug">{article.title}</h3>
          </div>
          <Badge variant={article.published ? "default" : "outline"} className="shrink-0 text-xs">
            {article.published ? "Publié" : "Brouillon"}
          </Badge>
        </div>

        {article.excerpt && <p className="line-clamp-2 text-muted-foreground text-xs">{article.excerpt}</p>}

        <div className="mt-auto flex items-center gap-3 border-border border-t pt-2 text-muted-foreground text-xs">
          {article.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.published_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {article.reading_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time} min
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-1">
          <Button size="sm" variant="outline" className="h-7 flex-1 gap-1 text-xs" onClick={() => onEdit(article)}>
            <Pencil className="h-3 w-3" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            title={article.published ? "Dépublier" : "Publier"}
            onClick={() => onTogglePublish(article)}
          >
            {article.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          {article.published && (
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
              <Link href={`/blog/${article.slug}`} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(article)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Formulaire article ───────────────────────────────────────────────────────

function ArticleForm({ article, onClose, onSaved }) {
  const isEdit = !!article;

  const form = useForm({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      cover_image: article?.cover_image ?? "",
      author: article?.author ?? "",
      category: article?.category ?? "",
      reading_time: article?.reading_time ?? "",
      published: article?.published ?? false,
    },
  });

  // Réinitialise le formulaire quand l'article change (mode édition)
  useEffect(() => {
    form.reset({
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      cover_image: article?.cover_image ?? "",
      author: article?.author ?? "",
      category: article?.category ?? "",
      reading_time: article?.reading_time ?? "",
      published: article?.published ?? false,
    });
  }, [article, form.reset]);

  // Auto-slug depuis le titre (seulement en création)
  const titleValue = form.watch("title");
  useEffect(() => {
    if (!isEdit) {
      form.setValue("slug", toSlug(titleValue ?? ""));
    }
  }, [titleValue, isEdit, form]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      reading_time: data.reading_time === "" ? null : Number(data.reading_time),
      cover_image: data.cover_image || null,
      published_at: data.published ? (article?.published_at ?? new Date().toISOString()) : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("articles").update(payload).eq("id", article.id));
    } else {
      ({ error } = await supabase.from("articles").insert([payload]));
    }

    if (error) {
      toast.error("Erreur", { description: error.message });
      return;
    }

    toast.success(isEdit ? "Article mis à jour" : "Article créé");
    onSaved();
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Titre *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titre de l'article"
                    {...field}
                    onChange={(e) => field.onChange(capSentence(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="mon-article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Métiers, Formation…"
                    {...field}
                    onChange={(e) => field.onChange(capWords(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auteur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Équipe WeSafe"
                    {...field}
                    onChange={(e) => field.onChange(capWords(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reading_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temps de lecture (min)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cover_image"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Image de couverture</FormLabel>
                <FormControl>
                  <CoverImageUpload value={field.value ?? ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Extrait</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={2}
                    placeholder="Courte description affichée dans la liste…"
                    className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onChange={(e) => field.onChange(capSentence(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <RichEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  id="published"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
              </FormControl>
              <FormLabel htmlFor="published" className="cursor-pointer font-normal">
                Publier l&apos;article
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer l'article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function BlogAdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("id, slug, title, excerpt, content, cover_image, author, category, reading_time, published, published_at")
      .order("created_at", { ascending: false });
    setArticles(data ?? []);
    setLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchArticles is stable — defined at module scope relative to this effect
  useEffect(() => {
    async function init() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        router.replace("/unauthorized");
        return;
      }
      const { data: admin } = await supabase.from("admins").select("role").eq("id", user.id).maybeSingle();
      if (admin?.role !== "super_admin") {
        router.replace("/unauthorized");
        return;
      }
      setIsAuthorized(true);
      fetchArticles();
    }
    init();
  }, [router]);

  const handleEdit = (article) => {
    setEditArticle(article);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditArticle(null);
    setFormOpen(true);
  };

  const handleTogglePublish = async (article) => {
    const newValue = !article.published;
    const { error } = await supabase
      .from("articles")
      .update({
        published: newValue,
        published_at: newValue ? new Date().toISOString() : null,
      })
      .eq("id", article.id);

    if (error) {
      toast.error("Erreur", { description: error.message });
      return;
    }
    toast.success(newValue ? "Article publié" : "Article dépublié");
    fetchArticles();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("articles").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Erreur", { description: error.message });
    } else {
      toast.success("Article supprimé");
      fetchArticles();
    }
    setDeleteTarget(null);
  };

  const published = articles.filter((a) => a.published).length;
  const drafts = articles.filter((a) => !a.published).length;

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl text-foreground">Blog</h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            {published} publié{published > 1 ? "s" : ""} · {drafts} brouillon{drafts > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={handleNew} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-36 bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-4xl">📝</p>
          <p className="font-medium text-foreground">Aucun article pour le moment</p>
          <p className="mt-1 text-muted-foreground text-sm">Commencez par créer votre premier article.</p>
          <Button onClick={handleNew} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Créer un article
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}

      {/* Dialog formulaire */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditArticle(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editArticle ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          </DialogHeader>
          <ArticleForm
            key={editArticle?.id ?? "new"}
            article={editArticle}
            onClose={() => setFormOpen(false)}
            onSaved={fetchArticles}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;article ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteTarget?.title} » sera supprimé définitivement. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
