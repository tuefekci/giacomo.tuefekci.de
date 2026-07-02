<script>
    /** @type {import('./$types').PageData} */
    import { formatDate } from '$lib/helper'
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'

	export let data
    const resume = data.props.resume;

    $: activeTag = $page.url.searchParams.get('tag') || null;

    $: filteredPosts = activeTag
        ? data.posts.filter(p => p.categories && p.categories.includes(activeTag))
        : data.posts;

    $: grouped = filteredPosts.reduce((acc, p) => {
        const year = new Date(p.date).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(p);
        return acc;
    }, {});
    $: years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    $: allTags = [...new Set(data.posts.flatMap(p => p.categories || []))].sort();

    $: tagCounts = data.posts.reduce((acc, p) => {
        if (p.categories) {
            p.categories.forEach(c => {
                acc[c] = (acc[c] || 0) + 1;
            });
        }
        return acc;
    }, {});

    function truncate(text, maxLen) {
        if (!text) return "";
        if (text.length <= maxLen) return text;
        return text.slice(0, maxLen).trimEnd() + "...";
    }

    function setTag(tag) {
        if (activeTag === tag) {
            goto('/blog');
        } else {
            goto(`/blog?tag=${encodeURIComponent(tag)}`);
        }
    }
</script>

<svelte:head>
	<title>{resume.basics.name}´s Blog</title>
	<meta name="description" content="Read articles and insights from {resume.basics.name}." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{resume.basics.name}´s Blog" />
	<meta property="og:description" content="{resume.basics.summary}" />
	<meta property="og:image" content="{resume.basics.image}" />
	<link rel="canonical" href="https://giacomo.tuefekci.de/blog" />
</svelte:head>

<div class="pt-12 pb-6 print:pt-0">
    <div class="lg:grid grid-cols-12 md:gap-10 items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <div class="flex pb-4">
                <h2 class="text-4xl">Blog</h2>
                <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
            </div>

            <p class="text-sm italic text-[#7B7B7B] dark:text-[#A6A6A6] pb-6">
                This is the blog section I sometimes post stuff I'm interested in here.
            </p>

            {#if activeTag}
                <div class="flex items-center gap-2 pb-4">
                    <span class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6]">Showing posts tagged</span>
                    <button
                        on:click={() => setTag(activeTag)}
                        class="text-sm px-3 py-1 rounded-full bg-[#FA5252] text-white hover:bg-[#e03e3e] transition-colors"
                    >
                        #{activeTag} ✕
                    </button>
                    <a href="/blog" class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors">
                        Clear
                    </a>
                </div>
            {/if}

            {#if years.length === 0}
                <p class="text-sm dark:text-[#A6A6A6] text-center py-8">No posts yet.</p>
            {:else}
                {#each years as year}
                    <div class="mb-8">
                        <div class="flex items-center gap-4 mb-4">
                            <h3 class="text-2xl font-bold dark:text-white">{year}</h3>
                            <div class="flex grow h-[2px] gradient-background-line"></div>
                        </div>

                        <div class="space-y-5">
                            {#each grouped[year] as post (post.slug)}
                                <div class="pl-4 border-l-2 border-[#E3E3E3] dark:border-[#3D3A3A]">
                                    <div class="flex justify-between items-start gap-2">
                                        <a
                                            href="/blog/posts/{post.slug}"
                                            class="text-lg font-semibold dark:text-white hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors"
                                        >
                                            {post.title}
                                        </a>
                                        <span class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6] whitespace-nowrap">
                                            {formatDate(post.date)}
                                        </span>
                                    </div>

                                    {#if post.description}
                                        <p class="text-sm dark:text-white/60 mt-1 line-clamp-2">
                                            {truncate(post.description, 150)}
                                        </p>
                                    {/if}

                                    {#if post.categories && post.categories.length > 0}
                                        <div class="flex gap-1.5 flex-wrap mt-2">
                                            {#each post.categories as category}
                                                <button
                                                    on:click|stopPropagation={() => setTag(category)}
                                                    class="text-[11px] px-3 py-1 rounded-full bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors cursor-pointer"
                                                >
                                                    #{category}
                                                </button>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}

            {#if allTags.length > 0}
                <div class="pt-8 mt-8 border-t border-[#E3E3E3] dark:border-[#3D3D3D]">
                    <h3 class="text-lg font-semibold dark:text-white mb-4">Tags</h3>
                    <div class="flex gap-2 flex-wrap">
                        {#each allTags as tag}
                            <button
                                on:click={() => setTag(tag)}
                                class="text-[12px] px-3 py-1.5 rounded-full transition-colors {activeTag === tag ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252]'}"
                            >
                                #{tag} ({tagCounts[tag] || 0})
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

        </div>
    </div>
</div>
