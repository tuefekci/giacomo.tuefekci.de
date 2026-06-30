<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const resume = data.props.resume;

    import PortfolioItem from "$lib/components/portfolioItem.svelte";
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

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-[30px] gap-x-6 gap-y-4 mb-6 pb-6">
                {#each [...resume.projects].sort((a, b) => (b.date || 0) - (a.date || 0)) as project}
                    <PortfolioItem {project} />
                {/each}
            </div>

        </div>
    </div>
</div>
