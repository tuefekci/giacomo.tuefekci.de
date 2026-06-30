<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const resume = data.props.resume;

    import { formats } from '$lib/formats';

    function mediaTypeShort(mt) {
        if (mt.includes('json')) return 'JSON';
        if (mt.includes('xml')) return 'XML';
        return mt;
    }
</script>

<svelte:head>
    <title>Export Formats | {resume.basics.name}</title>
    <meta name="description" content="Download {resume.basics.name}'s resume in 13 standard formats including JSON Resume, Schema.org, Europass, HR-XML and more." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Resume Export Formats | {resume.basics.name}" />
    <meta property="og:description" content="Resume available in 13 standard formats for AI agents, HR systems, and career platforms." />
    <meta property="og:image" content="{resume.basics.image}" />
    <link rel="canonical" href="https://giacomo.tuefekci.de/exports" />
    {#each formats as f}
        <link rel="alternate" type="{f.mediaType}" title="{f.name}" href="/{f.filename}" />
    {/each}
</svelte:head>

<div class="pt-12 print:pt-0">
    <div class="lg:grid grid-cols-12 md:gap-10 items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <div class="flex pb-4">
                <h2 class="text-4xl">Export Formats</h2>
                <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
            </div>

            <p class="text-sm dark:text-white/60 pb-4 print:hidden">
                All formats are generated from a single source (JSON Resume) and available for direct download.
                Agents and crawlers can discover these via <a href="/api/resume" class="text-[#FA5252] hover:underline">/api/resume</a>
                or <a href="/.well-known/resume" class="text-[#FA5252] hover:underline">/.well-known/resume</a>.
            </p>

            <div class="pt-2 grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                {#each formats as format}
                    <div class="p-4 space-y-2 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-l-[3px] border-[#E3E3E3] dark:border-[#3D3A3A] border-l-[#FA5252]">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="dark:text-white text-xl font-semibold">
                                {format.name}
                            </h3>
                            <span class="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FA5252]/10 text-[#FA5252] dark:text-[#FA5252]">
                                {mediaTypeShort(format.mediaType)}
                            </span>
                        </div>

                        <p class="text-[12px] dark:text-[#A6A6A6] font-mono">
                            {format.format}
                        </p>

                        <p class="text-sm leading-relaxed dark:text-white/60">
                            {format.description}
                        </p>

                        <div class="flex gap-2 pt-1">
                            <a
                                href="/{format.filename}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1 text-sm font-medium text-[#FA5252] hover:underline"
                            >
                                Download →
                            </a>
                            <a
                                href="{format.specUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1 text-sm text-[#A6A6A6] hover:text-[#FA5252]"
                            >
                                Specification ↗
                            </a>
                        </div>
                    </div>
                {/each}
            </div>

        </div>
    </div>
</div>
