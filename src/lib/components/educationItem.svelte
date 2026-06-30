<script>
    export let education;
	const startDate = new Date(education.startDate).getFullYear();

	var endDate;
	if(!education.endDate) {
		endDate = "Present";
	} else {
		endDate = new Date(education.endDate).getFullYear();
	}



</script>


<div class="py-4 pl-5 pr-3 space-y-2 rounded-lg dark:border-[#212425] border-2  print:break-inside-avoid print:border-none print:p-0 print:pb-5" style="background: transparent;">


	<div class="flex justify-between">
		<h3 class="text-xl dark:text-white">{education.institution} <span class="text-sm dark:text-[#A6A6A6]">{education.location}</span></h3>
		<span class=" text-sm dark:text-[#A6A6A6]"></span>
	</div>

	<div class="flex justify-between">
		<span class=" text-base font-semibold dark:text-[#A6A6A6]">{education.area}</span>
		<span class=" text-sm dark:text-[#A6A6A6]">{startDate} - {endDate}</span>
	</div>

	<p class=" leading-2 line-clamp-4 dark:text-white/60">
		{education.studyType}
		{education.summary ? education.summary : ""}
	</p>
	{#if education.courses}
		<ul class="list-disc list-inside dark:text-white/40">
			{#each education.courses as course }
				<li class="line-clamp-1">- {course}</li>
			{/each}
		</ul>
	{/if}
</div>
