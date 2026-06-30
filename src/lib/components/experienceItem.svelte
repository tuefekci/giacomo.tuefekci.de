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

<div class="p-4 mb-4 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-l-[3px] border-[#E3E3E3] dark:border-[#3D3A3A] border-l-[#FA5252] print:border-none print:bg-transparent print:p-0 print:pb-5 print:break-inside-avoid">

	{#if work.name}
		<div class="flex justify-between flex-wrap gap-2">
			<h3 class="text-xl dark:text-white">{work.name} <span class="text-sm dark:text-[#A6A6A6]">{work.location}</span></h3>
			<span class="text-sm font-semibold dark:text-[#A6A6A6]"></span>
		</div>
	{/if}

	<div class="flex justify-between flex-wrap gap-2">
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
