/**
 * Public blog listing page.
 *
 * Displays published blog posts in a card grid with pagination.
 * SEO-optimized with metadata.
 */

import Link from "next/link"
import { ButtonLink } from "@/components/ui"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Blog",
	description: "Read our latest articles and updates.",
}

interface BlogPageProps {
	searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"
	const params = await searchParams
	const page = Math.max(1, parseInt(params.page ?? "1", 10))
	const perPage = 12
	const skip = (page - 1) * perPage

	const [posts, total] = await Promise.all([
		prisma.post.findMany({
			where: { status: "PUBLISHED" },
			orderBy: { publishedAt: "desc" },
			skip,
			take: perPage,
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				coverImage: true,
				publishedAt: true,
				author: {
					select: { name: true, avatarUrl: true },
				},
			},
		}),
		prisma.post.count({ where: { status: "PUBLISHED" } }),
	])

	const totalPages = Math.ceil(total / perPage)

	return (
		<div className="bg-base-100 min-h-screen">
			{/* Hero Header */}
			<div className="bg-base-200 border-b border-base-300 py-20">
				<div className="container mx-auto px-4 max-w-4xl text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
						Blog
					</h1>
					<p className="text-xl text-base-content/70">
						Insights, updates, and articles from the {appName} team.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-16 max-w-6xl">
				{posts.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-6xl mb-4">✍️</div>
						<p className="text-2xl font-bold">No posts yet</p>
						<p className="text-base-content/60 mt-2">Check back soon for new content!</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
							{posts.map((post) => (
								<Link
									key={post.id}
									href={`/blog/${post.id}/${post.slug}`}
									className="group flex flex-col"
								>
									{post.coverImage && (
										<div className="aspect-video overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-md transition-all">
											<img
												src={post.coverImage}
												alt={post.title}
												className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
									)}
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-3 text-sm text-primary font-semibold uppercase tracking-wider">
											{new Date(post.publishedAt!).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</div>
										<h2 className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight mb-3">
											{post.title}
										</h2>
										{post.description && (
											<p className="text-base-content/70 line-clamp-3 leading-relaxed mb-4">
												{post.description}
											</p>
										)}
									</div>
									<div className="flex items-center gap-3">
										{post.author.avatarUrl && (
											<div className="avatar">
												<div className="w-8 rounded-full">
													<img src={post.author.avatarUrl} alt={post.author.name ?? "Author"} />
												</div>
											</div>
										)}
										<span className="text-sm font-medium">{post.author.name}</span>
									</div>
								</Link>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-center mt-12">
								<div className="join">
									{page > 1 && (
										<ButtonLink
											href={`/blog?page=${page - 1}`}
											className="join-item"
										>
											Previous
										</ButtonLink>
									)}
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(p) => (
											<ButtonLink
												key={p}
												href={`/blog?page=${p}`}
												className={`join-item ${p === page ? "btn-active" : ""}`}
											>
												{p}
											</ButtonLink>
										)
									)}
									{page < totalPages && (
										<ButtonLink
											href={`/blog?page=${page + 1}`}
											className="join-item"
										>
											Next
										</ButtonLink>
									)}
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
