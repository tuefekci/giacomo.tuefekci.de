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


<div class="p-4 space-y-2 rounded bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-l-[3px] border-[#E3E3E3] dark:border-[#3D3A3A] border-l-[#FA5252] print:border-none print:bg-transparent print:p-0 print:pb-5 print:break-inside-avoid">


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
