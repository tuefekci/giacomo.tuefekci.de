
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import githubStats from '$lib/../data/github-stats.json';

	const resume = data.props.resume;

	const stats = {
		experience: new Date().getFullYear() - 2008,
		projects: Math.round(resume.projects?.length * 1.25) ?? 0,
		industries: resume.basics.industries?.length ?? 0,
		skills: resume.skills?.reduce((sum, s) => sum + (s.keywords?.length ?? 0), 0) ?? 0
	};
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
	<div class="grid gap-4 grid-cols-2 md:grid-cols-4">
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{stats.experience}+</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Years of Experience</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{stats.projects}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Projects Delivered</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{stats.industries}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Industries Served</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{stats.skills}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Skills &amp; Tools</p>
		</div>
	</div>
</div>

{#if resume.basics.industries?.length}
<div class="pt-12">
	<div class="flex">
		<h2 class="text-4xl">Industries</h2>
		<div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
	</div>
	<div class="pt-6 flex gap-x-2 gap-y-2 flex-wrap">
		{#each resume.basics.industries as industry}
			<div class="bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#A6A6A6] text-[12px] px-3 py-1.5 rounded">
				{industry}
			</div>
		{/each}
	</div>
</div>
{/if}

<div class="pt-12">
	<div class="flex">
		<h2 class="text-4xl">GitHub</h2>
		<div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
	</div>
	<div class="pt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{githubStats.stars}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Stars</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{githubStats.followers}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Followers</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{githubStats.publicRepos}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Public Repos</p>
		</div>
		<div class="p-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E3E3E3] dark:border-[#3D3A3A] text-center">
			<p class="text-2xl font-bold text-[#FA5252]">{githubStats.contributions.toLocaleString()}</p>
			<p class="text-[10px] text-[#44566C] dark:text-[#A6A6A6] mt-1">Contributions</p>
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


