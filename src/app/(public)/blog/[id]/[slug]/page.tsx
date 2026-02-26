/**
 * Single blog post page — SEO-optimized with metadata.
 *
 * Renders the post markdown as HTML with syntax highlighting.
 * Generates static params for ISR.
 */

import { TextLink } from "@/components/ui"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { renderMarkdown } from "@/lib/blog/renderer"
import { parseFrontmatter } from "@/lib/blog/parser"
import type { Metadata } from "next"

interface PostPageProps {
	params: Promise<{ id: string; slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
	const { id } = await params
	const post = await prisma.post.findUnique({
		where: { id, status: "PUBLISHED" },
		select: { title: true, description: true, keywords: true, coverImage: true },
	})

	if (!post) return { title: "Post Not Found" }

	return {
		title: post.title,
		description: post.description ?? undefined,
		keywords: post.keywords,
		openGraph: {
			title: post.title,
			description: post.description ?? undefined,
			type: "article",
			images: post.coverImage ? [{ url: post.coverImage }] : undefined,
		},
	}
}

export async function generateStaticParams() {
	const posts = await prisma.post.findMany({
		where: { status: "PUBLISHED" },
		select: { id: true, slug: true },
	})

	return posts.map((post) => ({ id: post.id, slug: post.slug }))
}

export default async function PostPage({ params }: PostPageProps) {
	const { id } = await params

	const post = await prisma.post.findUnique({
		where: { id, status: "PUBLISHED" },
		include: {
			author: {
				select: { name: true, avatarUrl: true },
			},
		},
	})

	if (!post) notFound()

	// Extract markdown body from raw frontmatter+content.
	// Falls back to using content as-is for legacy posts without frontmatter.
	let markdownBody = post.content
	try {
		const parsed = parseFrontmatter(post.content)
		markdownBody = parsed.content
	} catch {
		// Legacy post without frontmatter — use full content
	}

	const html = await renderMarkdown(markdownBody)

	return (
		<div className="bg-base-100 min-h-screen">
			{/* post Header */}
			<header className="bg-base-200 border-b border-base-300 pt-20 pb-16">
				<div className="container mx-auto px-4 max-w-3xl text-center">
					<div className="flex items-center justify-center gap-2 mb-6 text-sm text-primary font-bold uppercase tracking-widest">
						<TextLink href="/blog" className="hover:underline">Blog</TextLink>
						<span>&bull;</span>
						{post.publishedAt && (
							<time dateTime={post.publishedAt.toISOString()}>
								{new Date(post.publishedAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						)}
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
						{post.title}
					</h1>
					<div className="flex items-center justify-center gap-4">
						{post.author.avatarUrl && (
							<div className="avatar">
								<div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
									<img src={post.author.avatarUrl} alt={post.author.name ?? "Author"} />
								</div>
							</div>
						)}
						<div className="text-left">
							<p className="font-bold text-lg">{post.author.name}</p>
							<p className="text-sm text-base-content/60">Author</p>
						</div>
					</div>
				</div>
			</header>

			<article className="container mx-auto px-4 py-16 max-w-3xl">
				{/* Cover image */}
				{post.coverImage && (
					<figure className="mb-12">
						<img
							src={post.coverImage}
							alt={post.title}
							className="w-full rounded-3xl shadow-2xl"
						/>
					</figure>
				)}

				{/* Content */}
				<div
					className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-3xl prose-pre:bg-base-200 prose-pre:text-base-content"
					dangerouslySetInnerHTML={{ __html: html }}
				/>

				{/* Keywords */}
				{post.keywords.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-base-200">
						{post.keywords.map((keyword) => (
							<span key={keyword} className="badge badge-lg badge-outline hover:badge-primary transition-colors cursor-default">
								#{keyword}
							</span>
						))}
					</div>
				)}
			</article>
		</div>
	)
}
