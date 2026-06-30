import { formats } from '$lib/formats'
import { url } from '$lib/config'

export const prerender = true

export async function GET() {
    return new Response(JSON.stringify({
        formats: formats.map(f => ({
            name: f.name,
            format: f.format,
            mediaType: f.mediaType,
            url: `${url}${f.filename}`,
            specUrl: f.specUrl,
            description: f.description,
        })),
    }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
    })
}
