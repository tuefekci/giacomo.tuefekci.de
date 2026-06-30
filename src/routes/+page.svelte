
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	const resume = data.props.resume;
</script>

<!-- SEO -->
<svelte:head>
	<title>About {resume.basics.name}</title>
	<meta name="description" content="{resume.basics.summary}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="About {resume.basics.name}" />
	<meta property="og:description" content="{resume.basics.summary}" />
	<meta property="og:image" content="{resume.basics.image}" />
	<link rel="canonical" href="https://giacomo.tuefekci.de/" />
</svelte:head>


<div class="pt-12">

  <div class="flex">
      <h2 class="text-4xl">About Me</h2>
      <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
  </div>

  <div class="lg:grid grid-cols-12 md:gap-10 pt-4 md:pt-[30px] items-center">
    <div class="col-span-12 space-y-2.5">
      <div class="">
        <p class="text-gray-lite dark:text-white/60 leading-7">
          {resume.basics.summary}
        </p>

      </div>
    </div>
  </div>
  
</div>


<div class="pt-12">

  <div class="flex">
      <h2 class="text-4xl">What I do!</h2>
      <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
  </div>

	<div class="pt-6 grid gap-x-3 gap-y-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">

    {#each resume.skills as skill }

      <div class="p-4 space-y-2 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-l-[3px] border-[#E3E3E3] dark:border-[#3D3A3A] border-l-[#FA5252] break-all">
          <h3 class="dark:text-white text-xl font-semibold">
            {skill.name}
          </h3>
          <p class="text-sm leading-relaxed line-clamp-4 dark:text-white/60">
            {skill.summary}
          </p>
      </div>

    {/each}
	</div>
  
</div>

<div class="pt-12">

  <div class="flex">
      <h2 class="text-4xl">Interests</h2>
      <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
  </div>

	<div class="pt-6 grid gap-2 grid-cols-1 md:grid-cols-1 xl:grid-cols-1">

    {#each resume.interests as interest }

      <div class="dark:bg-transparen pb-6">
        <div class="space-y-1">
          <h3 class="dark:text-white text-xl font-semibold">
            {interest.name}
          </h3>
          <p class=" leading-8 dark:text-white/60">
            {interest.summary}
          </p>
          {#if interest.keywords}
            <div class="flex gap-x-2 gap-y-2 flex-wrap">
                {#each interest.keywords as keyword }
                    <div class="bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] print:text-black print:border text-[12px] p-2">{keyword}</div>
                {/each}
                
            </div>
          {/if}
        </div>
      </div>

    {/each}
	</div>
  
</div>


