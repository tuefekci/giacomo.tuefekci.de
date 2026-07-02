
<script>
    /** @type {import('./$types').PageData} */
    export let data;
  
    const resume = data.props.resume;

    import Experience from "$lib/components/experienceItem.svelte";
    import Education from "$lib/components/educationItem.svelte";

    import { generateGradientColors } from "$lib/helper";

    const gradientColors = generateGradientColors("#ff6565", "#CA56F2", resume.skills.length);

    function skillLevelToPercentage(level) {
        switch (level) {
            case "Novice":
                return 20;
            case "Beginner":
                return 30;
            case "Intermediate":
                return 40;
            case "Skilled":
                return 50;
            case "Proficient":
                return 60;
            case "Advanced":
                return 70;
            case "Expert":
                return 80;
            case "Master":
                return 90;
            default:
                return 0;
        }
    }

  </script>
  
<!-- SEO -->
<svelte:head>
	<title>{resume.basics.name}´s Resume / CV</title>
	<meta name="description" content="{resume.basics.summary}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{resume.basics.name}´s Resume" />
	<meta property="og:description" content="{resume.basics.summary}" />
	<meta property="og:image" content="{resume.basics.image}" />
	<link rel="canonical" href="https://giacomo.tuefekci.de/cv" />
</svelte:head>

  <div class="pt-12 pb-6 lg:pb-0 print:pt-0">

    <div class="lg:grid grid-cols-12 md:gap-10  items-center print:p-0">
      <div class="col-span-12 space-y-2.5">

        <div class="flex pb-4">
            <h2 class="text-4xl">Experience</h2>
            <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
        </div>

        {#each resume.work as work }
            <Experience {work} />
        {/each}
    </div>
    <div class="col-span-12 space-y-2.5 pt-12 print:pt-0">

        <div class="flex pb-4">
            <h2 class="text-4xl">Education</h2>
            <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-3 gap-y-3 mt-[30px]">

            {#each resume.education as education }
                <Education {education} />
            {/each}

        </div>

      </div>
    </div>
    
  </div>
  
  
  <div class="pt-12 print:pt-12 print:break-inside-avoid">
  
    <div class="flex">
        <h2 class="text-4xl">Skills</h2>
        <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
    </div>

      <div class="pt-0 grid gap-2 grid-cols-1 md:grid-cols-1 xl:grid-cols-1">
  
      {#each resume.skills as skill, index (index) }
  
        <div class="mb-0">
            <div class="flex justify-between py-1">
                <span class=" text-base text-gray-lite font-semibold dark:text-[#A6A6A6]">{skill.name}</span>
                <span class=" text-base font-semibold text-gray-lite pr-5 dark:text-[#A6A6A6]">{skillLevelToPercentage(skill.level)}%</span>
            </div>
            <svg class="rc-progress-line" viewBox="0 0 100 1" preserveAspectRatio="none">
                <path
                    class="rc-progress-line-trail"
                    d="M 0.5,0.5 L 99.5,0.5"
                    stroke-linecap="round"
                    stroke="#D9D9D9"
                    stroke-width="1"
                    fill-opacity="0"
                />
                <path
                    class="rc-progress-line-path"
                    d="M 0.5,0.5 L 99.5,0.5"
                    stroke-linecap="round"
                    stroke="{gradientColors[index]}"
                    stroke-width="1"
                    fill-opacity="0"
                    style="stroke-dasharray: {skillLevelToPercentage(skill.level)}px, 100px; stroke-dashoffset: 0px; transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s linear 0s, 0.06s;"
                />
            </svg>
        </div>
  
      {/each}
      </div>
    
  </div>
  
  <div class="pt-12 pb-6 lg:pb-0 print:pt-0 print:pb-0 print:break-inside-avoid">
  
    <div class="flex">
        <h2 class="text-4xl">Knowledge</h2>
        <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
    </div>

      <div class="pt-0 grid gap-2 grid-cols-1 md:grid-cols-1 xl:grid-cols-1">
  
      {#each resume.skills as skill }
  
        <div class="print:break-inside-avoid">
            <div class="mt-5 print:mt-0">
                <div class="flex justify-between py-1">
                    <span class=" text-base font-semibold dark:text-white">{skill.name}</span>

                </div>
                {#if skill.summary}
                    <p class="text-sm leading-relaxed dark:text-white/60 mb-3">{skill.summary}</p>
                {/if}
            </div>

            <div class="flex gap-x-2 gap-y-2 flex-wrap">
                {#each skill.keywords as keyword }
                    <div class="bg-[#F3F6F6] dark:bg-[#1D1D1D] text-[#44566C] dark:text-[#A6A6A6] print:text-black print:border text-[12px] p-2">{keyword}</div>
                {/each}
            </div>
        </div>
        
        
  
      {/each}
      </div>
    
  </div>

  {#if resume.recognition?.length}
    <div class="pt-12 pb-6 lg:pb-0">
      <div class="flex">
        <h2 class="text-4xl">Recognition</h2>
        <div class="flex grow h-1 mt-5 ml-3 gradient-background-line"></div>
      </div>
      <div class="pt-6">
        {#each resume.recognition as mention}
          <p class="text-base dark:text-white/60 pt-2">
            <a href={mention.url} target="_blank" rel="noopener" class="hover:text-[#FA5252] transition-colors">
              {mention.title}
            </a>
            <span class="text-[#7B7B7B]"> - {mention.publisher}</span>
          </p>
        {/each}
      </div>
    </div>
  {/if}


  