<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import { page } from '$app/stores';  
	import { base } from '$app/paths';
	const resume = data.props.resume;

	import MenuItem from '$lib/components/menuItem.svelte';
	import PageTransition from './transition.svelte'

	//<MenuItem path="blog">Blog</MenuItem>
</script>



<div class="min-h-screen dark:text-white w-full h-full gradient-background print:bg-transparent print:text-black">
	<div
		class="container w-full bg-[#F3F6F6] print:bg-transparent dark:bg-black lg:bg-transparent lg:dark:bg-transparent justify-between mx-auto py-5 lg:px-0 lg:pt-[60px] print:pt-0 print:py-0 print:p-0"
	>
	
		<div
			class="grid grid-cols-12 md:gap-5 xl:gap-10 lg:p-5 xl:p-0 justify-between lg:mt-[120px] lg:mb-[120px] print:pt-0 print:mt-0 print:p-0 print:m-0 "
		>
			<div class="col-span-12 lg:col-span-4 ">
				<div
					class="w-full mb-6 print:mb-0 lg:mb-0 mx-auto bg-white text-center dark:bg-[#111111] px-6 lg:rounded-[20px] mt-[0px] lg:mt-0 lg:sticky top-44 print:relative print:top-0 print:h-screen lg:max-h-screen {$page.url.pathname !== "/"? "hidden print:block md:block" : ""}"
					
				>
					<img
						alt="avatar"
						src="{resume.basics.image}"

						decoding="async"
						class="w-[240px] print:w-[360px]  absolute left-[50%] transform -translate-x-[50%] h-[240px] print:h-[360px] drop-shadow-xl mx-auto rounded-[20px] -mt-[140px] print:mt-0 print:relative print:left-0 print:top-0 print:mx-auto print:translate-x-0 print:translate-y-0"
						loading="lazy"
						style="color: transparent;"
					/>

					<div class="pt-[100px] pb-8 print:pt-0">

						<h1 class="mt-6 mb-1 text-4xl font-semibold dark:text-white">
							{resume.basics.name}
						</h1>

						<h2 class="mt-4 mb-4 text-[#7B7B7B] inline-block dark:bg-[#1D1D1D] print:bg-[#F3F6F6] print:text-[#1D1D1D] px-5 py-1.5 rounded-lg dark:text-[#A6A6A6]">
							{resume.basics.label}
						</h2>
						
						<div class="p-7 print:p-3 rounded-2xl mt-2 print:mt-0 bg-[#F3F6F6] dark:bg-[#1D1D1D]">

							<div class="flex py-2.5 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Location</p>
									<a class="dark:text-white break-all hover:text-[#FA5252] duration-300 transition" target="_blank" href="https://www.google.de/maps/place/{resume.basics.location.city}/">
										{resume.basics.location.city}, 
										{resume.basics.location.countryCode}
									</a>
								</div>
							</div>
							<div class="flex py-2.5 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Email</p>
									<p class="dark:text-white break-all">
										<a
											class="hover:text-[#FA5252] duration-300 transition"
											href="mailto:{resume.basics.email}">{resume.basics.email}</a
										>
									</p>
								</div>
							</div>
							<div class="flex py-2.5 border-b border-[#E3E3E3] dark:border-[#3D3A3A]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Birth & Nationality</p>
									<a class="dark:text-white break-all hover:text-[#FA5252] duration-300 transition" target="_blank" href="https://www.google.de/maps/place/{resume.basics.birth.city}/">{resume.basics.birth.date}, {resume.basics.birth.city} / {resume.basics.birth.countryCode}</a>
								</div>

							</div>

							<div class="flex py-2.5 print:border-b print:border-[#E3E3E3]">
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Languages</p>
									<div class="flex gap-x-2 gap-y-2 flex-wrap">
										{#each resume.languages as language }
											<div class="  print:text-black ">{language.language} ({language.fluency})</div>
										{/each}
									</div>

								</div>
							</div>
							
	
							<div class="flex py-2.5 hidden print:block">
								<span
									class="flex-shrink-0 socialbtn bg-white dark:bg-black text-[#C17CEB] shadow-md"
									></span
								>
								<div class="text-left ml-2.5">
									<p class="text-xs text-[#44566C] dark:text-[#A6A6A6]">Short Bio</p>
									<p class="dark:text-white text-sm">{resume.basics.summary}</p>
								</div>

							</div>

						</div>
					</div>
				</div>
			</div>

			<div class="col-span-12 lg:col-span-8">

				<header class="lg:w-[50%] h-[144px] p-[30px] -mt-[10rem] ml-auto mb-[1rem] lg:rounded-[16px] bg-white dark:bg-[#111111] print:p-0 print:hidden sm:hidden lg:block md:hidden ">
					<nav class="">
						<div class="flex">
							<MenuItem path="">About</MenuItem>
							<MenuItem path="cv">Resume</MenuItem>
							<MenuItem path="portfolio">Works</MenuItem>
						</div>
					</nav>
				</header>
		
				<div class="min-h-full mb-6 lg:mb-0 lg:px-12 pb-12 mx-auto relative bg-white dark:bg-[#111111] px-6 md:rounded-[20px] mt-[180px] md:mt-[220px] lg:mt-0 lg:max-h-full print:p-0 print:m-0 print:pt-[0px]">
					<PageTransition url={data.url}>
						<slot />
					</PageTransition>
				</div>
			</div>
		</div>
	</div>
</div>
