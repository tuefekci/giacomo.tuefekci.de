<script>
    export let path;
    export let icon = '';

    import { page } from '$app/stores';
    import { base } from '$app/paths';

    $: isActive = $page.url.pathname.replace(/\/$/, '') === (base + '/' + path).replace(/\/$/, '');

    const icons = {
        about: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        resume: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
        works: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    };
</script>

<a
    class="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-lg cursor-pointer font-medium text-sm text-[#7B7B7B] dark:text-[#7B7B7B] hover:text-[#FA5252] dark:hover:text-[#FA5252] transition-all duration-300 ease-in-out"
    href="{base}/{path}"
>
    {#if icons[icon]}
        <span class="w-5 h-5 flex-shrink-0 transition-colors duration-300">
            {@html icons[icon]}
        </span>
    {/if}
    <span><slot /></span>

    {#if isActive}
        <div class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full gradient-background-fast"></div>
    {:else}
        <div class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-transparent group-hover:bg-[#FA5252]/20 transition-all duration-300"></div>
    {/if}
</a>
