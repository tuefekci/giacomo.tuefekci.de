<script>
    export let project;

    function truncate(text, maxLen) {
        if (!text) return "";
        if (text.length <= maxLen) return text;
        return text.slice(0, maxLen).trimEnd() + "...";
    }
</script>

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
