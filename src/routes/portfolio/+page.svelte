<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const resume = data.props.resume;

    import { activeFilter } from '$lib/stores/portfolioFilter';

    const visibleProjects = resume.projects.filter(p =>
        p.visibility !== "hidden" && p.visibility !== "on-request"
    );

    $: categories = [...new Set(visibleProjects.map(p => p.category).filter(Boolean))];
    $: categoryCounts = visibleProjects.reduce((acc, p) => {
        if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    $: featuredCount = visibleProjects.filter(p => p.featured).length;

    $: filtered = $activeFilter === "__featured__"
        ? visibleProjects.filter(p => p.featured)
        : $activeFilter === "__all__"
            ? visibleProjects
            : visibleProjects.filter(p => p.category === $activeFilter);
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

    function truncate(text, maxLen) {
        if (!text) return "";
        if (text.length <= maxLen) return text;
        return text.slice(0, maxLen).trimEnd() + "...";
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
                        class="text-[13px] px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 {$activeFilter === '__featured__' ? 'bg-[#FA5252] text-white shadow-sm' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                        on:click={() => $activeFilter = "__featured__"}
                    >
                        &#9733; Featured ({featuredCount})
                    </button>
                    <button
                        class="text-[13px] px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 {$activeFilter === '__all__' ? 'bg-[#FA5252] text-white shadow-sm' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                        on:click={() => $activeFilter = "__all__"}
                    >
                        All ({visibleProjects.length})
                    </button>
                </div>
                <div class="flex gap-1.5 flex-wrap">
                    {#each categories as cat}
                        <button
                            class="text-[11px] px-3 py-1.5 rounded transition-all duration-200 {$activeFilter === cat ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                            on:click={() => $activeFilter = cat}
                        >
                            {cat} ({categoryCounts[cat] || 0})
                        </button>
                    {/each}
                </div>
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
                                <div class="pl-4 border-l-2 border-[#E3E3E3] dark:border-[#3D3A3A]">
                                    <div class="flex justify-between items-start gap-2">
                                        <h4 class="text-lg font-semibold dark:text-white">{project.name}</h4>
                                    </div>

                                    {#if project.entity}
                                        <div class="text-sm dark:text-[#A6A6A6] mt-0.5">
                                            {project.entity}
                                            {#if project.customer}
                                                <span class="dark:text-[#A6A6A6]/60">for {project.customer}</span>
                                            {/if}
                                        </div>
                                    {/if}

                                    {#if project.description}
                                        <p class="text-sm dark:text-white/60 mt-1 line-clamp-2">
                                            {truncate(project.description, 200)}
                                        </p>
                                    {/if}

                                    {#if project.url}
                                        <div class="mt-1 print:hidden">
                                            <a
                                                href="{project.url}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-sm text-[#FA5252] hover:underline dark:text-[#FA5252]"
                                            >
                                                View Project →
                                            </a>
                                        </div>
                                    {/if}
                                </div>
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
