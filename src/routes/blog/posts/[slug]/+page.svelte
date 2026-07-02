<script lang="ts">
	import { formatDate } from '$lib/helper'

	export let data
    const resume = data.props.resume;
</script>

<svelte:head>
	<title>{data.meta.title} | {resume.basics.name}´s Blog</title>
	<meta name="description" content="{data.meta.description}" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{data.meta.title} | {resume.basics.name}´s Blog" />
	<meta property="og:description" content="{data.meta.description}" />
	<meta property="og:image" content="{data.meta.image || resume.basics.image}" />
	<meta property="og:url" content="https://giacomo.tuefekci.de/blog/posts/{data.meta.slug || data.meta.title.toLowerCase().replace(/\s+/g, '-')}" />
	<link rel="canonical" href="https://giacomo.tuefekci.de/blog/posts/{data.meta.slug}" />
</svelte:head>

<div class="pt-12 pb-6 print:pt-0">
    <div class="lg:grid grid-cols-12 md:gap-10 items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <a
                href="/blog"
                class="inline-flex items-center gap-2 text-sm text-[#7B7B7B] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors mb-6"
            >
                ← Back to Blog
            </a>

            <div class="flex justify-between items-start mb-4">
                {#if data.meta.categories && data.meta.categories.length > 0}
                    <div class="flex gap-2 flex-wrap">
                        {#each data.meta.categories as category}
                            <a
                                href="/blog?tag={category}"
                                class="text-[11px] px-3 py-1.5 rounded-full bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors"
                            >
                                #{category}
                            </a>
                        {/each}
                    </div>
                {/if}
                <p class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6]">
                    {formatDate(data.meta.date)}
                </p>
            </div>

            <h1 class="text-4xl mb-4">{data.meta.title}</h1>
            <div class="h-1 gradient-background-line mb-6"></div>

            <div class="prose dark:prose-invert max-w-none">
                <svelte:component this={data.content} />
            </div>

        </div>
    </div>
</div>
