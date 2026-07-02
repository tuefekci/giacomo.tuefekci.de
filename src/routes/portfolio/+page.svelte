<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const resume = data.props.resume;

    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import PortfolioItem from '$lib/components/portfolioItem.svelte';

    const visibleProjects = data.fullDetails
        ? resume.projects
        : resume.projects.filter(p =>
            p.visibility !== "hidden" && p.visibility !== "on-request"
        );

    $: categories = [...new Set(visibleProjects.map(p => p.category).filter(Boolean))];
    $: categoryCounts = visibleProjects.reduce((acc, p) => {
        if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    $: featuredCount = visibleProjects.filter(p => p.featured).length;

    $: activeCategory = (() => {
        const hash = $page.url.hash;
        const match = hash.match(/#category=(.*)/);
        return match ? decodeURIComponent(match[1]) : '__featured__';
    })();

    $: filtered = activeCategory === '__featured__'
        ? visibleProjects.filter(p => p.featured)
        : activeCategory === '__all__'
            ? visibleProjects
            : visibleProjects.filter(p => p.category === activeCategory);
    $: sorted = [...filtered].sort((a, b) => (b.startDate || 0) - (a.startDate || 0));

    $: grouped = sorted.reduce((acc, p) => {
        const start = p.startDate ? parseInt(p.startDate) : null;
        const end = p.endDate ? parseInt(p.endDate) : start;
        if (start === null) {
            if (!acc["Unknown"]) acc["Unknown"] = [];
            acc["Unknown"].push(p);
        } else {
            for (let y = start; y <= end; y++) {
                const year = String(y);
                if (!acc[year]) acc[year] = [];
                acc[year].push(p);
            }
        }
        return acc;
    }, {});
    $: years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    function setCategory(cat) {
        if (activeCategory === cat) {
            goto('/portfolio');
        } else {
            goto(`/portfolio#category=${encodeURIComponent(cat)}`);
        }
    }
</script>

<svelte:head>
    <title>{resume.basics.name}'s Portfolio</title>
    <meta name="description" content="{resume.basics.summary}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{resume.basics.name}'s Portfolio" />
    <meta property="og:description" content="{resume.basics.summary}" />
    <meta property="og:image" content="{resume.basics.image}" />
    <link rel="canonical" href="https://giacomo.tuefekci.de/portfolio" />
</svelte:head>

<div class="pt-12 print:pt-0">
    <div class="lg:grid grid-cols-12 md:gap-10 items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <div class="flex pb-4">
                <h2 class="text-4xl">Portfolio</h2>
                <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
            </div>

            <div class="print:hidden">
                <div class="flex gap-2 pb-1.5">
                    <button
                        class="text-[13px] px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 {activeCategory === '__featured__' ? 'bg-[#FA5252] text-white shadow-sm' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                        on:click={() => setCategory('__featured__')}
                    >
                        &#9733; Featured ({featuredCount})
                    </button>
                    <button
                        class="text-[13px] px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 {activeCategory === '__all__' ? 'bg-[#FA5252] text-white shadow-sm' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                        on:click={() => setCategory('__all__')}
                    >
                        All ({visibleProjects.length})
                    </button>
                </div>
                <div class="flex gap-1.5 flex-wrap">
                    {#each categories as cat}
                        <button
                            class="text-[11px] px-3 py-1.5 rounded transition-all duration-200 {activeCategory === cat ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                            on:click={() => setCategory(cat)}
                        >
                            {cat} ({categoryCounts[cat] || 0})
                        </button>
                    {/each}
                </div>

                {#if activeCategory && activeCategory !== '__featured__' && activeCategory !== '__all__'}
                    <div class="flex items-center gap-2 pt-2">
                        <span class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6]">Showing</span>
                        <button
                            on:click={() => setCategory(activeCategory)}
                            class="text-sm px-3 py-1 rounded-full bg-[#FA5252] text-white hover:bg-[#e03e3e] transition-colors"
                        >
                            #{activeCategory} ✕
                        </button>
                        <a href="/portfolio" class="text-sm text-[#7B7B7B] dark:text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-colors">
                            Clear
                        </a>
                    </div>
                {/if}
            </div>

            <p class="text-[10px] text-[#A6A6A6] dark:text-[#A6A6A6]/60 pb-2 print:hidden">
                Projects shown under employer or client names are based on publicly available information. Not all professional work is listed due to NDAs. All trademarks belong to their respective owners.
            </p>

            <!-- Year-Grouped Timeline -->
            <div class="mt-[30px] mb-6 pb-6">
                {#each years as year}
                    <div class="mb-8">
                        <div class="flex items-center gap-4 mb-4">
                            <h3 class="text-2xl font-bold dark:text-white">{year}</h3>
                            <div class="flex grow h-[2px] gradient-background-line"></div>
                        </div>

                        <div class="space-y-5">
                            {#each grouped[year] as project (project.name)}
                                <PortfolioItem {project} />
                            {/each}
                        </div>
                    </div>
                {/each}

                {#if years.length === 0}
                    <p class="text-sm dark:text-[#A6A6A6] text-center py-8">No projects match this filter.</p>
                {/if}
            </div>

        </div>
    </div>
</div>
