<script>
    export let work;

	var startDate;
	if(!work.startDate) {
		startDate = "";
	} else {
		startDate = new Date(work.startDate).getFullYear();
	}

	var endDate;
	if(!work.endDate) {
		endDate = "Present";
	} else {
		endDate = new Date(work.endDate).getFullYear();
	}
</script>

<div class="py-4 pl-5 pr-3 space-y-2 mb-6 rounded-lg dark:border-[#212425] border-2 print:break-inside-avoid print:border-none print:p-0 print:pb-5" style="background: transparent;">

	{#if work.name}
		<div class="flex justify-between">
			<h3 class="text-xl dark:text-white">{work.name} <span class="text-sm dark:text-[#A6A6A6]">{work.location}</span></h3>
			<span class="text-sm font-semibold dark:text-[#A6A6A6]"></span>
		</div>
	{/if}

	<div class="flex justify-between">
		<span class=" text-base font-semibold dark:text-[#A6A6A6]">{work.position}</span>
		<span class=" text-sm dark:text-[#A6A6A6]">{startDate} - {endDate}</span>
	</div>

	{#if work.summary}
		<p class="leading-2 line-clamp-4 text-sn  dark:text-white/60">
			{work.summary}
		</p>
	{/if}

	{#if work.highlights}
		<ul class="list-disc list-inside dark:text-white/40">
			{#each work.highlights as highlight }
				<li class="line-clamp-1 text-sm ">- {highlight}</li>
			{/each}
		</ul>
	{/if}


</div>
