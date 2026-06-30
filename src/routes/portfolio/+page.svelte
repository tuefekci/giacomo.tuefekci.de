<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const resume = data.props.resume;

    import PortfolioItem from "$lib/components/portfolioItem.svelte";

    let activeFilter = "__featured__";

    $: categories = [...new Set(resume.projects.map(p => p.category).filter(Boolean))];
    $: categoryCounts = resume.projects.reduce((acc, p) => {
        if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    $: featuredCount = resume.projects.filter(p => p.featured).length;

    $: filtered = activeFilter === "__featured__"
        ? resume.projects.filter(p => p.featured)
        : activeFilter === "__all__"
            ? resume.projects
            : resume.projects.filter(p => p.category === activeFilter);
    $: sorted = [...filtered].sort((a, b) => (b.date || 0) - (a.date || 0));

</script>

<!-- SEO -->
<svelte:head>
	<title>{resume.basics.name}'s Portfolio</title>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{resume.basics.name}'s Portfolio" />
	<meta property="og:description" content="{resume.basics.summary}" />
	<meta property="og:img" content="{resume.basics.image}" />
</svelte:head>

<div class="pt-12 print:pt-0">
    <div class="lg:grid grid-cols-12 md:gap-10 items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <div class="flex pb-4">
                <h2 class="text-4xl">Portfolio</h2>
                <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
            </div>

            <!-- Filter Buttons -->
            <div class="flex gap-2 flex-wrap pb-2">
                <button
                    class="text-[12px] px-4 py-2 rounded transition-all duration-200 {activeFilter === '__featured__' ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                    on:click={() => activeFilter = "__featured__"}
                >
                    &#9733; Featured ({featuredCount})
                </button>
                <button
                    class="text-[12px] px-4 py-2 rounded transition-all duration-200 {activeFilter === '__all__' ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                    on:click={() => activeFilter = "__all__"}
                >
                    All ({resume.projects.length})
                </button>
                {#each categories as cat}
                    <button
                        class="text-[12px] px-4 py-2 rounded transition-all duration-200 {activeFilter === cat ? 'bg-[#FA5252] text-white' : 'bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] hover:text-[#FA5252] dark:hover:text-white'}"
                        on:click={() => activeFilter = cat}
                    >
                        {cat} ({categoryCounts[cat] || 0})
                    </button>
                {/each}
            </div>

            <!-- Project Grid -->
            <div class="grid grid-cols-1 mt-[30px] gap-y-4 mb-6 pb-6">
                {#each sorted as project (project.name)}
                    <PortfolioItem {project} />
                {/each}
            </div>

        </div>
    </div>
</div>
