import * as config from '$lib/config'
import type { Post } from '$lib/types'

export async function GET({ fetch }) {
	const response = await fetch('api/posts')
	const posts: Post[] = await response.json()

	const headers = { 'Content-Type': 'application/xml' }

	const pages = [
		{ loc: config.url, priority: '1.0', changefreq: 'monthly' },
		{ loc: `${config.url}cv`, priority: '0.9', changefreq: 'monthly' },
		{ loc: `${config.url}portfolio`, priority: '0.9', changefreq: 'monthly' },
		{ loc: `${config.url}blog`, priority: '0.8', changefreq: 'weekly' },
		...posts.map(p => ({
			loc: `${config.url}blog/posts/${p.slug}`,
			priority: '0.7' as const,
			changefreq: 'monthly' as const
		}))
	]

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${pages.map(p => `
				<url>
					<loc>${p.loc}</loc>
					<priority>${p.priority}</priority>
					<changefreq>${p.changefreq}</changefreq>
				</url>
			`).join('')}
		</urlset>
	`.trim()

	return new Response(xml, { headers })
}
