<script>
    export let project;

    function getTechKeywords(highlights) {
        if (!highlights) return [];
        return highlights
            .filter(h => h.startsWith("Technology: "))
            .map(h => h.replace("Technology: ", ""));
    }

    function getServiceKeywords(highlights) {
        if (!highlights) return [];
        return highlights
            .filter(h => !h.startsWith("Technology: "));
    }

    const techs = getTechKeywords(project.highlights);
    const services = getServiceKeywords(project.highlights);

    function truncate(text, maxLen) {
        if (!text) return "";
        if (text.length <= maxLen) return text;
        return text.slice(0, maxLen).trimEnd() + "...";
    }
</script>

<div class="py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-[#212425] border-2 print:break-inside-avoid print:border-none print:p-0 print:pb-5" style="background: transparent;">
    <div class="flex justify-between items-start gap-2">
        <h3 class="text-xl dark:text-white">{project.name}</h3>
        {#if project.date}
            <span class="text-sm font-semibold dark:text-[#A6A6A6] whitespace-nowrap">{project.date}</span>
        {/if}
    </div>

    {#if project.entity}
        <div class="flex justify-between">
            <span class="text-base font-semibold dark:text-[#A6A6A6]">{project.entity}</span>
        </div>
    {/if}

    {#if project.description}
        <p class="leading-2 line-clamp-3 text-sm dark:text-white/60">
            {truncate(project.description, 300)}
        </p>
    {/if}

    {#if services.length > 0}
        <div class="flex gap-x-2 gap-y-2 flex-wrap pt-1">
            {#each services as service}
                <div class="bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] print:text-black print:border text-[12px] p-2 rounded">{service}</div>
            {/each}
        </div>
    {/if}

    {#if techs.length > 0}
        <div class="flex gap-x-2 gap-y-2 flex-wrap pt-1">
            {#each techs as tech}
                <div class="bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] print:text-black print:border text-[12px] p-2 rounded">{tech}</div>
            {/each}
        </div>
    {/if}

    {#if project.url}
        <div class="pt-2">
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
