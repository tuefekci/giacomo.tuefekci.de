import { formats } from '$lib/formats'
import { url } from '$lib/config'

export const prerender = true

export async function GET() {
    return new Response(JSON.stringify({
        resume: {
            url: `${url}cv`,
            api: `${url}api/resume`,
            formats: Object.fromEntries(
                formats.map(f => [f.name, `${url}${f.filename}`])
            ),
        },
    }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
    })
}
