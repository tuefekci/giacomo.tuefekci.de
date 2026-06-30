<script>
    /** @type {import('./$types').PageData} */

    export let path;
    import { page } from '$app/stores';  
    import { base } from '$app/paths';

</script>


<a
    class="w-full h-20 rounded-[10px] cursor-pointer font-poppins bg-[#F3F6F6] font-medium mx-2.5 text-xtiny text-gray-lite dark:text-[#A6A6A6] justify-center flex flex-col items-center transition-all duration-300 ease-in-out dark:hover:text-white dark:bg-[#212425] hover:text-white  {$page.url.pathname === path? "lg:text-white lg:dark:text-white gradient-background-fast" : ""}"
    href="{base}/{path}"
>
    <slot />
</a>