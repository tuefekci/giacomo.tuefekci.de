<script>
    /** @type {import('./$types').PageData} */
    import { formatDate } from '$lib/helper'

	export let data
    const resume = data.props.resume;
</script>

<!-- SEO -->
<svelte:head>
	<title>{resume.basics.name}´s Blog</title>
	<meta name="description" content="Read articles and insights from {resume.basics.name}." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{resume.basics.name}´s Blog" />
	<meta property="og:description" content="{resume.basics.summary}" />
	<meta property="og:image" content="{resume.basics.image}" />
	<link rel="canonical" href="https://giacomo.tuefekci.de/blog" />
</svelte:head>

<div class="pt-12 print:pt-0 h-full">
    <div class="lg:grid grid-cols-12 md:gap-10  items-center print:p-0">
        <div class="col-span-12 space-y-2.5">

            <div class="flex pb-4">
                <h2 class="text-4xl">Blog</h2>
                <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
            </div>

            <div class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-[30px] grid gap-x-10 gap-y-7 mb-6 pb-6">
                {#each data.posts as post}
                    <div class="p-5 rounded-lg mb-2 h-full dark:border-[#212425] dark:border-2">
                        <a class="dark:text-white duration-300 transition cursor-pointer hover:text-[#FA5252] dark:hover:text-[#FA5252]" href="/blog/posts/{post.slug}">
                            <div class="overflow-hidden rounded-lg">
                                <img alt="{post.title}" src="{post.image ? post.image : "/images/placeholder.jpg"}" width="310" height="310" decoding="async" class="rounded-lg w-full cursor-pointer transition duration-200 ease-in-out transform hover:scale-110" loading="lazy">
                            </div>


                            <div class="flex mt-4 text-tiny text-gray-lite dark:text-[#A6A6A6]">
                                <span>{formatDate(post.date)}</span>
                                <span class="pl-6 relative after:absolute after:h-1 after:w-1 after:bg-gray-lite after:rounded-full after:left-2 after:top-[50%] transform after:-translate-y-1/2">Inspiration</span>
                            </div>

                            <h3 class="text-lg font-medium  mt-3 pr-4">{post.title}</h3>
                            <p class="description">{post.description}</p>
                        </a>
                    </div>
                {/each}
            </div>

        </div>
    </div>

</div>
